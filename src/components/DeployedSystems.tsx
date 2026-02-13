import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Deployment {
  name: string;
  status: "PRODUCTION" | "ACTIVE" | "EXPERIMENTAL";
  latency: string;
  scale: string;
  role: string;
  problem: string;
  solution: string;
  architecture: string;
  impact: string;
  sourceUrl?: string;
}

const deployments: Deployment[] = [
  {
    name: "CloudSync Engine",
    status: "PRODUCTION",
    latency: "~12ms",
    scale: "Multi-region",
    role: "Architecture + Implementation",
    problem: "Inconsistent data across distributed cloud nodes causing sync failures.",
    solution: "Built an event-driven sync engine with CQRS and automatic conflict resolution.",
    architecture: "Go microservices, gRPC, Redis pub/sub, Kubernetes. 3-region active-active.",
    impact: "Handles 50k req/s with 99.97% uptime. Reduced sync failures by 98%.",
    sourceUrl: "#",
  },
  {
    name: "InfraPilot",
    status: "ACTIVE",
    latency: "~45ms",
    scale: "Multi-team",
    role: "Lead Engineer",
    problem: "Manual infrastructure provisioning causing drift and deployment delays.",
    solution: "GitOps-based IaC platform with drift detection and auto-remediation.",
    architecture: "TypeScript, Terraform, AWS CDK, Prometheus. Declarative pipeline engine.",
    impact: "Manages 200+ services. Zero-downtime deployments. 80% faster provisioning.",
    sourceUrl: "#",
  },
  {
    name: "Neural Queue",
    status: "EXPERIMENTAL",
    latency: "~3ms",
    scale: "Single-tenant",
    role: "Research + Prototype",
    problem: "Static message queue scaling wastes resources during variable load.",
    solution: "ML-based load prediction for adaptive queue scaling.",
    architecture: "Rust core, Python ML layer, RabbitMQ, TensorFlow Lite.",
    impact: "40% reduction in over-provisioning. Sub-3ms p99 latency.",
    sourceUrl: "#",
  },
  {
    name: "SecureVault API",
    status: "PRODUCTION",
    latency: "~28ms",
    scale: "Multi-user",
    role: "Architecture + Security",
    problem: "Sensitive data pipelines lacked end-to-end encryption and audit trails.",
    solution: "Zero-knowledge encryption service with HSM-backed key management.",
    architecture: "Node.js, PostgreSQL, HashiCorp Vault, Docker. SOC 2 compliant.",
    impact: "99.99% uptime. Full audit logging. Passed 3 security audits.",
    sourceUrl: "#",
  },
];

const statusColors: Record<string, string> = {
  PRODUCTION: "text-status-production",
  ACTIVE: "text-status-active",
  EXPERIMENTAL: "text-status-experimental",
};

const statusDotColors: Record<string, string> = {
  PRODUCTION: "bg-status-production",
  ACTIVE: "bg-status-active",
  EXPERIMENTAL: "bg-status-experimental",
};

const DeployedSystems = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const selected = selectedIdx !== null ? deployments[selectedIdx] : null;

  return (
    <section id="deployments" className="px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Projects
          </span>
          <h2 className="text-3xl font-bold text-foreground">Deployments</h2>
        </motion.div>

        <div className="grid gap-4">
          {deployments.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glow-border rounded-md bg-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground text-lg">{d.name}</h3>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <div className={`status-dot ${statusDotColors[d.status]}`} />
                  <span className={`font-mono text-xs ${statusColors[d.status]}`}>
                    {d.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
                <span>LATENCY <span className="text-foreground ml-1">{d.latency}</span></span>
                <span>SCALE <span className="text-foreground ml-1">{d.scale}</span></span>
                <span>ROLE <span className="text-foreground ml-1">{d.role}</span></span>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSelectedIdx(i)}
                  className="px-3 py-1.5 text-xs font-mono border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary transition-colors"
                >
                  View Architecture
                </button>
                {d.sourceUrl && (
                  <a
                    href={d.sourceUrl}
                    className="px-3 py-1.5 text-xs font-mono border border-border text-muted-foreground rounded-sm hover:border-muted-foreground transition-colors"
                  >
                    Source Code
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Slide-out panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedIdx(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-card border-l border-border overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selected.name}</h3>
                    <span className={`font-mono text-xs ${statusColors[selected.status]}`}>
                      {selected.status}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedIdx(null)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {[
                  { label: "PROBLEM", content: selected.problem },
                  { label: "SOLUTION", content: selected.solution },
                  { label: "ARCHITECTURE", content: selected.architecture },
                  { label: "IMPACT", content: selected.impact },
                ].map((block) => (
                  <div key={block.label} className="space-y-1.5">
                    <p className="font-mono text-[10px] text-primary uppercase tracking-wider">
                      {block.label}
                    </p>
                    <p className="text-sm text-secondary-foreground leading-relaxed">
                      {block.content}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DeployedSystems;
