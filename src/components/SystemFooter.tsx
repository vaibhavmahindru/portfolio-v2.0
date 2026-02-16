import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Globe, Terminal } from "lucide-react";
import { profile } from "@/config/profile";

/* ─── Interaction Event Logger ─── */
interface InteractionEvent {
  type: string;
  target: string;
  time: number;
}

const eventLog: InteractionEvent[] = [];
const MAX_EVENTS = 50;

const logInteraction = (type: string, target: string) => {
  eventLog.unshift({ type, target, time: Date.now() });
  if (eventLog.length > MAX_EVENTS) eventLog.pop();
};

// Global event listeners
if (typeof window !== "undefined") {
  const initTracking = () => {
    window.addEventListener(
      "click",
      (e) => {
        const el = e.target as HTMLElement;
        const label =
          el.closest("[aria-label]")?.getAttribute("aria-label") ||
          el.closest("button")?.textContent?.slice(0, 30) ||
          el.closest("a")?.textContent?.slice(0, 30) ||
          el.tagName.toLowerCase();
        logInteraction("click", label);
      },
      { passive: true }
    );
    window.addEventListener(
      "scroll",
      (() => {
        let last = 0;
        return () => {
          const now = Date.now();
          if (now - last > 3000) {
            logInteraction("scroll", `Y=${Math.round(window.scrollY)}`);
            last = now;
          }
        };
      })(),
      { passive: true }
    );
  };
  if (document.readyState === "complete") initTracking();
  else window.addEventListener("load", initTracking, { once: true });
}

/* ─── Network Request Tracker ─── */
interface NetworkEntry {
  url: string;
  status: "ok" | "error" | "pending";
  duration?: number;
}

const networkLog: NetworkEntry[] = [];

// Patch fetch to track API calls
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const url =
      typeof args[0] === "string"
        ? args[0]
        : args[0] instanceof Request
        ? args[0].url
        : String(args[0]);

    // Only track API calls, not assets
    if (
      url.includes("api.github") ||
      url.includes("jogruber") ||
      url.includes("googleapis") ||
      url.includes("formspree")
    ) {
      const entry: NetworkEntry = {
        url: url.split("?")[0].replace(/https?:\/\//, ""),
        status: "pending",
      };
      networkLog.push(entry);
      const start = Date.now();
      try {
        const res = await originalFetch(...args);
        entry.status = res.ok ? "ok" : "error";
        entry.duration = Date.now() - start;
        return res;
      } catch (err) {
        entry.status = "error";
        entry.duration = Date.now() - start;
        throw err;
      }
    }
    return originalFetch(...args);
  };
}

/* ─── Tabs ─── */
type DiagTab = "overview" | "events" | "network";
const PAGE_START = Date.now();

const SystemFooter = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [tab, setTab] = useState<DiagTab>("overview");
  const [tick, setTick] = useState(0);
  const [fps, setFps] = useState(0);
  const fpsRef = useRef({ frames: 0, lastTime: Date.now() });

  // Ctrl+Shift+D shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        setShowDiagnostics((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Live update tick for diagnostics
  useEffect(() => {
    if (!showDiagnostics) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [showDiagnostics]);

  // FPS counter
  useEffect(() => {
    if (!showDiagnostics) return;
    let raf: number;
    const measure = () => {
      fpsRef.current.frames++;
      const now = Date.now();
      if (now - fpsRef.current.lastTime >= 1000) {
        setFps(fpsRef.current.frames);
        fpsRef.current.frames = 0;
        fpsRef.current.lastTime = now;
      }
      raf = requestAnimationFrame(measure);
    };
    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [showDiagnostics]);

  const getLiveMetrics = useCallback(() => {
    const nav = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;
    const loadTime = nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0;
    const domSize = document.querySelectorAll("*").length;
    const perfMemory = (
      performance as unknown as { memory?: { usedJSHeapSize: number } }
    ).memory;
    const jsHeap = perfMemory
      ? `${Math.round(perfMemory.usedJSHeapSize / 1024 / 1024)}MB`
      : "N/A";
    const elapsed = Date.now() - PAGE_START;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timeOnPage = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    return { loadTime, domSize, jsHeap, timeOnPage, fps };
  }, [fps]);

  return (
    <>
      <footer className="px-6 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>
              {profile.name.toUpperCase()} &copy; {new Date().getFullYear()}
            </span>
            <span className="hidden sm:inline">&middot;</span>
            <span>Built with React + Tailwind</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>Version: {profile.version}</span>
          </div>
          <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDiagnostics(true)}
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
              <Activity className="w-3 h-3" />
            Diagnostics
          </button>
            <span className="text-muted-foreground/40">
              Ctrl+Shift+D
            </span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showDiagnostics && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowDiagnostics(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-md shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <h3 className="font-mono text-sm text-foreground">
                    System Diagnostics
                  </h3>
                  <div className="status-dot bg-terminal-green ml-1" />
                </div>
                <button
                  onClick={() => setShowDiagnostics(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close diagnostics"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border/50">
                {(
                  [
                    { id: "overview", label: "Overview", icon: Activity },
                    { id: "events", label: "Events", icon: Terminal },
                    { id: "network", label: "Network", icon: Globe },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      tab === t.id
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <t.icon className="w-3 h-3" />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-5 max-h-80 overflow-y-auto">
                {tab === "overview" && (
                  <OverviewTab metrics={getLiveMetrics()} tick={tick} />
                )}
                {tab === "events" && <EventsTab tick={tick} />}
                {tab === "network" && <NetworkTab tick={tick} />}
                </div>

              <div className="px-5 py-2 border-t border-border/50">
                <p className="font-mono text-[9px] text-muted-foreground/60 text-center">
                  Press Ctrl+Shift+D to toggle · Live data refreshes every 1s
              </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Overview Tab ─── */
const OverviewTab = ({
  metrics,
  tick,
}: {
  metrics: ReturnType<() => {
    loadTime: number;
    domSize: number;
    jsHeap: string;
    timeOnPage: string;
    fps: number;
  }>;
  tick: number;
}) => {
  const sections = [
    {
      title: "Runtime",
      items: [
        { label: "Framework", value: "React 18 + Vite" },
        { label: "Styling", value: "Tailwind CSS" },
        { label: "Animations", value: "Framer Motion + GSAP" },
        { label: "Language", value: "TypeScript" },
        { label: "Version", value: `${profile.version}.0` },
      ],
    },
    {
      title: "Live Metrics",
      items: [
        {
          label: "Load Time",
          value: metrics.loadTime ? `${metrics.loadTime}ms` : "--",
        },
        { label: "DOM Nodes", value: metrics.domSize.toLocaleString() },
        { label: "JS Heap", value: metrics.jsHeap },
        {
          label: "FPS",
          value: `${metrics.fps}`,
          color:
            metrics.fps >= 55
              ? "text-terminal-green"
              : metrics.fps >= 30
              ? "text-status-experimental"
              : "text-destructive",
        },
        { label: "Time on Page", value: metrics.timeOnPage },
        {
          label: "Interactions",
          value: String(eventLog.length),
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <div key={s.title}>
          <p className="font-mono text-[9px] text-primary uppercase tracking-wider mb-2">
            {s.title}
          </p>
          {s.items.map((item) => (
            <div
              key={item.label}
              className="flex justify-between font-mono text-xs py-0.5"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className={(item as { color?: string }).color || "text-foreground"}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/* ─── Events Tab ─── */
const EventsTab = ({ tick }: { tick: number }) => {
  const recent = eventLog.slice(0, 15);

  return (
    <div className="space-y-1">
      <p className="font-mono text-[9px] text-primary uppercase tracking-wider mb-2">
        Recent Interactions ({eventLog.length} total)
      </p>
      {recent.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground">
          No interactions recorded yet.
        </p>
      ) : (
        recent.map((ev, i) => {
          const ago = Math.round((Date.now() - ev.time) / 1000);
          return (
            <div
              key={`${ev.time}-${i}`}
              className="flex items-center gap-2 font-mono text-[10px] py-0.5"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  ev.type === "click"
                    ? "bg-primary"
                    : "bg-muted-foreground/40"
                }`}
              />
              <span className="text-muted-foreground w-10 shrink-0">
                {ago}s
              </span>
              <span className="text-primary w-10 shrink-0">{ev.type}</span>
              <span className="text-foreground truncate">{ev.target}</span>
            </div>
          );
        })
      )}
    </div>
  );
};

/* ─── Network Tab ─── */
const NetworkTab = ({ tick }: { tick: number }) => {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[9px] text-primary uppercase tracking-wider mb-2">
        API Requests ({networkLog.length} total)
      </p>
      {networkLog.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground">
          No API requests recorded yet.
        </p>
      ) : (
        networkLog.map((req, i) => (
          <div
            key={`${req.url}-${i}`}
            className="flex items-center gap-2 font-mono text-[10px] py-0.5"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                req.status === "ok"
                  ? "bg-terminal-green"
                  : req.status === "error"
                  ? "bg-destructive"
                  : "bg-status-experimental animate-pulse"
              }`}
            />
            <span
              className={`w-8 shrink-0 uppercase ${
                req.status === "ok"
                  ? "text-terminal-green"
                  : req.status === "error"
                  ? "text-destructive"
                  : "text-status-experimental"
              }`}
            >
              {req.status === "ok"
                ? "200"
                : req.status === "error"
                ? "ERR"
                : "..."}
            </span>
            <span className="text-foreground truncate flex-1">
              {req.url}
            </span>
            {req.duration !== undefined && (
              <span className="text-muted-foreground shrink-0">
                {req.duration}ms
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SystemFooter;
