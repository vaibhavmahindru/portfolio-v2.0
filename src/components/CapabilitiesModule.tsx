import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/config/profile";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* Capabilities data comes from profile.ts — edit there to update */
const capabilities = profile.capabilities as unknown as {
  module: string;
  status: "ACTIVE" | "STABLE" | "BUILDING";
  description: string;
  tools: readonly string[];
  details?: readonly string[];
}[];

const statusColor: Record<string, string> = {
  ACTIVE: "text-terminal-green",
  STABLE: "text-primary",
  BUILDING: "text-status-experimental",
};

const CapabilitiesModule = () => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <section id="capabilities" className="px-4 sm:px-6 py-12 md:py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2" data-gsap="clip-up" data-gsap-duration="1">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Skills
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            Operational Capabilities
          </h2>
        </div>
        <div className="gsap-divider h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        >
          {capabilities.map((cap, i) => {
            const isExpanded = expandedIdx === i;
            return (
              <motion.div
                key={cap.module}
                variants={cardVariant}
                className="glow-border rounded-md bg-card p-5 space-y-3 cursor-default"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                      MODULE
                    </p>
                    <h3 className="font-semibold text-foreground">{cap.module}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        cap.status === "ACTIVE"
                          ? "bg-terminal-green"
                          : cap.status === "STABLE"
                          ? "bg-primary"
                          : "bg-status-experimental"
                      }`}
                      style={{ boxShadow: "0 0 6px currentColor" }}
                    />
                    <span className={`font-mono text-[10px] ${statusColor[cap.status]}`}>
                      {cap.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {cap.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[10px] font-mono bg-secondary text-secondary-foreground rounded-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Clickable expansion trigger */}
                <div className="pt-2 border-t border-border">
                  <button
                    onClick={() => setExpandedIdx(isExpanded ? null : i)}
                    className="font-mono text-[10px] text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
                  >
                    {isExpanded ? "Hide Details ↑" : "View Details →"}
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pt-1">
                        {/* <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p> */}

                        {cap.details && cap.details.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                              IMPLEMENTATION DETAILS
                            </p>
                            {cap.details.map((detail) => (
                              <div key={detail} className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span className="font-mono text-[11px] text-foreground/80 leading-relaxed">{detail}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CapabilitiesModule;
