import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { profile } from "@/config/profile";

interface SocialItem {
  platform: string;
  status: "ACTIVE" | "PASSIVE";
  detail: string;
  icon: typeof Github;
  href: string;
  isEmail?: boolean;
}

const socials: SocialItem[] = [
  { platform: "GitHub", status: "ACTIVE", detail: "Open source contributions", icon: Github, href: profile.links.github },
  { platform: "LinkedIn", status: "ACTIVE", detail: "Professional network", icon: Linkedin, href: profile.links.linkedin },
  { platform: "Email", status: "ACTIVE", detail: profile.contact.email, icon: Mail, href: `mailto:${profile.contact.email}`, isEmail: true },
];

const iconAnimations: Record<string, object> = {
  GitHub: { rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } },
  LinkedIn: { scale: [1, 1.2, 1], transition: { duration: 0.4 } },
  Email: { y: [0, -3, 0], transition: { duration: 0.3 } },
};

const SocialModule = () => {
  return (
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
      className="glow-border rounded-md bg-card overflow-hidden h-full flex flex-col min-w-0"
        >
      {/* Header */}
      <div className="p-4 pb-3 sm:p-5 sm:pb-4 border-b border-border/50">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-mono text-xs text-foreground font-medium">Network</p>
            <p className="font-mono text-[10px] text-muted-foreground">Social interfaces</p>
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="p-4 sm:p-5 flex-1 space-y-2">
          {socials.map((s, i) => (
            <motion.a
              key={s.platform}
            href={s.href}
            target={s.isEmail ? undefined : "_blank"}
            rel={s.isEmail ? undefined : "noopener noreferrer"}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            whileHover={{ x: 4 }}
            className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-md bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-border/50 transition-all group"
            aria-label={`Visit ${s.platform} profile`}
          >
            <motion.div
              whileHover={iconAnimations[s.platform]}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-card border border-border/50 flex items-center justify-center shrink-0"
            >
              <s.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs text-foreground font-medium">{s.platform}</p>
                <div className={`w-1.5 h-1.5 rounded-full ${s.status === "ACTIVE" ? "bg-terminal-green" : "bg-muted-foreground/40"}`} />
              </div>
              <p className="font-mono text-[10px] text-muted-foreground truncate">{s.detail}</p>
              </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0" />
            </motion.a>
          ))}
      </div>

      {/* Footer CTA */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
          <p className="font-mono text-[10px] text-primary text-center">
            Open to collaborations and conversations
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialModule;
