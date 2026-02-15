import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const DeployedSystems = () => {
  return (
    <section id="deployments" className="px-4 sm:px-6 py-12 md:py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2" data-gsap="clip-up" data-gsap-duration="1">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Projects
          </span>
          <h2 className="text-3xl font-bold text-foreground">Deployments</h2>
        </div>
        <div className="gsap-divider h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-4"
        >
          {projects.map((d) => (
            <motion.div
              key={d.slug}
              variants={cardVariant}
              data-cursor-label="Inspect"
              whileHover={{
                scale: 1.01,
                boxShadow: "0 8px 30px hsl(var(--primary) / 0.08)",
              }}
              className="glow-border rounded-md bg-card p-5 space-y-3 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                  {d.name}
                </h3>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <div className={`status-dot ${statusDotColors[d.status]}`} />
                  <span className={`font-mono text-xs ${statusColors[d.status]}`}>
                    {d.status}
                  </span>
                </div>
              </div>

              <p className="text-sm text-secondary-foreground leading-relaxed">
                {d.tagline}
              </p>

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
                <Link
                  to={`/projects/${d.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary transition-colors group/link"
                  aria-label={`View case study for ${d.name}`}
                >
                  Mission Debrief
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
                {d.sourceUrl && d.sourceUrl !== "#" && (
                  <a
                    href={d.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-mono border border-border text-muted-foreground rounded-sm hover:border-muted-foreground transition-colors"
                  >
                    Source Code
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DeployedSystems;
