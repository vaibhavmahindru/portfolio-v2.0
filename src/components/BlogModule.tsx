import { motion } from "framer-motion";
import { ExternalLink, Clock, Calendar } from "lucide-react";
import { blogPosts } from "@/config/blog";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const BlogModule = () => {
  return (
    <section id="logs" className="px-4 sm:px-6 py-12 md:py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2" data-gsap="clip-up" data-gsap-duration="1">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Transmissions
          </span>
          <h2 className="text-3xl font-bold text-foreground">Field Reports</h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Technical write-ups, architecture decisions, and lessons from production systems.
          </p>
        </div>
        <div className="gsap-divider h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-4"
        >
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={fadeUp}
              className="group glow-border rounded-md bg-card p-5 space-y-3 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </div>
                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-primary transition-colors shrink-0"
                    aria-label={`Read ${post.title}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <p className="text-sm text-secondary-foreground leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-mono bg-secondary text-secondary-foreground rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogModule;

