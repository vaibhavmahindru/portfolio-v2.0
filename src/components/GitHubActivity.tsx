import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { profile } from "@/config/profile";

/* ─── Types ─── */
interface ContribDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContribStats {
  totalContribs: number;
  currentStreak: number;
  longestStreak: number;
  publicRepos: number;
  isLive: boolean;
  todayCount: number;
}

/* ─── Constants ─── */
const CACHE_KEY = "vm-github-contrib-v6";
const CACHE_TTL = 1000 * 60 * 60;

/* ─── Timezone-safe date helpers ─── */
const pad2 = (n: number) => String(n).padStart(2, "0");
const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

/* ─── SVG Heatmap Colors (CSS HSL values matching --primary: 158 64% 51%) ─── */
const CELL_COLORS: Record<number, string> = {
  0: "hsl(0 0% 18%)",       // empty / muted
  1: "hsl(158 64% 20%)",    // light green
  2: "hsl(158 64% 33%)",    // medium green
  3: "hsl(158 64% 43%)",    // dark green
  4: "hsl(158 64% 51%)",    // primary green
};

/* ─── Hook: fetch contributions ─── */
const useGitHubContributions = (username: string) => {
  const [data, setData] = useState<ContribDay[]>([]);
  const [stats, setStats] = useState<ContribStats>({
    totalContribs: 0, currentStreak: 0, longestStreak: 0,
    publicRepos: 0, isLive: false, todayCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const calcStreaks = useCallback((days: ContribDay[]) => {
    // Current streak: walk backwards from today (not from end of array,
    // because the API returns future dates with count 0).
    const todayStr = fmtDate(new Date());
    let todayIdx = days.findIndex((d) => d.date === todayStr);
    if (todayIdx === -1) todayIdx = days.length - 1; // fallback

    let current = 0;
    let startIdx = todayIdx;
    // If today has 0 contributions, start from yesterday (day may not be over yet).
    if (startIdx >= 0 && days[startIdx].count === 0) startIdx--;
    for (let i = startIdx; i >= 0; i--) {
      if (days[i].count > 0) current++;
      else break;
    }

    // Longest streak: scan the entire array for the longest consecutive run.
    let longest = 0;
    let run = 0;
    for (const day of days) {
      if (day.count > 0) {
        run++;
        longest = Math.max(longest, run);
      } else {
        run = 0;
      }
    }

    return { current, longest };
  }, []);

  const generateFallback = useCallback((): ContribDay[] => {
    const days: ContribDay[] = [];
    const today = new Date();
    const jan1 = new Date(today.getFullYear(), 0, 1);
    const cursor = new Date(jan1);
    while (cursor <= today) {
      const count = Math.random() > 0.3 ? Math.floor(Math.random() * 8) : 0;
      days.push({
        date: fmtDate(cursor),
        count,
        level: (count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4) as ContribDay["level"],
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      // Check cache
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_TTL && Array.isArray(parsed.data) && parsed.data.length > 0) {
            if (!cancelled) {
              setData(parsed.data);
              setStats(parsed.stats);
              setLoading(false);
            }
            return;
          }
        }
      } catch { /* cache corrupt, continue */ }

      let days: ContribDay[] = [];
      let publicRepos = 0;
      let isLive = false;

      try {
        // Fetch in parallel: contributions calendar + user profile
        const [calRes, userRes] = await Promise.allSettled([
          fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${new Date().getFullYear()}`),
          fetch(`https://api.github.com/users/${username}`),
        ]);

        // Parse user data
        if (userRes.status === "fulfilled" && userRes.value.ok) {
          const u = await userRes.value.json();
          publicRepos = u?.public_repos ?? 0;
        }

        // Parse contributions — API returns {contributions: [{date, count, level}, ...], total: {lastYear: N}}
        if (calRes.status === "fulfilled" && calRes.value.ok) {
          const body = await calRes.value.json();
          const raw = body.contributions;

          if (Array.isArray(raw) && raw.length > 0) {
            days = raw.map((d: { date: string; count: number; level: number }) => ({
              date: d.date,
              count: d.count,
              level: Math.min(d.level, 4) as ContribDay["level"],
            }));
            days.sort((a, b) => a.date.localeCompare(b.date));
            isLive = true;
          } else if (raw && typeof raw === "object" && !Array.isArray(raw)) {
            // Fallback: contributions is a dict {date: {count, level}}
            days = Object.entries(raw).map(([date, val]: [string, any]) => ({
              date,
              count: val.count ?? 0,
              level: Math.min(val.level ?? 0, 4) as ContribDay["level"],
            }));
            days.sort((a, b) => a.date.localeCompare(b.date));
            isLive = true;
          }
        }

        // Fallback: GitHub events API
        if (days.length === 0) {
          const evRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`);
          if (evRes.ok) {
            const events = await evRes.json();
            const today = new Date();
            const jan1 = new Date(today.getFullYear(), 0, 1);
            const map: Record<string, number> = {};
            const c = new Date(jan1);
            while (c <= today) { map[fmtDate(c)] = 0; c.setDate(c.getDate() + 1); }
            if (Array.isArray(events)) {
              for (const ev of events) {
                const d = ev.created_at?.split("T")[0];
                if (d && d in map) {
                  map[d] += ev.type === "PushEvent" ? (ev.payload?.commits?.length ?? 1) :
                            ev.type === "PullRequestEvent" ? 3 :
                            ev.type === "CreateEvent" ? 2 : 1;
                }
              }
            }
            const max = Math.max(...Object.values(map), 1);
            days = Object.entries(map).map(([date, count]) => ({
              date, count,
              level: (count === 0 ? 0 : count <= max * 0.25 ? 1 : count <= max * 0.5 ? 2 : count <= max * 0.75 ? 3 : 4) as ContribDay["level"],
            }));
            isLive = true;
          }
        }
      } catch {
        // Network completely down
      }

      // Final fallback: generated data
      if (days.length === 0) {
        days = generateFallback();
        isLive = false;
      }

      // Filter to current year only
      const thisYear = String(new Date().getFullYear());
      const last365 = days.filter((d) => d.date.startsWith(thisYear));
      const streaks = calcStreaks(last365);
      const todayStr = fmtDate(new Date());
      const todayCount = last365.find((d) => d.date === todayStr)?.count ?? 0;
      const totalContribs = last365.reduce((s, d) => s + d.count, 0);

      const finalStats: ContribStats = {
        totalContribs, currentStreak: streaks.current, longestStreak: streaks.longest,
        publicRepos, isLive, todayCount,
      };

      if (!cancelled) {
        setData(last365);
        setStats(finalStats);
        setLoading(false);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: last365, stats: finalStats, timestamp: Date.now(),
          }));
        } catch { /* storage full */ }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [username, calcStreaks, generateFallback]);

  return { data, stats, loading };
};

/* ─── Build SVG heatmap data (53 weeks × 7 days) ─── */
interface HeatmapCell {
  x: number;
  y: number;
  date: string;
  count: number;
  level: number;
  empty: boolean;
}

const CELL_SIZE = 10;
const CELL_GAP = 2;
const ROWS = 7;

const buildSvgCells = (data: ContribDay[]): { cells: HeatmapCell[]; cols: number } => {
  const lookup = new Map<string, ContribDay>();
  for (const d of data) lookup.set(d.date, d);

  const year = new Date().getFullYear();

  // Grid starts on the Sunday on or before Jan 1
  const jan1 = new Date(year, 0, 1);
  const gridStart = addDays(jan1, -jan1.getDay());

  // Grid ends on the Saturday on or after Dec 31
  const dec31 = new Date(year, 11, 31);
  const gridEnd = addDays(dec31, 6 - dec31.getDay());

  const cells: HeatmapCell[] = [];
  const cursor = new Date(gridStart);
  let col = 0;

  while (cursor <= gridEnd) {
    for (let row = 0; row < ROWS; row++) {
      const key = fmtDate(cursor);
      const found = lookup.get(key);
      const isOutOfYear = cursor.getFullYear() !== year;
      cells.push({
        x: col * (CELL_SIZE + CELL_GAP),
        y: row * (CELL_SIZE + CELL_GAP),
        date: key,
        count: found?.count ?? 0,
        level: found?.level ?? 0,
        empty: isOutOfYear,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    col++;
  }

  return { cells, cols: col };
};

/* ─── Component ─── */
const GitHubActivity = () => {
  const username = profile.links.github.split("/").pop() ?? "vaibhavmahindru";
  const { data, stats, loading } = useGitHubContributions(username);

  const { cells, cols } = useMemo(() => buildSvgCells(data), [data]);

  const svgWidth = cols * (CELL_SIZE + CELL_GAP) - CELL_GAP;
  const svgHeight = ROWS * (CELL_SIZE + CELL_GAP) - CELL_GAP;

  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glow-border rounded-md bg-card overflow-hidden h-full flex flex-col min-w-0"
    >
      {/* Header */}
      <div className="p-4 pb-3 sm:p-5 sm:pb-4 border-b border-border/50 min-w-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Github className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-mono text-xs text-foreground font-medium">GitHub</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {stats.isLive ? "Live Data" : "Simulated"}
              </p>
            </div>
          </div>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-primary hover:text-primary/80 transition-colors"
          >
            @{username}
          </a>
        </div>

        {/* Stats grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-1 scrollbar-none sm:grid sm:grid-cols-4 sm:overflow-visible sm:snap-none sm:pb-0">
          {[
            { label: "CONTRIBS", value: loading ? "--" : (stats.totalContribs ?? 0).toLocaleString(), accent: true },
            { label: "STREAK", value: loading ? "--" : `${stats.currentStreak ?? 0}d`, accent: false },
            { label: "REPOS", value: loading ? "--" : String(stats.publicRepos ?? 0), accent: false },
            { label: "TODAY", value: loading ? "--" : String(stats.todayCount ?? 0), accent: (stats.todayCount ?? 0) > 0 },
          ].map((s) => (
            <div key={s.label} className="snap-start shrink-0 w-[28vw] max-w-[120px] sm:w-auto sm:max-w-none sm:shrink min-w-0 bg-secondary/50 rounded-sm p-2 sm:p-2.5">
              <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wide sm:tracking-wider">{s.label}</p>
              <p className={`font-mono text-sm font-medium mt-0.5 ${s.accent ? "text-primary" : "text-foreground"}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="px-3 py-3 sm:px-5 sm:py-4 flex-1 min-w-0 overflow-hidden">
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-3">
          Contributions — {new Date().getFullYear()}
        </p>
        {loading ? (
          <div className="h-[90px] skeleton rounded-sm" />
        ) : (
          <div className="relative">
            <div className="overflow-x-auto group">
              {/* Mobile scroll hint */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none z-10 opacity-100 group-hover:opacity-0 transition-opacity md:hidden" />
              <svg
                width={svgWidth}
                height={svgHeight}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="block"
                role="img"
                aria-label="GitHub contribution heatmap"
              >
                {cells.map((cell, i) =>
                  cell.empty ? null : (
                    <rect
                      key={i}
                      x={cell.x}
                      y={cell.y}
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      rx={2}
                      fill={CELL_COLORS[cell.level] ?? CELL_COLORS[0]}
                      className="transition-opacity hover:opacity-80 cursor-crosshair"
                      onMouseEnter={(e) => {
                        const rect = (e.target as SVGRectElement).getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          text: `${cell.date}: ${cell.count} contribution${cell.count !== 1 ? "s" : ""}`,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  )
                )}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-3 font-mono text-[9px] text-muted-foreground">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((lvl) => (
                <svg key={lvl} width={10} height={10}>
                  <rect width={10} height={10} rx={2} fill={CELL_COLORS[lvl]} />
                </svg>
              ))}
              <span>More</span>
            </div>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="fixed z-50 px-2 py-1 rounded bg-popover text-popover-foreground text-[10px] font-mono shadow-lg pointer-events-none whitespace-nowrap"
                style={{
                  left: tooltip.x,
                  top: tooltip.y - 28,
                  transform: "translateX(-50%)",
                }}
              >
                {tooltip.text}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GitHubActivity;
