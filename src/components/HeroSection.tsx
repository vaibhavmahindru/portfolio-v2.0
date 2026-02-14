import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";

const morphWords = ["SYSTEMS", "APIs", "CLOUD INFRA", "AUTOMATION", "PIPELINES"];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [morphIdx, setMorphIdx] = useState(0);
  const [isHoveringWord, setIsHoveringWord] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<"HUMAN" | "SYSTEM">("HUMAN");

  // Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const fgY = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // Morph cycle on hover
  useEffect(() => {
    if (!isHoveringWord) {
      setMorphIdx(0);
      return;
    }
    let i = 1;
    const interval = setInterval(() => {
      setMorphIdx(i % morphWords.length);
      i++;
    }, 800);
    return () => clearInterval(interval);
  }, [isHoveringWord]);

  // Metallic cursor light
  const handleNameMouseMove = useCallback((e: React.MouseEvent) => {
    if (!nameRef.current) return;
    const rect = nameRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center px-6 pt-16 overflow-hidden">
      {/* Layer 1: Background grid (parallax) */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: bgY }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 800 600">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.circle
              key={`n-${i}`}
              cx={80 + (i % 4) * 200}
              cy={80 + Math.floor(i / 4) * 180}
              r="3"
              fill="hsl(var(--primary))"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
          {[
            [80, 80, 280, 80], [280, 80, 480, 80], [480, 80, 680, 80],
            [80, 260, 280, 260], [280, 260, 480, 260], [480, 260, 680, 260],
            [80, 440, 280, 440], [280, 440, 480, 440], [480, 440, 680, 440],
            [80, 80, 80, 260], [280, 80, 280, 260], [480, 80, 480, 260],
            [680, 80, 680, 260], [80, 260, 80, 440], [280, 260, 280, 440],
            [480, 260, 480, 440], [680, 260, 680, 440],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={`l-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.15" />
          ))}
        </svg>
      </motion.div>

      {/* Layer 2: Mid infrastructure (parallax) */}
      <motion.div className="absolute inset-0 z-[1] pointer-events-none" style={{ y: midY }}>
        <div className="absolute top-[15%] right-[10%] w-64 h-64 opacity-[0.04] border border-primary/20 rounded-lg" />
        <div className="absolute bottom-[20%] left-[5%] w-48 h-48 opacity-[0.04] border border-primary/20 rounded-full" />
      </motion.div>

      {/* Layer 3: Foreground content */}
      <motion.div style={{ y: fgY }} className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left — Identity */}
        <AnimatePresence mode="wait">
          {viewMode === "HUMAN" ? (
            <motion.div
              key="human"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="status-dot bg-terminal-green" />
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Control Panel Active
                  </span>
                </div>
                {/* Name with metallic cursor reflection */}
                <h1
                  ref={nameRef}
                  onMouseMove={handleNameMouseMove}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground relative inline-block"
                  style={{
                    backgroundImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.2), transparent 50%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  Alex Chen
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-mono">
                  Backend · Cloud · Automation Systems
                </p>
              </div>

              {/* Interactive headline */}
              <p className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                I BUILD{" "}
                <span
                  className="inline-block text-primary cursor-default min-w-[180px]"
                  onMouseEnter={() => setIsHoveringWord(true)}
                  onMouseLeave={() => setIsHoveringWord(false)}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={morphWords[morphIdx]}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="inline-block"
                    >
                      {morphWords[morphIdx]}
                    </motion.span>
                  </AnimatePresence>
                </span>{" "}
                THAT SCALE.
              </p>

              <p className="text-secondary-foreground leading-relaxed max-w-lg">
                Building scalable cloud infrastructure and automation pipelines that
                power production systems. Focused on reliability, performance, and
                clean architecture.
              </p>

              {/* CTAs with micro-interactions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="relative px-5 py-2.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm overflow-hidden group"
                  data-cursor-label="→ Deploy"
                >
                  <span className="relative z-10">Deploy a Project</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  />
                </motion.a>
                <motion.a
                  href="#deployments"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 py-2.5 text-xs font-mono border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Inspect Systems
                </motion.a>
                <motion.a
                  href="#resume"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 py-2.5 text-xs font-mono border border-border text-muted-foreground rounded-sm hover:border-muted-foreground transition-colors"
                >
                  Download Resume ↓
                </motion.a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <pre className="font-mono text-sm text-secondary-foreground bg-card border border-border rounded-md p-5 overflow-x-auto">
                <code>{JSON.stringify({
                  runtime: "Active",
                  primary_function: "Backend Engineering",
                  cloud_integration: "AWS",
                  automation_level: "High",
                  status: "Available for select projects",
                  location: "India",
                  uptime: "99.99%",
                }, null, 2)}</code>
              </pre>
              <div className="flex flex-wrap gap-3">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.02 }}
                  className="px-5 py-2.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm"
                >
                  Deploy a Project
                </motion.a>
                <motion.a
                  href="#deployments"
                  whileHover={{ scale: 1.02 }}
                  className="px-5 py-2.5 text-xs font-mono border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Inspect Systems
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right — Animated Grid Visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="hidden md:flex items-center justify-center"
        >
          <div className="relative w-72 h-72 lg:w-80 lg:h-80">
            {Array.from({ length: 9 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary/40"
                  style={{ top: `${row * 40 + 10}%`, left: `${col * 40 + 10}%` }}
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
                  transition={{ duration: 3, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                />
              );
            })}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {[
                [10, 10, 50, 10], [50, 10, 90, 10], [10, 50, 50, 50],
                [50, 50, 90, 50], [10, 90, 50, 90], [50, 90, 90, 90],
                [10, 10, 10, 50], [50, 10, 50, 50], [90, 10, 90, 50],
                [10, 50, 10, 90], [50, 50, 50, 90], [90, 50, 90, 90],
              ].map(([x1, y1, x2, y2], i) => (
                <motion.line
                  key={i}
                  x1={x1 + 5} y1={y1 + 5} x2={x2 + 5} y2={y2 + 5}
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 1.5, delay: 0.8 + i * 0.1 }}
                />
              ))}
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* Metadata Overlay - corners */}
      <div className="absolute top-24 left-6 z-10 font-mono text-[10px] text-muted-foreground/30 space-y-1 hidden lg:block">
        <p>STATUS: AVAILABLE FOR SELECT PROJECTS</p>
        <p>LOCATION: India</p>
      </div>
      <div className="absolute top-24 right-6 z-10 font-mono text-[10px] text-muted-foreground/30 text-right space-y-1 hidden lg:block">
        <p>FOCUS: Backend + Cloud</p>
        <p>VERSION: 3.2</p>
      </div>

      {/* View Mode Toggle */}
      <div className="absolute bottom-8 left-6 z-10 flex items-center gap-2">
        <span className="font-mono text-[10px] text-muted-foreground/50">VIEW MODE:</span>
        {(["HUMAN", "SYSTEM"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setViewMode(m)}
            className={`px-2 py-1 text-[10px] font-mono rounded-sm border transition-all duration-300 ${
              viewMode === m
                ? "border-primary/50 text-primary bg-primary/5"
                : "border-border/30 text-muted-foreground/40 hover:text-muted-foreground/60"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
