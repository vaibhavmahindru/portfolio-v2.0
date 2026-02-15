import { motion } from "framer-motion";

const signals = [
  { label: "Uptime", value: "99.9%", color: "text-terminal-green" },
  { label: "Security", value: "JWT + OAuth", color: "text-primary" },
  { label: "Monitoring", value: "Enabled", color: "text-terminal-green" },
  { label: "Deployments", value: "Automated", color: "text-primary" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const TrustSignals = () => {
  return (
    <section className="px-6 py-12" aria-label="Trust signals">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {signals.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
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
