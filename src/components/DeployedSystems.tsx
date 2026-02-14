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
  stack: string[];
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
    stack: ["Go", "gRPC", "Redis", "K8s"],
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
    stack: ["TypeScript", "Terraform", "AWS", "Prometheus"],
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
    stack: ["Rust", "Python", "RabbitMQ", "TensorFlow"],
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
    stack: ["Node.js", "PostgreSQL", "Vault", "Docker"],
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
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const expanded = expandedIdx !== null ? deployments[expandedIdx] : null;

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
              data-cursor-label="Inspect"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              whileHover={{
                scale: 1.01,
                boxShadow: "0 8px 30px hsl(var(--primary) / 0.08)",
              }}
              className="glow-border rounded-md bg-card p-5 space-y-3 transition-all duration-300"
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

              <div className="flex flex-wrap gap-2">
                {d.stack.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 text-[10px] font-mono bg-secondary text-secondary-foreground rounded-sm">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setExpandedIdx(i)}
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

      {/* Fullscreen expansion panel */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md"
              onClick={() => setExpandedIdx(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-4 md:inset-12 lg:inset-20 z-50 bg-card border border-border rounded-md overflow-y-auto"
            >
              <div className="p-8 md:p-12 space-y-8 max-w-3xl mx-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{expanded.name}</h3>
                    <span className={`font-mono text-xs ${statusColors[expanded.status]}`}>
                      {expanded.status}
                    </span>
                  </div>
                  <button
                    onClick={() => setExpandedIdx(null)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    { label: "PROBLEM", content: expanded.problem },
                    { label: "SOLUTION", content: expanded.solution },
                    { label: "ARCHITECTURE", content: expanded.architecture },
                    { label: "IMPACT", content: expanded.impact },
                  ].map((block) => (
                    <div key={block.label} className="space-y-2">
                      <p className="font-mono text-[10px] text-primary uppercase tracking-wider">
                        {block.label}
                      </p>
                      <p className="text-sm text-secondary-foreground leading-relaxed">
                        {block.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="font-mono text-[10px] text-primary uppercase tracking-wider">STACK</p>
                  <div className="flex flex-wrap gap-2">
                    {expanded.stack.map((t) => (
                      <span key={t} className="px-3 py-1 text-xs font-mono bg-secondary text-secondary-foreground rounded-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DeployedSystems;
