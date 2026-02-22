import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  useMemo,
} from "react";
import {
  Github,
  MapPin,
  Zap,
  ArrowRight,
  Download,
  Play,
  Pause,
  Music,
  Clock,
  Cloud,
  Shield,
  Activity,
} from "lucide-react";
import { profile } from "@/config/profile";
import { GlobalSpotlight, BentoCard } from "./MagicBentoEffects";

const ParticleMesh = lazy(() => import("./ParticleMesh"));

/* ─── Text Scramble Hook ─── */
const CHARS = "!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const useTextScramble = (text: string, trigger: boolean, speed = 30) => {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!trigger) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const length = text.length;
    const totalFrames = length + 10;
    const interval = setInterval(() => {
      const output = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < frame - 3) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setDisplay(output);
      frame++;
      if (frame > totalFrames) {
        setDisplay(text);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, trigger, speed]);
  return display;
};

/* ─── Magnetic Button ─── */
const MagneticButton = ({
  children,
  href,
  className,
  disabled,
}: {
  children: React.ReactNode;
  href: string;
  className: string;
  disabled?: boolean;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.a>
  );
};

/* ─── Typing Prompt ─── */
const TypingPrompt = () => {
  const [text, setText] = useState("");
  const fullText = "ssh vaibhav@cloud ~ deploying portfolio...";
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <div className="font-mono text-[11px] text-muted-foreground/60 flex items-center gap-1">
      <span className="text-primary/60">$</span>
      <span>{text}</span>
      <span
        className={`inline-block w-[6px] h-[14px] bg-primary/50 ml-0.5 transition-opacity ${
          cursorVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

/* ─── Morph Words (auto-cycle) — from profile config ─── */
const morphWords = profile.hero.morphWords as unknown as string[];

/* ─── GitHub Mini Stats Hook ─── */
const GH_HERO_CACHE = "vm-gh-hero-v2";
const GH_HERO_TTL = 1000 * 60 * 30; // 30 min

interface GHMiniStats {
  avatarUrl: string;
  lastCommit: string; // ISO timestamp or ""
  streak: number;
  last7: number[]; // 7 contribution counts (Mon→Sun)
  loaded: boolean;
}

const fmtDateLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const timeAgo = (iso: string): string => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

const useGitHubMiniStats = (username: string) => {
  const [stats, setStats] = useState<GHMiniStats>({
    avatarUrl: "",
    lastCommit: "",
    streak: 0,
    last7: [0, 0, 0, 0, 0, 0, 0],
    loaded: false,
  });

  useEffect(() => {
    let cancelled = false;

    // Try cache first
    try {
      const raw = localStorage.getItem(GH_HERO_CACHE);
      if (raw) {
        const cached = JSON.parse(raw);
        if (Date.now() - cached.ts < GH_HERO_TTL) {
          if (!cancelled) setStats({ ...cached.data, loaded: true });
          return;
        }
      }
    } catch { /* ignore */ }

    const run = async () => {
      let avatarUrl = "";
      let lastCommit = "";
      let streak = 0;
      const last7 = [0, 0, 0, 0, 0, 0, 0];

      try {
        // Fetch user profile + events + contributions in parallel
        const [userRes, eventsRes, contribRes] = await Promise.allSettled([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/events/public?per_page=30`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${new Date().getFullYear()}`),
        ]);

        // Avatar
        if (userRes.status === "fulfilled" && userRes.value.ok) {
          const u = await userRes.value.json();
          avatarUrl = u.avatar_url ?? "";
        }

        // Last commit (most recent PushEvent)
        if (eventsRes.status === "fulfilled" && eventsRes.value.ok) {
          const events = await eventsRes.value.json();
          if (Array.isArray(events)) {
            const push = events.find((e: any) => e.type === "PushEvent");
            if (push) lastCommit = push.created_at ?? "";
          }
        }

        // Contributions → streak + last 7 days
        if (contribRes.status === "fulfilled" && contribRes.value.ok) {
          const body = await contribRes.value.json();
          const raw = body.contributions;
          if (Array.isArray(raw) && raw.length > 0) {
            const sorted = [...raw].sort((a: any, b: any) => a.date.localeCompare(b.date));

            // Last 7 days bar chart
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
              const key = fmtDateLocal(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i));
              const found = sorted.find((d: any) => d.date === key);
              last7[6 - i] = found?.count ?? 0;
            }

            // Current streak (walk backwards from today, not end of array —
            // API returns future dates with count 0)
            const todayKey = fmtDateLocal(today);
            let todayIdx = sorted.findIndex((d: any) => d.date === todayKey);
            if (todayIdx === -1) todayIdx = sorted.length - 1;

            let startIdx = todayIdx;
            if (startIdx >= 0 && sorted[startIdx].count === 0) startIdx--;
            for (let i = startIdx; i >= 0; i--) {
              if (sorted[i].count > 0) streak++;
              else break;
            }
          }
        }
      } catch { /* network error */ }

      const data = { avatarUrl, lastCommit, streak, last7 };
      if (!cancelled) {
        setStats({ ...data, loaded: true });
        try {
          localStorage.setItem(GH_HERO_CACHE, JSON.stringify({ data, ts: Date.now() }));
        } catch { /* storage full */ }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [username]);

  return stats;
};

/* ─── Magnifying Glass Photo ─── */
const MagnifyPhoto = ({ src, altSrc, alt }: { src: string; altSrc?: string; alt: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [magnifyPos, setMagnifyPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const magnifyRadius = 55;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMagnifyPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-none group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Base image with dot-matrix halftone overlay */}
      <img
        src={src}
        alt={alt}
        width={512}
        height={512}
        className="w-full h-full object-cover object-top"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-card/20 pointer-events-none" />

      {/* Magnified reveal — shows alt photo if provided, otherwise enhanced version of same */}
      <div
        className="absolute inset-0 transition-opacity duration-150"
        style={{
          clipPath: isHovering
            ? `circle(${magnifyRadius}px at ${magnifyPos.x}px ${magnifyPos.y}px)`
            : "circle(0px at 50% 50%)",
          opacity: isHovering ? 1 : 0,
        }}
      >
        <img
          src={altSrc || src}
          alt=""
          width={512}
          height={512}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
          style={{
            filter: altSrc ? "brightness(1.05) contrast(1.05)" : "brightness(1.15) contrast(1.1) saturate(1.2)",
          }}
        />
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Magnifying glass ring */}
      {isHovering && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-primary/70 z-20"
          style={{
            width: magnifyRadius * 2,
            height: magnifyRadius * 2,
            left: magnifyPos.x - magnifyRadius,
            top: magnifyPos.y - magnifyRadius,
            boxShadow:
              "0 0 15px hsl(var(--primary) / 0.25), inset 0 0 15px hsl(var(--primary) / 0.1)",
          }}
        />
      )}

      {/* Scan label */}
      {isHovering && (
        <div
          className="absolute pointer-events-none z-20 font-mono text-[9px] text-primary tracking-widest"
          style={{
            left: magnifyPos.x - magnifyRadius,
            top: magnifyPos.y + magnifyRadius + 6,
          }}
        >
          SCANNING...
        </div>
      )}

      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-primary/30 z-10" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-primary/30 z-10" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-primary/30 z-10" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-primary/30 z-10" />
    </div>
  );
};

/* ─── Stagger Word Reveal ─── */
const wordVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.4 + i * 0.06,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const StaggerWords = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <span className={className} style={{ perspective: 600 }}>
    {text.split(" ").map((word, i) => (
      <motion.span
        key={`${word}-${i}`}
        custom={i}
        initial="hidden"
        animate="visible"
        variants={wordVariants}
        className="inline-block mr-[0.3em]"
        style={{ transformOrigin: "bottom center" }}
      >
        {word}
      </motion.span>
    ))}
  </span>
);

/* ─── Music Player ─── */
const MiniMusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const barCount = 16;

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        /* blocked by browser autoplay policy */
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div className="flex flex-col justify-between h-full">
      <audio ref={audioRef} src="/portfolio.mp3" loop preload="none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
            <Music className="w-3 h-3 text-primary" />
          </div>
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
            Vibes
          </span>
        </div>
        {isPlaying && (
          <span className="font-mono text-[8px] text-primary animate-pulse tracking-wider">
            LIVE
          </span>
        )}
      </div>

      {/* Equalizer bars */}
      <div className="flex items-end justify-center gap-[2px] h-10 my-3">
        {Array.from({ length: barCount }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: 3,
              backgroundColor: `hsl(var(--primary) / ${0.4 + (i / barCount) * 0.4})`,
            }}
            animate={
              isPlaying
                ? {
                    height: [
                      3 + Math.random() * 4,
                      10 + Math.random() * 26,
                      4 + Math.random() * 8,
                    ],
                  }
                : { height: 3 }
            }
            transition={
              isPlaying
                ? {
                    duration: 0.35 + Math.random() * 0.35,
                    repeat: Infinity,
                    repeatType: "reverse" as const,
                    ease: "easeInOut",
                    delay: i * 0.03,
                  }
                : { duration: 0.4 }
            }
          />
        ))}
      </div>

      {/* Track info + play button */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <p className="font-mono text-[11px] text-foreground truncate">
            Portfolio Vibes
          </p>
          <p className="font-mono text-[9px] text-muted-foreground/60 truncate">
            Coding Soundtrack
          </p>
        </div>
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};

/* ─── Live Clock Card ─── */
const LiveClockCard = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const h = time.getHours().toString().padStart(2, "0");
  const m = time.getMinutes().toString().padStart(2, "0");
  const s = time.getSeconds().toString().padStart(2, "0");
  const showColon = time.getSeconds() % 2 === 0;

  const tz =
    Intl.DateTimeFormat().resolvedOptions().timeZone.split("/").pop()?.replace("_", " ") ?? "";

  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center overflow-hidden">
      {/* Subtle radial glow behind time */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.08), transparent 70%)",
        }}
      />
      <span className="relative font-mono text-[8px] text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">
        {tz}
      </span>
      <div className="relative font-mono tabular-nums leading-none">
        <span className="text-4xl font-bold text-foreground">{h}</span>
        <span
          className={`text-4xl font-bold transition-opacity duration-300 ${
            showColon ? "text-primary" : "text-primary/20"
          }`}
        >
          :
        </span>
        <span className="text-4xl font-bold text-foreground">{m}</span>
      </div>
      <span className="relative font-mono text-[10px] text-muted-foreground/30 mt-1.5 tabular-nums">
        .{s}
      </span>
    </div>
  );
};

/* ─── Tech Pills — from profile config ─── */
const techPills = profile.hero.techPills as unknown as string[];

/* ─── Main Hero (Bento Grid) ─── */
const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [morphIdx, setMorphIdx] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setHasLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  const scrambledName = useTextScramble(profile.name, hasLoaded, 35);

  // GitHub mini stats
  const ghUsername = useMemo(
    () => profile.links.github.split("/").pop() ?? "vaibhavmahindru",
    []
  );
  const ghStats = useGitHubMiniStats(ghUsername);

  // Mouse-tracking gradient orb
  const orbX = useMotionValue(0.5);
  const orbY = useMotionValue(0.5);
  const springOrbX = useSpring(orbX, { stiffness: 40, damping: 25 });
  const springOrbY = useSpring(orbY, { stiffness: 40, damping: 25 });

  const handleSectionMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      orbX.set((e.clientX - rect.left) / rect.width);
      orbY.set((e.clientY - rect.top) / rect.height);
    },
    [orbX, orbY, prefersReducedMotion]
  );

  // Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 60]
  );

  // Auto-cycle morph words
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setMorphIdx((prev) => (prev + 1) % morphWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-4 sm:px-6 pt-20 pb-12 overflow-hidden"
      aria-label="Hero section"
      onMouseMove={handleSectionMouseMove}
    >
      {/* Particle Background */}
      <Suspense fallback={null}>
        <ParticleMesh />
      </Suspense>

      {/* Interactive gradient orb */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: useTransform(
              [springOrbX, springOrbY],
              ([x, y]: number[]) =>
                `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, hsl(var(--primary) / 0.07), transparent 60%)`
            ),
          }}
        />
      )}

      {/* Background grid parallax */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ y: bgY }}
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          viewBox="0 0 800 600"
          aria-hidden="true"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={`n-${i}`}
              cx={80 + (i % 4) * 200}
              cy={80 + Math.floor(i / 4) * 180}
              r="3"
              fill="hsl(var(--primary))"
              opacity="0.5"
            />
          ))}
        </svg>
      </motion.div>

      {/* ─── Bento Grid Content ─── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Typing Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4"
        >
          <TypingPrompt />
      </motion.div>

        {/* ═══ Bento Grid ═══
             Row 1:    [Identity 5 ↕2 ] [Photo 4 ↕2] [GitHub 3       ]
             Row 2:          ↕              ↕         [Clock  3       ]
             Row 3:    [Headline 4     ] [Music 5    ] [Status 3 ↕2   ]
             Row 4:    [Tech 9                       ]      ↕
        ═══════════ */}
        <GlobalSpotlight gridRef={gridRef} spotlightRadius={400} />
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* ── R1-R2 · Identity + CTAs · 5col tall ── */}
            <BentoCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="md:col-span-5 md:row-span-2 bento-card p-6 flex flex-col justify-between"
            >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                  <div className="status-dot bg-terminal-green" />
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  {profile.hero.controlPanelLabel}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                <span className="font-mono">{scrambledName}</span>
              </h1>

              <div className="text-sm md:text-base text-muted-foreground font-mono">
                <StaggerWords text={profile.tagline} />
              </div>

              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-3 mt-5">
              <div className="flex flex-wrap gap-2">
                <MagneticButton
                  href="#contact"
                  disabled={!!prefersReducedMotion}
                  className="relative px-5 py-3 md:py-2.5 text-[11px] font-mono bg-primary text-primary-foreground rounded-lg overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Deploy a Project
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </MagneticButton>
                <MagneticButton
                  href="#deployments"
                  disabled={!!prefersReducedMotion}
                  className="px-5 py-3 md:py-2.5 text-[11px] font-mono border border-border text-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Inspect Systems
                </MagneticButton>
                <MagneticButton
                  href="#resume"
                  disabled={!!prefersReducedMotion}
                  className="px-5 py-3 md:py-2.5 text-[11px] font-mono border border-border text-muted-foreground rounded-lg hover:border-primary/40 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" />
                  Resume
                </MagneticButton>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                <span className="font-mono text-[9px] text-muted-foreground/50">
                  {profile.hero.currentBuild}
                </span>
              </div>
            </div>
          </BentoCard>

          {/* ── R1-R2 · Photo · 4col tall ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="magic-bento-card magic-bento-card--border-glow md:col-span-4 md:row-span-2 rounded-2xl overflow-hidden border border-border/40 min-h-[200px] sm:min-h-[280px] md:min-h-0 hover:border-primary/25 transition-all duration-300 relative"
          >
            <MagnifyPhoto src={profile.photo} altSrc={profile.altPhoto} alt={profile.name} />
          </motion.div>

          {/* ── R1 · GitHub Stats · 3col ── */}
          <BentoCard
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="order-3 md:order-none md:col-span-3 bento-card p-4 flex flex-col justify-between"
          >
            {/* Subtle gradient corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
              style={{ background: "radial-gradient(circle at 100% 0%, hsl(var(--primary) / 0.06), transparent 70%)" }}
            />

            {/* Header: avatar + username */}
            <div className="relative flex items-center gap-2.5 mb-3">
              {ghStats.avatarUrl ? (
                <img
                  src={ghStats.avatarUrl}
                  alt={ghUsername}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-border/50"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Github className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-foreground font-medium truncate">@{ghUsername}</p>
                <p className="font-mono text-[8px] text-muted-foreground/60 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                  Active
                </p>
              </div>
            </div>

            {/* Streak */}
            <div className="relative mb-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Streak</span>
                <span className="font-mono text-sm font-bold text-primary flex items-center gap-1">
                  🔥 {ghStats.loaded ? `${ghStats.streak}d` : "--"}
                </span>
              </div>
            </div>

            {/* 7-day mini bar chart */}
            <div className="relative mb-3">
              <p className="font-mono text-[8px] text-muted-foreground/50 uppercase tracking-wider mb-1.5">Last 7 days</p>
              <div className="flex items-end gap-[3px] h-[28px]">
                {ghStats.last7.map((count, i) => {
                  const max = Math.max(...ghStats.last7, 1);
                  const h = Math.max(count / max * 100, 8); // min 8% height so empty days show a sliver
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all duration-300"
                      style={{
                        height: `${h}%`,
                        backgroundColor: count > 0
                          ? `hsl(158 64% ${35 + (count / max) * 16}%)`
                          : "hsl(0 0% 20%)",
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <span key={i} className="flex-1 text-center font-mono text-[7px] text-muted-foreground/40">{d}</span>
                ))}
              </div>
            </div>

            {/* View profile link */}
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center gap-1.5 px-2 py-1.5 text-[9px] font-mono bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              View Profile <ArrowRight className="w-2.5 h-2.5" />
            </a>
          </BentoCard>

          {/* ── R2 · Live Clock · 3col (accent) — hidden on mobile ── */}
          <BentoCard
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="hidden md:block md:col-span-3 bento-card-accent p-4"
          >
            <LiveClockCard />
          </BentoCard>

          {/* ── R3 · Headline · 4col ── */}
          <BentoCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="md:col-span-4 bento-card p-5 flex flex-col justify-center"
          >
            {/* Faint circuit pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
                  linear-gradient(hsl(var(--primary)) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
            {/* Bottom gradient wash */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
              style={{ background: "linear-gradient(to top, hsl(var(--primary) / 0.04), transparent)" }}
            />
            <div className="relative z-10">
              <p className="text-lg md:text-xl font-bold text-foreground tracking-tight leading-tight">
                I BUILD
              </p>
              <div className="min-h-[48px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={morphWords[morphIdx]}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-primary"
                    >
                      {morphWords[morphIdx]}
                    </motion.span>
                  </AnimatePresence>
              </div>
              <p className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                THAT SCALE.
              </p>
              <p className="font-mono text-[9px] text-muted-foreground/30 mt-2">
                // {profile.statusCard.experienceYears} · production systems
              </p>
            </div>
          </BentoCard>

          {/* ── R3 · Music Player · 5col — hidden on mobile ── */}
          <BentoCard
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="hidden md:block md:col-span-5 bento-card p-4"
          >
            <MiniMusicPlayer />
          </BentoCard>

          {/* ── R3-R4 · Status · 3col tall ── */}
                  <BentoCard
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="order-last md:order-none md:col-span-3 md:row-span-2 bento-card p-4 flex flex-col justify-between"
          >
            {/* Left accent stripe */}
            <div className="absolute top-3 bottom-3 left-0 w-[2px] bg-gradient-to-b from-primary/40 via-primary/10 to-transparent rounded-full" />

            <div className="pl-3 space-y-3">
              <span className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-[0.15em]">
                System Status
              </span>

              {/* Primary info */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-terminal-green flex-shrink-0" />
                  <span className="font-mono text-[10px] text-terminal-green">
                    {profile.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {profile.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {profile.statusCard.cloudProviders}
                  </span>
                </div>
                {profile.statusCard.compliance && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {profile.statusCard.compliance}
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border/30" />

              {/* Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-muted-foreground/50 uppercase">Uptime</span>
                  <span className="font-mono text-[10px] text-terminal-green font-medium">{profile.statusCard.uptime}</span>
                </div>
                {/* Uptime bar */}
                <div className="flex gap-[2px]">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full"
                      style={{
                        backgroundColor:
                          i < 19
                            ? "hsl(var(--terminal-green) / 0.6)"
                            : i === 19
                              ? "hsl(var(--terminal-green) / 0.3)"
                              : "hsl(var(--muted-foreground) / 0.15)",
                      }}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-muted-foreground/50 uppercase">Experience</span>
                  <span className="font-mono text-[10px] text-foreground font-medium">{profile.statusCard.experienceYears}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-muted-foreground/50 uppercase">Response</span>
                  <span className="font-mono text-[10px] text-foreground font-medium">{profile.statusCard.responseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-muted-foreground/50 uppercase">Stack</span>
                  <span className="font-mono text-[10px] text-primary font-medium">{profile.statusCard.stackLabel}</span>
                </div>
              </div>
            </div>

            <div className="pl-3 pt-2 border-t border-border/30 flex justify-between font-mono text-[9px]">
              <span className="text-muted-foreground/40">VERSION</span>
              <span className="text-primary">{profile.version}</span>
              </div>
            </BentoCard>

          {/* ── R4 · Tech Pills · 9col (extra wide) ── */}
            <BentoCard
            initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="order-last md:order-none md:col-span-9 bento-card p-4"
          >
            <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.15em] mb-3 block">
              Tech Arsenal
            </span>
            <div className="flex flex-wrap gap-1.5">
              {techPills.map((pill, i) => (
                <motion.span
                  key={pill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.04, duration: 0.3 }}
                  className="px-3 py-1.5 text-[10px] font-mono rounded-lg bg-secondary/40 text-foreground/70 border border-border/30 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-default"
                >
                  {pill}
                </motion.span>
              ))}
              </div>
            </BentoCard>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">
            Scroll
          </span>
                <motion.div
            className="w-[1px] h-6 bg-primary/30"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
