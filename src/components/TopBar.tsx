import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const sectionIds = ["about", "capabilities", "deployments", "stack", "resume", "social", "contact"];
const sectionLabels: Record<string, string> = {
  about: "System Architecture",
  capabilities: "Capabilities",
  deployments: "Deployments",
  stack: "Stack",
  resume: "Credentials",
  social: "Network",
  contact: "Contact",
};

const TopBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // Find active section
      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-3 backdrop-blur-sm transition-all duration-300 ${
        scrolled
          ? "bg-background/80 border-b border-primary/20"
          : "bg-background/60 border-b border-border/50"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="tracking-widest">VM-INTERFACE v3.2</span>
          <AnimatedActiveSection section={activeSection} scrolled={scrolled} />
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline">
            STATUS: <span className="text-terminal-green">OPERATIONAL</span>
          </span>
          <span className="hidden md:inline">LOCATION: INDIA</span>
          <span className="hidden sm:inline">BUILD: React + Vite</span>
        </div>
      </div>
    </motion.header>
  );
};

const AnimatedActiveSection = ({ section, scrolled }: { section: string | null; scrolled: boolean }) => {
  if (!scrolled || !section) return null;

  return (
    <motion.span
      key={section}
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 0.6, x: 0 }}
      className="text-primary text-[10px] hidden md:inline"
    >
      · Active Module: {sectionLabels[section] || section}
    </motion.span>
  );
};

export default TopBar;
