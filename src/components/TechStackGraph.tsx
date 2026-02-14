import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TechNode {
  id: string;
  label: string;
  x: number;
  y: number;
  tools: string[];
  connections: string[];
}

const nodes: TechNode[] = [
  { id: "backend", label: "Backend", x: 50, y: 20, tools: ["Node.js", "Go", "Rust", "Python"], connections: ["cloud", "database", "security"] },
  { id: "cloud", label: "Cloud", x: 85, y: 45, tools: ["AWS", "Terraform", "Docker", "K8s"], connections: ["backend", "automation"] },
  { id: "database", label: "Database", x: 15, y: 45, tools: ["PostgreSQL", "Redis", "MongoDB", "Kafka"], connections: ["backend", "security"] },
  { id: "security", label: "Security", x: 30, y: 80, tools: ["Vault", "IAM", "SSL/TLS", "Audit Logging"], connections: ["database", "backend"] },
  { id: "automation", label: "Automation", x: 70, y: 80, tools: ["GitHub Actions", "Jenkins", "Ansible", "CI/CD"], connections: ["cloud", "backend"] },
];

const TechStackGraph = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [sidebarNode, setSidebarNode] = useState<TechNode | null>(null);

  const activeConnections = activeNode
    ? nodes.find((n) => n.id === activeNode)?.connections ?? []
    : [];

  return (
    <section id="stack" className="px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Architecture
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            System Graph
          </h2>
        </motion.div>

        <div className="relative">
          <svg className="w-full aspect-[2/1]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Connection lines */}
            {nodes.map((node) =>
              node.connections.map((connId) => {
                const target = nodes.find((n) => n.id === connId);
                if (!target) return null;
                const isHighlighted = activeNode === node.id || activeNode === connId;
                return (
                  <motion.line
                    key={`${node.id}-${connId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.3"
                    animate={{ opacity: isHighlighted ? 0.6 : 0.12 }}
                    transition={{ duration: 0.3 }}
                  />
                );
              })
            )}
            {/* Nodes */}
            {nodes.map((node) => {
              const isActive = activeNode === node.id;
              const isConnected = activeConnections.includes(node.id);
              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  onClick={() => setSidebarNode(sidebarNode?.id === node.id ? null : node)}
                  className="cursor-pointer"
                >
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="4"
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.5"
                    animate={{
                      r: isActive ? 5 : 4,
                      strokeWidth: isActive || isConnected ? 1 : 0.5,
                      opacity: activeNode && !isActive && !isConnected ? 0.4 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                  />
                  <motion.text
                    x={node.x}
                    y={node.y + 8}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="3"
                    fill="hsl(var(--muted-foreground))"
                    animate={{
                      fill: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      opacity: activeNode && !isActive && !isConnected ? 0.3 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {node.label}
                  </motion.text>
                </g>
              );
            })}
          </svg>

          {/* Sidebar */}
          <AnimatePresence>
            {sidebarNode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="absolute top-0 right-0 w-56 glow-border rounded-md bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs text-primary uppercase">{sidebarNode.label}</h4>
                  <button
                    onClick={() => setSidebarNode(null)}
                    className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sidebarNode.tools.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] font-mono bg-secondary text-secondary-foreground rounded-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Connections</p>
                  <p className="font-mono text-[10px] text-foreground">
                    {sidebarNode.connections.join(", ")}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default TechStackGraph;
