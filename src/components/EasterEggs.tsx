import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Konami Code Detector ─── */
const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const useKonamiCode = () => {
  const [activated, setActivated] = useState(false);
  const seqRef = useRef<string[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      seqRef.current.push(e.key);
      if (seqRef.current.length > KONAMI_SEQUENCE.length) {
        seqRef.current = seqRef.current.slice(-KONAMI_SEQUENCE.length);
      }
      if (
        seqRef.current.length === KONAMI_SEQUENCE.length &&
        seqRef.current.every(
          (k, i) => k.toLowerCase() === KONAMI_SEQUENCE[i].toLowerCase()
        )
      ) {
        setActivated(true);
        seqRef.current = [];
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const reset = useCallback(() => setActivated(false), []);
  return { activated, reset };
};

/* ─── View Source Easter Egg ─── */
const VIEW_SOURCE_LINES: { type: "comment" | "code" | "ascii" | "blank" | "heading"; text: string }[] = [
  { type: "ascii", text: "/**" },
  { type: "ascii", text: " *  ╦  ╦╔╦╗   ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔═╗╔═╗" },
  { type: "ascii", text: " *  ╚╗╔╝║║║───║║║║ ║ ║╣ ╠╦╝╠╣ ╠═╣║  ║╣" },
  { type: "ascii", text: " *   ╚╝ ╩ ╩   ╩╝╚╝ ╩ ╚═╝╩╚═╚  ╩ ╩╚═╝╚═╝  v3.2" },
  { type: "ascii", text: " *" },
  { type: "ascii", text: " *  You found the source. Nice." },
  { type: "ascii", text: " *  This isn't the real source — that's on GitHub." },
  { type: "ascii", text: " *  But here's how this thing actually works." },
  { type: "ascii", text: " */" },
  { type: "blank", text: "" },

  { type: "heading", text: "// ━━━ ARCHITECTURE DECISIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { type: "blank", text: "" },
  { type: "comment", text: "// Why React + Vite instead of Next.js?" },
  { type: "comment", text: "// This is a static portfolio. No SSR, no API routes, no server." },
  { type: "comment", text: "// Vite gives sub-second HMR and a 180KB production bundle." },
  { type: "comment", text: "// Next.js would add 300KB+ of framework overhead for zero benefit." },
  { type: "code", text: "import { StrictMode } from 'react';" },
  { type: "code", text: "import { createRoot } from 'react-dom/client';" },
  { type: "code", text: "import App from './App'; // Single entry point" },
  { type: "blank", text: "" },

  { type: "comment", text: "// Why no component library (shadcn, MUI, Chakra)?" },
  { type: "comment", text: "// Every pixel on this site is intentional." },
  { type: "comment", text: "// Component libraries add 50-200KB and fight you on custom design." },
  { type: "comment", text: "// Tailwind CSS + hand-rolled components = full control, zero bloat." },
  { type: "code", text: "const theme = 'dark'; // Always. Light mode was removed." },
  { type: "code", text: "const maxWidth = '6xl'; // 1152px — wider than most portfolios" },
  { type: "blank", text: "" },

  { type: "heading", text: "// ━━━ THE BENTO GRID ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { type: "blank", text: "" },
  { type: "comment", text: "// Hero uses a 12-column CSS grid with deliberately asymmetric spans." },
  { type: "comment", text: "// No two adjacent rows share the same column proportions." },
  { type: "comment", text: "// This breaks the \"grid\" feel and creates visual rhythm." },
  { type: "code", text: "const grid = 'grid-cols-12'; // 12-col base" },
  { type: "code", text: "const identity = 'col-span-5 row-span-2'; // Name, bio, CTAs" },
  { type: "code", text: "const photo = 'col-span-4 row-span-2'; // Magnifying glass effect" },
  { type: "code", text: "const github = 'col-span-3'; // Live API data" },
  { type: "code", text: "const headline = 'col-span-4'; // Auto-cycling words" },
  { type: "code", text: "const music = 'col-span-5'; // Equalizer + audio player" },
  { type: "code", text: "const techPills = 'col-span-9'; // 14 tech badges" },
  { type: "code", text: "const status = 'col-span-3 row-span-2'; // System status" },
  { type: "blank", text: "" },

  { type: "heading", text: "// ━━━ ANIMATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { type: "blank", text: "" },
  { type: "comment", text: "// Framer Motion for component-level animations (mount/unmount)." },
  { type: "comment", text: "// GSAP ScrollTrigger for scroll-based section reveals." },
  { type: "comment", text: "// Canvas 2D for the particle mesh (not Three.js — too heavy)." },
  { type: "comment", text: "// Every animation respects prefers-reduced-motion." },
  { type: "code", text: "const particleCount = 120;" },
  { type: "code", text: "const connectionDistance = 80; // px — proximity threshold" },
  { type: "code", text: "const mouseRepelRadius = 100; // particles flee the cursor" },
  { type: "blank", text: "" },

  { type: "heading", text: "// ━━━ DATA FETCHING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { type: "blank", text: "" },
  { type: "comment", text: "// GitHub contributions: jogruber.de proxy API (no auth needed)." },
  { type: "comment", text: "// GitHub events: api.github.com/users/{user}/events (rate limited)." },
  { type: "comment", text: "// PageSpeed: pagespeedonline.googleapis.com (free, no key)." },
  { type: "comment", text: "// All responses cached in localStorage with TTL-based invalidation." },
  { type: "code", text: "const GITHUB_CACHE_TTL = 60 * 60 * 1000; // 1 hour" },
  { type: "code", text: "const PAGESPEED_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours" },
  { type: "code", text: "const MINI_STATS_CACHE_TTL = 30 * 60 * 1000; // 30 min" },
  { type: "blank", text: "" },

  { type: "heading", text: "// ━━━ TECH STACK GRAPH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { type: "blank", text: "" },
  { type: "comment", text: "// Force-directed layout: Coulomb repulsion + Hooke spring attraction." },
  { type: "comment", text: "// 200 simulation iterations at build time, not runtime." },
  { type: "comment", text: "// Animated data packets use native SVG <animate>, not Framer Motion." },
  { type: "comment", text: "// (Framer Motion + SVG attributes = broken. Don't do it.)" },
  { type: "code", text: "const nodes = 12; // Node.js, Python, AWS, Docker, PostgreSQL..." },
  { type: "code", text: "const REPULSION = 8; // Coulomb constant" },
  { type: "code", text: "const SPRING_K = 0.015; // Hooke constant" },
  { type: "code", text: "const DAMPING = 0.85; // Velocity decay per tick" },
  { type: "blank", text: "" },

  { type: "heading", text: "// ━━━ EASTER EGGS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { type: "blank", text: "" },
  { type: "comment", text: "// You're looking at one right now." },
  { type: "code", text: "const easterEggs = {" },
  { type: "code", text: "  'Ctrl+U':       'This view source overlay'," },
  { type: "code", text: "  '~':            'Terminal with 15+ commands'," },
  { type: "code", text: "  'Konami Code':  '↑↑↓↓←→←→BA → CRT retro mode'," },
  { type: "code", text: "  '10x click':    'Rapid click detector toast'," },
  { type: "code", text: "  'Logo x5':      'Text scramble on VM-INTERFACE'," },
  { type: "code", text: "  '/secret':      'Hidden developer notes page'," },
  { type: "code", text: "  'Idle 30s':     'Screen dims + terminal prompt'," },
  { type: "code", text: "  'matrix':       'Terminal cmd → Matrix rain'," },
  { type: "code", text: "  'sudo hire me': 'Terminal cmd → employment joke'," },
  { type: "code", text: "};" },
  { type: "blank", text: "" },

  { type: "heading", text: "// ━━━ PERFORMANCE NOTES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { type: "blank", text: "" },
  { type: "comment", text: "// Bundle: ~180KB gzipped (React + Framer Motion + GSAP + app code)." },
  { type: "comment", text: "// Three.js was tried and removed — added 500KB for a particle effect." },
  { type: "comment", text: "// Canvas 2D replacement: 3KB, same visual result." },
  { type: "comment", text: "// Fonts: Work Sans + Inconsolata via Google Fonts <link> preconnect." },
  { type: "comment", text: "// No analytics. No tracking. No cookies. Just code." },
  { type: "blank", text: "" },

  { type: "comment", text: "// ──────────────────────────────────────────────────────────" },
  { type: "comment", text: "// Built by Vaibhav Mahindru — github.com/vaibhavmahindru" },
  { type: "comment", text: "// If you're reading this, we should probably work together." },
  { type: "comment", text: "// ──────────────────────────────────────────────────────────" },
];

const ViewSourceOverlay = ({ onClose }: { onClose: () => void }) => {
  const [revealedLines, setRevealedLines] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Rapid reveal: 8 lines at a time every 30ms for a "loading" feel
    const interval = setInterval(() => {
      setRevealedLines((prev) => {
        const next = prev + 8;
        if (next >= VIEW_SOURCE_LINES.length) {
          clearInterval(interval);
          return VIEW_SOURCE_LINES.length;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [revealedLines]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const getLineClass = (type: string) => {
    switch (type) {
      case "ascii": return "text-primary font-bold";
      case "comment": return "text-muted-foreground/70 italic";
      case "code": return "text-foreground";
      case "heading": return "text-primary/80 font-bold mt-2";
      case "blank": return "";
      default: return "text-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors"
              aria-label="Close"
            />
            <div className="w-3 h-3 rounded-full bg-status-experimental/60" />
            <div className="w-3 h-3 rounded-full bg-terminal-green/60" />
          </div>
          <span className="font-mono text-xs text-primary tracking-widest ml-2">
            view-source://vm-interface
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">
            {revealedLines}/{VIEW_SOURCE_LINES.length} lines loaded
          </span>
          <button
            onClick={onClose}
            className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1 border border-border rounded-md hover:border-primary/50"
          >
            ESC to close
          </button>
        </div>
      </div>

      {/* Source content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 font-mono text-xs sm:text-sm leading-relaxed"
      >
        <div className="max-w-4xl">
          {VIEW_SOURCE_LINES.slice(0, revealedLines).map((line, i) => (
            <div key={i} className="flex">
              <span className="inline-block w-8 sm:w-12 text-right mr-4 sm:mr-6 text-muted-foreground/30 select-none shrink-0">
                {line.type !== "blank" ? i + 1 : ""}
              </span>
              <span className={getLineClass(line.type)}>
                {line.text || "\u00A0"}
              </span>
            </div>
          ))}
          {revealedLines < VIEW_SOURCE_LINES.length && (
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block w-8 sm:w-12 text-right mr-4 sm:mr-6 text-muted-foreground/30 select-none shrink-0" />
              <span className="text-primary animate-pulse">Loading source...</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Click Counter ─── */
const useRapidClickDetector = (threshold = 10, windowMs = 2000) => {
  const [triggered, setTriggered] = useState(false);
  const clicksRef = useRef<number[]>([]);

  useEffect(() => {
    const handler = () => {
      const now = Date.now();
      clicksRef.current.push(now);
      // Remove clicks outside the window
      clicksRef.current = clicksRef.current.filter(
        (t) => now - t < windowMs
      );
      if (clicksRef.current.length >= threshold) {
        setTriggered(true);
        clicksRef.current = [];
        setTimeout(() => setTriggered(false), 3000);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [threshold, windowMs]);

  return triggered;
};

/* ─── CRT Retro Mode Effect ─── */
const CRTOverlay = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timeout = setTimeout(onComplete, 5000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[95] pointer-events-none"
    >
      {/* CRT scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 136, 0.03) 2px, rgba(0, 255, 136, 0.03) 4px)",
        }}
      />
      {/* CRT flicker */}
      <motion.div
        className="absolute inset-0 bg-primary/5"
        animate={{ opacity: [0, 0.03, 0, 0.02, 0] }}
        transition={{ duration: 0.15, repeat: Infinity }}
      />
      {/* CRT vignette */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 120px 60px rgba(0,0,0,0.4)",
        }}
      />
      {/* Retro mode banner */}
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="px-4 py-2 bg-card border border-primary/50 rounded-md font-mono text-xs text-primary text-center">
          <p className="text-sm font-bold mb-1">RETRO MODE ACTIVATED</p>
          <p className="text-muted-foreground text-[10px]">
            &uarr;&uarr;&darr;&darr;&larr;&rarr;&larr;&rarr;BA — Classic. Fades in 5s.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Toast Notification ─── */
const Toast = ({
  message,
  onComplete,
}: {
  message: string;
  onComplete: () => void;
}) => {
  useEffect(() => {
    const timeout = setTimeout(onComplete, 3000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 50, x: "-50%" }}
      className="fixed bottom-20 left-1/2 z-[80] px-4 py-2 bg-card border border-border rounded-md shadow-lg font-mono text-xs text-foreground"
    >
      {message}
    </motion.div>
  );
};

/* ─── View Source Interceptor ─── */
const useViewSource = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Keyboard shortcut: Ctrl+U / Cmd+U
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
        setShow(true);
      }
    };
    // Custom event: dispatched by terminal "view-source" command
    const customHandler = () => setShow(true);

    window.addEventListener("keydown", keyHandler);
    window.addEventListener("open-view-source", customHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("open-view-source", customHandler);
    };
  }, []);

  const close = useCallback(() => setShow(false), []);
  return { show, close };
};

/* ─── Main Easter Eggs Component ─── */
const EasterEggs = () => {
  const { activated: konamiActive, reset: resetKonami } = useKonamiCode();
  const rapidClick = useRapidClickDetector(10, 2000);
  const { show: showSource, close: closeSource } = useViewSource();
  const [showCRT, setShowCRT] = useState(false);
  const [showClickToast, setShowClickToast] = useState(false);

  // Konami code triggers CRT retro mode
  useEffect(() => {
    if (konamiActive) {
      setShowCRT(true);
      resetKonami();
    }
  }, [konamiActive, resetKonami]);

  // Rapid click toast
  useEffect(() => {
    if (rapidClick) {
      setShowClickToast(true);
    }
  }, [rapidClick]);

  return (
    <>
      <AnimatePresence>
        {showCRT && <CRTOverlay onComplete={() => setShowCRT(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showSource && <ViewSourceOverlay onClose={closeSource} />}
      </AnimatePresence>

      <AnimatePresence>
        {showClickToast && (
          <Toast
            message="Easy there, you might break something."
            onComplete={() => setShowClickToast(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEggs;

