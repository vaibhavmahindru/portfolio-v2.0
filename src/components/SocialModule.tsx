import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";

const socials = [
  { platform: "GitHub", status: "ACTIVE", detail: "CONTRIBUTIONS: LIVE", icon: Github, url: "#" },
  { platform: "LinkedIn", status: "ACTIVE", detail: "NETWORK: OPEN", icon: Linkedin, url: "#" },
  { platform: "Twitter", status: "ACTIVE", detail: "SIGNAL: BROADCASTING", icon: Twitter, url: "#" },
  { platform: "Instagram", status: "PASSIVE", detail: "FEED: MINIMAL", icon: Instagram, url: "#" },
];

const SocialModule = () => {
  return (
    <section id="social" className="px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Social
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            Network Interface
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socials.map((s, i) => (
            <motion.a
              key={s.platform}
              href={s.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="glow-border rounded-md bg-card p-4 space-y-3 group block relative overflow-hidden"
            >
              {/* Animated connection line on hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-px bg-primary"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />

              <s.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  PLATFORM
                </p>
                <p className="font-mono text-xs text-foreground">{s.platform}</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  STATUS
                </p>
                <p className={`font-mono text-[10px] ${s.status === "ACTIVE" ? "text-terminal-green" : "text-muted-foreground"}`}>
                  {s.status}
                </p>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">{s.detail}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialModule;
