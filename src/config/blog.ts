/**
 * Blog / "System Logs" data.
 * Each entry appears as a transmission log on the homepage.
 * Add external URLs to link to full articles on Dev.to, Hashnode, etc.
 */

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  url?: string; // External link to full article
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "event-driven-sync",
    title: "Why Event-Driven Architecture Beats Polling for Cloud Sync",
    date: "2025-12-15",
    tags: ["Architecture", "Cloud", "Go"],
    excerpt:
      "After building CloudSync Engine, I learned that event sourcing with CQRS doesn't just solve consistency — it fundamentally changes how you think about distributed state. Here's what polling gets wrong and how event-driven patterns fix it.",
    readTime: "8 min",
  },
  {
    id: "terraform-drift",
    title: "Detecting Infrastructure Drift Before It Becomes a Production Incident",
    date: "2025-10-02",
    tags: ["DevOps", "Terraform", "AWS"],
    excerpt:
      "Infrastructure drift is the silent killer of reliable deployments. I built a real-time drift detection agent that catches discrepancies within 60 seconds. Here's the architecture and the lessons learned.",
    readTime: "6 min",
  },
  {
    id: "rust-message-queues",
    title: "Building a Sub-3ms Message Broker in Rust",
    date: "2025-08-20",
    tags: ["Rust", "Performance", "Systems"],
    excerpt:
      "When Python and Node.js couldn't deliver the latency guarantees we needed, I turned to Rust. The result was a custom message broker that handles 100k msg/s with p99 latency under 3ms. Here's how.",
    readTime: "10 min",
  },
  {
    id: "zero-knowledge-search",
    title: "Searchable Encryption: Querying Data You Can't See",
    date: "2025-06-10",
    tags: ["Security", "Cryptography", "Node.js"],
    excerpt:
      "Zero-knowledge architecture makes search impossible... unless you get creative. I built a custom encrypted index system that enables server-side queries without ever exposing plaintext data.",
    readTime: "12 min",
  },
  {
    id: "gitops-dx",
    title: "GitOps Is Only as Good as Its Developer Experience",
    date: "2025-04-05",
    tags: ["DevOps", "DX", "TypeScript"],
    excerpt:
      "We had the perfect GitOps pipeline — and nobody used it. The problem wasn't the architecture; it was the developer experience. Here's how a CLI and VS Code extension changed everything.",
    readTime: "7 min",
  },
];

