import { motion } from "framer-motion";

const metrics = [
  { label: "Experience", value: "5+ Years" },
  { label: "Primary Stack", value: "Backend + AWS" },
  { label: "Projects Delivered", value: "12+" },
  { label: "Certifications", value: "AWS (Soon)" },
];

const ResumeCenter = () => {
  return (
    <section id="resume" className="px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Resume
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            Credential Package
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left — Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-secondary-foreground leading-relaxed">
              Systems engineer with 5+ years building backend services, cloud infrastructure,
              and automation pipelines. Focused on scalable architecture, reliability, and
              clean engineering practices. Currently seeking high-impact backend or
              infrastructure roles.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m) => (
                <div key={m.label} className="glow-border rounded-md bg-card p-3">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p className="font-mono text-sm text-foreground mt-1">{m.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-3 justify-center"
          >
            <a
              href="#"
              className="px-5 py-3 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors text-center"
            >
              Download PDF
            </a>
            <a
              href="#"
              className="px-5 py-3 text-xs font-mono border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary transition-colors text-center"
            >
              View Online Version
            </a>
            <a
              href="#"
              className="px-5 py-3 text-xs font-mono border border-border text-muted-foreground rounded-sm hover:border-muted-foreground transition-colors text-center"
            >
              LinkedIn Profile
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResumeCenter;
