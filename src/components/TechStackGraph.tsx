import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Node Data ─── */
interface TechNode {
  id: string;
  label: string;       // Full name (sidebar detail panel)
  shortLabel: string;   // Short name (graph display — prevents overlap)
  category: "core" | "infra" | "data" | "quality";
  tools: string[];
  connections: string[];
}

const nodes: TechNode[] = [
  /* ── core (3) ── */
  {
    id: "platform",
    label: "Backend & Platform Engineering",
    shortLabel: "Backend",
    category: "core",
    tools: [
      "Node.js",
      "Express",
      "Layered Architecture",
      "Multi-Tenant Design",
      "57+ REST Endpoints",
      "Background Workers",
      "Service-Oriented Design",
    ],
    connections: ["data-platform", "api", "security", "cloud", "financial"],
  },

  {
    id: "data-platform",
    label: "Data Platform & Processing",
    shortLabel: "Data Platform",
    category: "core",
    tools: [
      "Python",
      "SQL",
      "ETL Pipelines",
      "Data Validation",
      "Normalization",
      "Deduplication",
      "Reconciliation Logic",
      "Idempotent Processing",
      "Aggregation Optimization",
    ],
    connections: [
      "database",
      "automation",
      "analytics",
      "ai",
      "telemetry",
      "batch",
    ],
  },

  {
    id: "api",
    label: "API & External Integrations",
    shortLabel: "APIs",
    category: "core",
    tools: [
      "REST Architecture",
      "Express",
      "Third-Party API Integration",
      "GPS APIs (Intangles)",
      "WhatsApp Business API (Messaging & Alerts)",
      "Payment Gateway Integration",
      "Webhook Handling",
      "Schema-Aware API Design",
    ],
    connections: [
      "platform",
      "ai",
      "telemetry",
      "security",
      "financial",
    ],
  },

  /* ── infrastructure (3) ── */
  {
    id: "cloud",
    label: "Cloud & Infrastructure",
    shortLabel: "Cloud",
    category: "infra",
    tools: [
      "AWS (EC2, RDS, S3)",
      "Azure (Provisioning, Migration, Monitoring)",
      "GCP (Compute & Storage Fundamentals)",
      "Production Deployments",
      "Environment Configuration",
      "Cloud Resource Optimization",
    ],
    connections: ["platform", "devops", "automation", "security", "database"],
  },

  {
    id: "devops",
    label: "DevOps & CI/CD",
    shortLabel: "DevOps",
    category: "infra",
    tools: [
      "Docker",
      "GitHub Actions",
      "CI/CD Pipelines",
      "Linux",
      "Deployment Automation",
      "Environment Management",
    ],
    connections: ["cloud", "platform", "automation"],
  },

  {
    id: "security",
    label: "Security & Access Control",
    shortLabel: "Security",
    category: "infra",
    tools: [
      "JWT Authentication",
      "Role-Based Access Control",
      "Token-Based Authorization",
      "API Access Control",
      "Secrets & Environment Management",
    ],
    connections: ["platform", "cloud", "api"],
  },

  /* ── data systems (4) ── */
  {
    id: "database",
    label: "Database Engineering",
    shortLabel: "Database",
    category: "data",
    tools: [
      "PostgreSQL",
      "MySQL",
      "65+ Schema Models",
      "Composite Indexing",
      "Query Optimization",
      "Aggregation Tuning",
      "Relational Modeling",
    ],
    connections: [
      "platform",
      "data-platform",
      "analytics",
      "financial",
      "batch",
    ],
  },

  {
    id: "telemetry",
    label: "Telemetry & Event Processing",
    shortLabel: "Telemetry",
    category: "data",
    tools: [
      "GPS APIs (Intangles)",
      "High-Frequency Telemetry",
      "Vehicle Data Processing",
      "Event Normalization",
      "External API Ingestion",
    ],
    connections: ["data-platform", "api", "database", "batch"],
  },

  {
    id: "analytics",
    label: "Analytics & Business Intelligence",
    shortLabel: "Analytics",
    category: "data",
    tools: [
      "Power BI",
      "Operational Dashboards",
      "Business Reporting",
      "Trend & Anomaly Analysis",
      "Materialized Reporting Pipelines",
    ],
    connections: ["data-platform", "database", "ai", "cloud"],
  },

  {
    id: "ai",
    label: "AI-Assisted Systems",
    shortLabel: "AI / LLM",
    category: "data",
    tools: [
      "Gemini API",
      "DeepSeek",
      "Dynamic SQL Generation",
      "Schema-Aware Prompting",
      "Query Guardrails",
      "AI-Powered Analytics Assistant (VaYu)",
    ],
    connections: ["data-platform", "api", "analytics"],
  },

  /* ── reliability & finance (3) ── */
  {
    id: "automation",
    label: "Automation & Workflow Orchestration",
    shortLabel: "Automation",
    category: "quality",
    tools: [
      "Cron Jobs",
      "Python Automation Scripts",
      "Scheduled Pipelines (9+)",
      "Power Automate",
      "Workflow Automation",
    ],
    connections: ["data-platform", "cloud", "devops", "batch"],
  },

  {
    id: "batch",
    label: "Batch & Pipeline Processing",
    shortLabel: "Batch Ops",
    category: "quality",
    tools: [
      "Idempotent Processing",
      "Retry Logic",
      "Failure Recovery",
      "Historical Backfill",
      "Settlement Batch Computation",
    ],
    connections: ["telemetry", "financial", "automation", "database"],
  },

  {
    id: "financial",
    label: "Financial & Transaction Systems",
    shortLabel: "Finance",
    category: "quality",
    tools: [
      "Driver Settlement Engine",
      "Trip-Level Aggregation",
      "Financial Reconciliation",
      "Audit Validation Logic",
      "Payment Gateway Integration",
      "Transaction State Management",
    ],
    connections: ["platform", "database", "batch", "data-platform", "api"],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  core: "hsl(var(--primary))",
  infra: "hsl(142, 70%, 45%)",
  data: "hsl(200, 70%, 50%)",
  quality: "hsl(45, 90%, 55%)",
};

/* ─── Force-Directed Layout Simulation ─── */
interface NodePos {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const GRAPH_W = 200;
const GRAPH_H = 120;

const runForceSimulation = (
  nodeList: TechNode[],
  width: number,
  height: number,
  iterations: number,
): Map<string, { x: number; y: number }> => {
  // Seed positions in a wide ellipse so nodes start well-separated
  const positions: NodePos[] = nodeList.map((n, i) => {
    const angle = (i / nodeList.length) * Math.PI * 2;
    const rx = width * 0.36;
    const ry = height * 0.34;
    return {
      id: n.id,
      x: width / 2 + Math.cos(angle) * rx + (Math.random() - 0.5) * 8,
      y: height / 2 + Math.sin(angle) * ry + (Math.random() - 0.5) * 8,
      vx: 0,
      vy: 0,
    };
  });

  const connectionSet = new Set<string>();
  for (const node of nodeList) {
    for (const conn of node.connections) {
      connectionSet.add([node.id, conn].sort().join("-"));
    }
  }

  const isConnected = (a: string, b: string) =>
    connectionSet.has([a, b].sort().join("-"));

  for (let iter = 0; iter < iterations; iter++) {
    const alpha = 1 - iter / iterations;

    // Repulsion — much stronger to prevent overlap at this scale
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = (3000 * alpha) / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        positions[i].vx += fx;
        positions[i].vy += fy;
        positions[j].vx -= fx;
        positions[j].vy -= fy;
      }
    }

    // Attraction — ideal spring length of 40 units
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (!isConnected(positions[i].id, positions[j].id)) continue;
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = (dist - 40) * 0.03 * alpha;
        const fx = (dx / Math.max(dist, 1)) * force;
        const fy = (dy / Math.max(dist, 1)) * force;
        positions[i].vx += fx;
        positions[i].vy += fy;
        positions[j].vx -= fx;
        positions[j].vy -= fy;
      }
    }

    // Center gravity
    for (const p of positions) {
      p.vx += (width / 2 - p.x) * 0.008 * alpha;
      p.vy += (height / 2 - p.y) * 0.008 * alpha;
    }

    // Apply velocity + damping
    for (const p of positions) {
      p.vx *= 0.82;
      p.vy *= 0.82;
      p.x += p.vx;
      p.y += p.vy;
      const pad = 20;
      p.x = Math.max(pad, Math.min(width - pad, p.x));
      p.y = Math.max(pad, Math.min(height - pad, p.y));
    }
  }

  const result = new Map<string, { x: number; y: number }>();
  for (const p of positions) {
    result.set(p.id, { x: p.x, y: p.y });
  }
  return result;
};

/* ─── Data Packet (native SVG animation, no Framer Motion) ─── */
const DataPacket = ({
  x1,
  y1,
  x2,
  y2,
  duration,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  duration: number;
  delay: number;
}) => (
  <circle r="1.5" fill="hsl(var(--primary))" opacity="0">
    <animate
      attributeName="cx"
      values={`${x1};${x2}`}
      dur={`${duration}s`}
      begin={`${delay}s`}
      repeatCount="indefinite"
    />
    <animate
      attributeName="cy"
      values={`${y1};${y2}`}
      dur={`${duration}s`}
      begin={`${delay}s`}
      repeatCount="indefinite"
    />
    <animate
      attributeName="opacity"
      values="0;0.7;0.7;0"
      dur={`${duration}s`}
      begin={`${delay}s`}
      repeatCount="indefinite"
    />
  </circle>
);

/* ─── Main Component ─── */
const TechStackGraph = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [sidebarNode, setSidebarNode] = useState<TechNode | null>(null);
  const [pulsingNodes, setPulsingNodes] = useState<Set<string>>(new Set());

  const posMap = useMemo(() => runForceSimulation(nodes, GRAPH_W, GRAPH_H, 350), []);

  const activeConnections = activeNode
    ? (nodes.find((n) => n.id === activeNode)?.connections ?? [])
    : [];

  // Collect unique edges
  const edges = useMemo(() => {
    const seen = new Set<string>();
    const result: { from: TechNode; to: TechNode }[] = [];
    for (const node of nodes) {
      for (const connId of node.connections) {
        const key = [node.id, connId].sort().join("-");
        if (seen.has(key)) continue;
        seen.add(key);
        const target = nodes.find((n) => n.id === connId);
        if (target) result.push({ from: node, to: target });
      }
    }
    return result;
  }, []);

  // Ambient pulsing
  useEffect(() => {
    const interval = setInterval(() => {
      const nodeId = nodes[Math.floor(Math.random() * nodes.length)].id;
      setPulsingNodes((prev) => new Set(prev).add(nodeId));
      setTimeout(() => {
        setPulsingNodes((prev) => {
          const next = new Set(prev);
          next.delete(nodeId);
          return next;
        });
      }, 2000);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleNodeClick = useCallback((node: TechNode) => {
    setSidebarNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  return (
    <section id="stack" className="px-4 sm:px-6 py-12 md:py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2" data-gsap="clip-up" data-gsap-duration="1">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Architecture
          </span>
          <h2 className="text-3xl font-bold text-foreground">System Graph</h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Hover to explore connections. Click a node for details.
          </p>
        </div>
        <div className="gsap-divider h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />

        {/* Legend */}
        <div className="flex flex-wrap gap-4 font-mono text-[10px]">
          {(
            [
              { key: "core", label: "Core" },
              { key: "infra", label: "Infrastructure" },
              { key: "data", label: "Data" },
              { key: "quality", label: "Reliability" },
            ] as const
          ).map((cat) => (
            <div key={cat.key} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat.key] }}
              />
              <span className="text-muted-foreground uppercase tracking-wider">
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="relative">
          <svg
            className="w-full"
            viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ minHeight: 420 }}
          >
            {/* Subtle radial gradient background */}
            <defs>
              <radialGradient id="graph-bg" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0.03"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity="0"
                />
              </radialGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width={GRAPH_W}
              height={GRAPH_H}
              fill="url(#graph-bg)"
              rx="2"
            />

            {/* Connection lines */}
            {edges.map(({ from, to }) => {
              const fp = posMap.get(from.id);
              const tp = posMap.get(to.id);
              if (!fp || !tp) return null;
              const isHighlighted =
                activeNode === from.id || activeNode === to.id;
                return (
                <line
                  key={`${from.id}-${to.id}`}
                  x1={fp.x}
                  y1={fp.y}
                  x2={tp.x}
                  y2={tp.y}
                    stroke="hsl(var(--primary))"
                  strokeWidth={isHighlighted ? 0.6 : 0.25}
                  opacity={isHighlighted ? 0.5 : 0.08}
                  style={{ transition: "opacity 0.3s, stroke-width 0.3s" }}
                />
              );
            })}

            {/* Data packets (native SVG animation) */}
            {edges.map(({ from, to }, i) => {
              const fp = posMap.get(from.id);
              const tp = posMap.get(to.id);
              if (!fp || !tp) return null;
              return (
                <DataPacket
                  key={`pkt-${from.id}-${to.id}`}
                  x1={fp.x}
                  y1={fp.y}
                  x2={tp.x}
                  y2={tp.y}
                  duration={2.5 + (i % 5) * 0.4}
                  delay={i * 0.5}
                  />
                );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = posMap.get(node.id);
              if (!pos) return null;
              const isActive = activeNode === node.id;
              const isConnected = activeConnections.includes(node.id);
              const isPulsing = pulsingNodes.has(node.id);
              const dimmed = activeNode !== null && !isActive && !isConnected;
              const catColor = CATEGORY_COLORS[node.category];

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  onClick={() => handleNodeClick(node)}
                  className="cursor-pointer"
                  style={{ transition: "opacity 0.3s" }}
                  opacity={dimmed ? 0.3 : 1}
                >
                  {/* Pulsing glow ring (native SVG) */}
                  {(isActive || isPulsing) && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      fill="none"
                      stroke={catColor}
                      strokeWidth="0.25"
                    >
                      <animate
                        attributeName="r"
                        values="7;11;7"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.4;0.08;0.4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Outer ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isActive ? 6.5 : 5}
                    fill="hsl(var(--card))"
                    stroke={catColor}
                    strokeWidth={isActive || isConnected ? 0.8 : 0.5}
                    style={{ transition: "r 0.25s, stroke-width 0.25s" }}
                  />

                  {/* Inner dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isActive ? 2.2 : 1.4}
                    fill={catColor}
                    opacity={isActive ? 1 : 0.6}
                    style={{ transition: "r 0.25s, opacity 0.25s" }}
                  />

                  {/* Label — short name to prevent overlap */}
                  <text
                    x={pos.x}
                    y={pos.y + 9}
                    textAnchor="middle"
                    className="font-mono select-none pointer-events-none"
                    fontSize="3.5"
                    fill={isActive ? catColor : "hsl(var(--muted-foreground))"}
                    style={{ transition: "fill 0.25s" }}
                  >
                    {node.shortLabel}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Sidebar detail panel */}
          <AnimatePresence>
            {sidebarNode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="absolute top-4 right-4 w-60 glow-border rounded-md bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: CATEGORY_COLORS[sidebarNode.category],
                      }}
                    />
                    <h4 className="font-mono text-xs text-primary uppercase">
                      {sidebarNode.label}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSidebarNode(null)}
                    className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    &times;
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    Tools &amp; Technologies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sidebarNode.tools.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[10px] font-mono bg-secondary/50 text-foreground rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    Connected Systems
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {sidebarNode.connections.map((c) => {
                      const target = nodes.find((n) => n.id === c);
                      return (
                        <button
                          key={c}
                          onClick={() => {
                            const n = nodes.find((n) => n.id === c);
                            if (n) setSidebarNode(n);
                          }}
                          className="px-1.5 py-0.5 text-[10px] font-mono text-primary hover:bg-primary/10 rounded-sm transition-colors"
                        >
                          {target?.label ?? c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 font-mono text-center">
          {[
            { value: `${nodes.length}`, label: "Tech Domains" },
            { value: `${edges.length}`, label: "Connections" },
            { value: "40+", label: "Technologies" },
            { value: "4", label: "Categories" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="py-3 rounded-sm bg-card/50 border border-border/50"
            >
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackGraph;
