import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LiveStatusPanel = () => {
  const [focusLevel, setFocusLevel] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => {
      setFocusLevel((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(70, Math.min(99, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: "UPTIME", value: "99.99%", color: "text-terminal-green" },
    { label: "FOCUS MODE", value: "ENABLED", color: "text-terminal-green" },
    { label: "AI DEPENDENCY", value: "REDUCING", color: "text-status-experimental" },
    { label: "CURRENT BUILD", value: "Startup Platform", color: "text-primary" },
  ];

  return (
    <section className="px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glow-border rounded-md bg-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="status-dot bg-terminal-green" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Live Status
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="space-y-1">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  {m.label}
                </p>
                <motion.p
                  key={m.value}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className={`font-mono text-sm font-medium ${m.color}`}
                >
                  {m.value}
                </motion.p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStatusPanel;
