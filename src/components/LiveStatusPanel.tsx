import { motion } from "framer-motion";

  const metrics = [
    { label: "UPTIME", value: "99.99%", color: "text-terminal-green" },
    { label: "FOCUS MODE", value: "ENABLED", color: "text-terminal-green" },
    { label: "AI DEPENDENCY", value: "REDUCING", color: "text-status-experimental" },
    { label: "CURRENT BUILD", value: "Startup Platform", color: "text-primary" },
  ];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const LiveStatusPanel = () => {
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
            <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
              Live Status
            </span>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {metrics.map((m) => (
              <motion.div key={m.label} variants={fadeUp} className="space-y-1">
                <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                  {m.label}
                </p>
                <p className={`font-mono text-sm font-medium ${m.color}`}>
                  {m.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStatusPanel;
