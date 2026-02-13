import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLines = [
  { text: "> Initializing scalable systems...", delay: 0 },
  { text: "> Loading cloud infrastructure...", delay: 1200 },
  { text: "> Deploying automation pipelines...", delay: 2400 },
  { text: "> All systems operational.", delay: 3600 },
];

const bio = {
  name: "Alex Chen",
  title: "Senior Systems Engineer",
  location: "San Francisco, CA",
  specialization: ["Cloud Architecture", "DevOps", "Distributed Systems"],
  status: "Available for projects",
};

const HumanBio = () => (
  <div className="space-y-4">
    <p className="text-secondary-foreground leading-relaxed max-w-xl">
      I build scalable cloud infrastructure and automation pipelines that power
      production systems. Focused on reliability, performance, and clean
      architecture.
    </p>
    <div className="flex flex-wrap gap-2">
      {bio.specialization.map((s) => (
        <span
          key={s}
          className="px-3 py-1 text-xs font-mono bg-secondary text-primary rounded-sm border border-border"
        >
          {s}
        </span>
      ))}
    </div>
  </div>
);

const MachineBio = () => (
  <pre className="font-mono text-sm text-secondary-foreground bg-secondary/50 p-4 rounded-md border border-border overflow-x-auto">
    <code>
      {`{
  "name": "${bio.name}",
  "title": "${bio.title}",
  "location": "${bio.location}",
  "specialization": ${JSON.stringify(bio.specialization, null, 4)},
  "status": "${bio.status}",
  "availability": true,
  "api_version": "2.0.1"
}`}
    </code>
  </pre>
);

const HeroSection = () => {
  const [phase, setPhase] = useState<"boot" | "ready">("boot");
  const [visibleLines, setVisibleLines] = useState(0);
  const [mode, setMode] = useState<"human" | "machine">("human");

  useEffect(() => {
    const timers = bootLines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), bootLines[i].delay)
    );
    const readyTimer = setTimeout(() => setPhase("ready"), 4800);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(readyTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl w-full">
        <AnimatePresence mode="wait">
          {phase === "boot" ? (
            <motion.div
              key="boot"
              className="font-mono space-y-3"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {bootLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-sm ${
                    i === visibleLines - 1 && visibleLines < bootLines.length
                      ? "text-primary cursor-blink"
                      : "text-muted-foreground"
                  } ${i === bootLines.length - 1 ? "text-terminal-green" : ""}`}
                >
                  {line.text}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="status-dot bg-terminal-green" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                    System Online
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                  {bio.name}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-mono">
                  {bio.title}
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMode("human")}
                  className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-all duration-300 ${
                    mode === "human"
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  HUMAN_MODE
                </button>
                <button
                  onClick={() => setMode("machine")}
                  className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-all duration-300 ${
                    mode === "machine"
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  MACHINE_MODE
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {mode === "human" ? <HumanBio /> : <MachineBio />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
