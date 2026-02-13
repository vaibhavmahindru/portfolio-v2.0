import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Capability {
  module: string;
  status: "ACTIVE" | "STABLE" | "BUILDING";
  description: string;
  tools: string[];
}

const capabilities: Capability[] = [
  {
    module: "API Architecture",
    status: "ACTIVE",
    description: "Scalable REST & event-driven systems",
    tools: ["Node.js", "PostgreSQL", "Redis", "GraphQL"],
  },
  {
    module: "Cloud Infrastructure",
    status: "ACTIVE",
    description: "AWS-focused cloud design & provisioning",
    tools: ["AWS", "Terraform", "Docker", "K8s"],
  },
  {
    module: "Automation Systems",
    status: "ACTIVE",
    description: "CI/CD pipelines & workflow automation",
    tools: ["GitHub Actions", "Jenkins", "Ansible", "Shell"],
  },
  {
    module: "Performance Optimization",
    status: "STABLE",
    description: "Latency reduction & throughput tuning",
    tools: ["Profiling", "Caching", "CDN", "Load Testing"],
  },
  {
    module: "Security Hardening",
    status: "STABLE",
    description: "Infrastructure security & compliance",
    tools: ["Vault", "IAM", "SSL/TLS", "Audit Logging"],
  },
  {
    module: "Data Engineering",
    status: "BUILDING",
    description: "ETL pipelines & data infrastructure",
    tools: ["Python", "Kafka", "Spark", "Airflow"],
  },
];

const statusColor: Record<string, string> = {
  ACTIVE: "text-terminal-green",
  STABLE: "text-primary",
  BUILDING: "text-status-experimental",
};

const CapabilitiesModule = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="capabilities" className="px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Skills
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            Operational Capabilities
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.module}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
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

              <p className="text-sm text-muted-foreground">{cap.description}</p>

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

              <AnimatePresence>
                {hoveredIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 border-t border-border">
                      <span className="font-mono text-[10px] text-primary cursor-pointer hover:underline">
                        View Technical Stack →
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesModule;
