import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PerformanceWidget = () => {
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(30 + Math.random() * 25));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40 hidden lg:block"
    >
      <div className="glow-border rounded-md bg-card/90 backdrop-blur-sm p-3 space-y-1.5 min-w-[150px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="status-dot bg-terminal-green" />
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
            Performance
          </span>
        </div>
        {[
          { label: "SCORE", value: "98", color: "text-terminal-green" },
          { label: "LATENCY", value: `${latency}ms`, color: "text-primary" },
          { label: "BUILD", value: "v3.2.0", color: "text-foreground" },
        ].map((m) => (
          <div key={m.label} className="flex justify-between items-center font-mono text-[10px]">
            <span className="text-muted-foreground">{m.label}</span>
            <motion.span
              key={m.value}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className={m.color}
            >
              {m.value}
            </motion.span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PerformanceWidget;
