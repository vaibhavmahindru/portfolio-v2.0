import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center px-6 pt-16">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left — Identity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="status-dot bg-terminal-green" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Control Panel Active
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Alex Chen
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-mono">
              Backend · Cloud · Automation Systems
            </p>
          </div>

          <p className="text-secondary-foreground leading-relaxed max-w-lg">
            Building scalable cloud infrastructure and automation pipelines that
            power production systems. Focused on reliability, performance, and
            clean architecture.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#deployments"
              className="px-5 py-2.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
            >
              View Deployments
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 text-xs font-mono border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary transition-colors"
            >
              Deploy a Project
            </a>
            <a
              href="#resume"
              className="px-5 py-2.5 text-xs font-mono border border-border text-muted-foreground rounded-sm hover:border-muted-foreground transition-colors"
            >
              Download Resume ↓
            </a>
          </div>
        </motion.div>

        {/* Right — Animated Grid Visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="hidden md:flex items-center justify-center"
        >
          <div className="relative w-72 h-72 lg:w-80 lg:h-80">
            {/* Grid nodes */}
            {Array.from({ length: 9 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary/40"
                  style={{
                    top: `${row * 40 + 10}%`,
                    left: `${col * 40 + 10}%`,
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {[
                [10, 10, 50, 10],
                [50, 10, 90, 10],
                [10, 50, 50, 50],
                [50, 50, 90, 50],
                [10, 90, 50, 90],
                [50, 90, 90, 90],
                [10, 10, 10, 50],
                [50, 10, 50, 50],
                [90, 10, 90, 50],
                [10, 50, 10, 90],
                [50, 50, 50, 90],
                [90, 50, 90, 90],
              ].map(([x1, y1, x2, y2], i) => (
                <motion.line
                  key={i}
                  x1={x1 + 5}
                  y1={y1 + 5}
                  x2={x2 + 5}
                  y2={y2 + 5}
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
      </div>
    </section>
  );
};

export default HeroSection;
