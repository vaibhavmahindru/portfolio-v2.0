import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const devNotes = [
  "This portfolio is built with React 18, TypeScript, Tailwind CSS, and Framer Motion.",
  "The particle mesh background uses Canvas 2D with 120 particles and proximity-based connections.",
  "GSAP handles scroll-triggered section reveals with clip-path and parallax effects.",
  "The GitHub contribution data is fetched from a public proxy API with 1-hour localStorage caching.",
  "The force-directed graph layout simulates 200 iterations of Coulomb repulsion and Hooke spring attraction.",
  "Every animation respects prefers-reduced-motion for accessibility.",
  "The boot sequence uses sessionStorage so it only plays once per browser session.",
  "The terminal overlay supports Tab autocomplete, command history, and colored HTML output.",
  "Performance metrics are measured using the real Navigation Timing API and Performance.memory.",
  "The magnifying glass photo effect uses CSS clip-path: circle() with mouse position tracking.",
];

const SecretPage = () => {
  const [revealedLines, setRevealedLines] = useState(0);
  const [glitchText, setGlitchText] = useState("ACCESS GRANTED");

  useEffect(() => {
    // Type out lines
    const timers = devNotes.map((_, i) =>
      setTimeout(() => setRevealedLines(i + 1), 500 + i * 300)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    // Brief glitch effect on title
    let frame = 0;
    const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
    const original = "ACCESS GRANTED";
    const interval = setInterval(() => {
      if (frame < 15) {
        const output = original
          .split("")
          .map((c, i) => {
            if (c === " ") return " ";
            if (i < frame - 2) return c;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        setGlitchText(output);
        frame++;
      } else {
        setGlitchText(original);
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-6"
      >
        <div className="space-y-2">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">
            // /secret
          </p>
          <h1 className="text-4xl font-bold font-mono text-primary">
            {glitchText}
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            You found the developer notes. Here's what's under the hood.
          </p>
        </div>

        <div className="glow-border rounded-md bg-card p-6 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-destructive/60" />
              <div className="w-2 h-2 rounded-full bg-status-experimental/60" />
              <div className="w-2 h-2 rounded-full bg-terminal-green/60" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground ml-2">
              dev-notes.log
            </span>
          </div>

          {devNotes.slice(0, revealedLines).map((note, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-xs"
            >
              <span className="text-primary mr-2">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span className="text-muted-foreground">{note}</span>
            </motion.div>
          ))}

          {revealedLines < devNotes.length && (
            <div className="font-mono text-xs text-primary cursor-blink">
              Loading...
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="px-5 py-2.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
          >
            Return to Command Center
          </Link>
          <span className="font-mono text-[10px] text-muted-foreground">
            Easter eggs: Ctrl+U, Terminal (~), Konami Code, Rapid Click, Logo x5, /secret, Idle 30s, matrix, sudo hire me
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default SecretPage;

