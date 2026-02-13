import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const versions = [
  {
    version: "1.0",
    title: "Curious Builder",
    period: "2018 – 2020",
    description:
      "Started with fundamentals — HTML, CSS, JavaScript. Built small tools, scraped data, broke things intentionally. Discovered the joy of making systems work.",
  },
  {
    version: "2.0",
    title: "Startup Engineer",
    period: "2020 – 2023",
    description:
      "Joined early-stage startups building backend services. Shipped APIs, managed databases, learned to build under pressure. First encounter with AWS and CI/CD pipelines.",
  },
  {
    version: "3.0",
    title: "Backend & Cloud Architect",
    period: "2023 – Present",
    description:
      "Designing distributed systems, automating cloud infrastructure, and building scalable backends. Focused on reliability engineering and clean architecture patterns.",
  },
];

const bio = {
  name: "Alex Chen",
  title: "Senior Systems Engineer",
  location: "India",
  specialization: ["Cloud Architecture", "DevOps", "Distributed Systems"],
  status: "Available for projects",
  api_version: "3.2",
};

const SystemOverview = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [mode, setMode] = useState<"human" | "machine">("human");

  return (
    <section id="about" className="px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // About
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            System Architecture
          </h2>
        </motion.div>

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
          {mode === "machine" ? (
            <motion.pre
              key="machine"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-sm text-secondary-foreground bg-secondary/50 p-4 rounded-md border border-border overflow-x-auto"
            >
              <code>{JSON.stringify(bio, null, 2)}</code>
            </motion.pre>
          ) : (
            <motion.div
              key="human"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

              <div className="space-y-1">
                {versions.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-8"
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 top-4 w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center transition-colors ${
                        expanded === i
                          ? "border-primary bg-primary/20"
                          : "border-border bg-card"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${
                          expanded === i ? "bg-primary" : "bg-muted-foreground/50"
                        }`}
                      />
                    </div>

                    <button
                      onClick={() =>
                        setExpanded(expanded === i ? null : i)
                      }
                      className="w-full text-left glow-border rounded-md bg-card p-4 my-1 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-primary">
                            v{v.version}
                          </span>
                          <span className="font-semibold text-foreground">
                            {v.title}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {v.period}
                        </span>
                      </div>

                      <AnimatePresence>
                        {expanded === i && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-muted-foreground mt-3 leading-relaxed overflow-hidden"
                          >
                            {v.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SystemOverview;
