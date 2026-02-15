import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/config/profile";

const SystemOverview = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="about" className="px-4 sm:px-6 py-12 md:py-24">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-2" data-gsap="clip-up" data-gsap-duration="1">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Experience
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            Career Timeline
          </h2>
        </div>
        <div className="gsap-divider h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />

        <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

              <div className="space-y-1">
            {profile.experience.map((v, i) => (
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
                  <div className="flex items-center justify-between flex-wrap gap-y-1">
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
                  {"subtitle" in v && v.subtitle && (
                    <p className="font-mono text-[11px] text-muted-foreground/70 mt-0.5 ml-[calc(theme(spacing.3)+1.5rem)]">
                      {v.subtitle as string}
                    </p>
                  )}

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
        </div>
      </div>
    </section>
  );
};

export default SystemOverview;
