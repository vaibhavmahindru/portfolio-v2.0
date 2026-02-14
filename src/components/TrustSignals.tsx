import { motion } from "framer-motion";

const signals = [
  { label: "Uptime", value: "99.9%", color: "text-terminal-green" },
  { label: "Security", value: "JWT + OAuth", color: "text-primary" },
  { label: "Monitoring", value: "Enabled", color: "text-terminal-green" },
  { label: "Deployments", value: "Automated", color: "text-primary" },
];

const TrustSignals = () => {
  return (
    <section className="px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {signals.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                {s.label}
              </p>
              <p className={`font-mono text-sm font-medium ${s.color} mt-1`}>
                {s.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;
