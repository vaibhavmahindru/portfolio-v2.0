import { motion } from "framer-motion";
import { useState } from "react";

type ProjectStatus = "PRODUCTION" | "ACTIVE" | "EXPERIMENTAL";

interface Project {
  name: string;
  description: string;
  status: ProjectStatus;
  stack: string[];
  latency: string;
  uptime: string;
  architecture: string;
}

const projects: Project[] = [
  {
    name: "CloudSync Engine",
    description: "Real-time data synchronization across distributed cloud nodes",
    status: "PRODUCTION",
    stack: ["Go", "gRPC", "Redis", "K8s"],
    latency: "12ms",
    uptime: "99.97%",
    architecture: "Event-driven microservices with CQRS pattern. Handles 50k req/s across 3 regions with automatic failover and conflict resolution.",
  },
  {
    name: "InfraPilot",
    description: "Automated infrastructure provisioning and monitoring platform",
    status: "ACTIVE",
    stack: ["TypeScript", "Terraform", "AWS", "Prometheus"],
    latency: "45ms",
    uptime: "99.91%",
    architecture: "GitOps-based IaC with drift detection. Declarative pipelines manage 200+ services with zero-downtime deployments.",
  },
  {
    name: "Neural Queue",
    description: "ML-optimized message queue with predictive scaling",
    status: "EXPERIMENTAL",
    stack: ["Rust", "Python", "RabbitMQ", "TensorFlow"],
    latency: "3ms",
    uptime: "98.5%",
    architecture: "Custom queue implementation with ML-based load prediction. Reduces over-provisioning by 40% through adaptive scaling algorithms.",
  },
  {
    name: "SecureVault API",
    description: "Zero-knowledge encryption service for sensitive data pipelines",
    status: "PRODUCTION",
    stack: ["Node.js", "PostgreSQL", "Vault", "Docker"],
    latency: "28ms",
    uptime: "99.99%",
    architecture: "End-to-end encrypted data pipeline with HSM-backed key management. SOC 2 Type II compliant with automated audit logging.",
  },
];

const statusColors: Record<ProjectStatus, string> = {
  PRODUCTION: "text-status-production",
  ACTIVE: "text-status-active",
  EXPERIMENTAL: "text-status-experimental",
};

const statusDotColors: Record<ProjectStatus, string> = {
  PRODUCTION: "bg-status-production",
  ACTIVE: "bg-status-active",
  EXPERIMENTAL: "bg-status-experimental",
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glow-border rounded-md bg-card p-6 space-y-4 cursor-default"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <div className={`status-dot ${statusDotColors[project.status]}`} />
          <span className={`font-mono text-xs ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Stack */}
      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-xs font-mono bg-secondary text-secondary-foreground rounded-sm"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Metadata */}
      <div className="flex gap-6 font-mono text-xs text-muted-foreground">
        <span>
          LATENCY <span className="text-foreground ml-1">{project.latency}</span>
        </span>
        <span>
          UPTIME <span className="text-foreground ml-1">{project.uptime}</span>
        </span>
      </div>

      {/* Architecture (hover reveal) */}
      <motion.div
        initial={false}
        animate={{
          height: hovered ? "auto" : 0,
          opacity: hovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-3 border-t border-border">
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            <span className="text-primary text-[10px] uppercase tracking-wider block mb-1">
              Architecture
            </span>
            {project.architecture}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  return (
    <section className="relative px-6 py-12 md:py-24">
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
          <h2 className="text-3xl font-bold text-foreground">System Registry</h2>
        </motion.div>

        <div className="grid gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
