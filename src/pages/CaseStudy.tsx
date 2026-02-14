import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projects } from "@/config/projects";

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

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  // Scroll to top on mount / slug change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">// Error</p>
          <h1 className="text-4xl font-bold font-mono">Project Not Found</h1>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
          >
            Return to Command Center
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { label: "MISSION BRIEF", content: project.tagline },
    { label: "PROBLEM STATEMENT", content: project.problem },
    { label: "APPROACH", content: project.approach },
    { label: "ARCHITECTURE", content: project.architecture },
    { label: "RESULTS & IMPACT", content: project.results },
    { label: "LESSONS LEARNED", content: project.learnings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top navigation bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between font-mono text-[11px] text-muted-foreground">
          <Link
            to="/#deployments"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Deployments
          </Link>
          <span className="tracking-widest">
            MISSION DEBRIEF: <span className="text-primary">{project.name.toUpperCase()}</span>
          </span>
        </div>
      </div>

      <main className="pt-20 pb-16 px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto space-y-12"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`status-dot ${statusDotColors[project.status]}`} />
              <span className={`font-mono text-xs ${statusColors[project.status]} uppercase tracking-widest`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">{project.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{project.tagline}</p>

            {/* Metrics bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {project.metrics.map((m) => (
                <div key={m.label} className="glow-border rounded-md bg-card p-3">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  <p className="font-mono text-sm text-foreground font-medium mt-1">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Quick info */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground pt-2">
              <span>LATENCY <span className="text-foreground ml-1">{project.latency}</span></span>
              <span>SCALE <span className="text-foreground ml-1">{project.scale}</span></span>
              <span>ROLE <span className="text-foreground ml-1">{project.role}</span></span>
            </div>
          </motion.div>

          {/* Sections */}
          {sections.map((section) => (
            <motion.div key={section.label} variants={fadeUp} className="space-y-3">
              <h2 className="font-mono text-xs text-primary uppercase tracking-widest">
                // {section.label}
              </h2>
              <p className="text-secondary-foreground leading-relaxed text-[15px]">
                {section.content}
              </p>
            </motion.div>
          ))}

          {/* Architecture flow */}
          <motion.div variants={fadeUp} className="space-y-4 pt-4 border-t border-border">
            <h2 className="font-mono text-xs text-primary uppercase tracking-widest">
              // ARCHITECTURE FLOW
            </h2>
            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
              {project.flow.map((step, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="px-3 py-1.5 bg-card border border-border text-secondary-foreground rounded-sm"
                  >
                    {step}
                  </motion.span>
                  {idx < project.flow.length - 1 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="text-primary"
                    >
                      →
                    </motion.span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stack */}
          <motion.div variants={fadeUp} className="space-y-4 pt-4 border-t border-border">
            <h2 className="font-mono text-xs text-primary uppercase tracking-widest">// STACK</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span key={t} className="px-3 py-1.5 text-xs font-mono bg-card border border-border text-secondary-foreground rounded-sm">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="flex gap-3 pt-4 border-t border-border">
            {project.sourceUrl && project.sourceUrl !== "#" && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Github className="w-3.5 h-3.5" /> View Source
              </a>
            )}
            {project.liveUrls
              ? project.liveUrls.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> {link.label}
                  </a>
                ))
              : project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </a>
                )}
            <Link
              to="/#deployments"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono border border-border text-muted-foreground rounded-sm hover:border-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Deployments
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CaseStudy;

