import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const StatusWidget = () => {
  const [uptime, setUptime] = useState("99.98%");
  const [focusLevel, setFocusLevel] = useState(87);
  const [buildMode, setBuildMode] = useState("PRODUCTION");

  // Simulate subtle metric changes
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
    { label: "UPTIME", value: uptime, color: "text-terminal-green" },
    { label: "FOCUS", value: `${focusLevel}%`, color: "text-primary" },
    { label: "BUILD", value: buildMode, color: "text-foreground" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="fixed bottom-6 right-6 z-40 hidden lg:block"
    >
      <div className="glow-border rounded-md bg-card/90 backdrop-blur-sm p-4 space-y-3 min-w-[180px]">
        <div className="flex items-center gap-2">
          <div className="status-dot bg-terminal-green" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            System Status
          </span>
        </div>
        {metrics.map((m) => (
          <div key={m.label} className="flex justify-between items-center font-mono text-xs">
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

export default StatusWidget;
