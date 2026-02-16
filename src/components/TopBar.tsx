import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/config/profile";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const sectionIds = ["about", "capabilities", "deployments", "stack", /* "logs", */ "resume", "contact"];
const sectionLabels: Record<string, string> = {
  about: "Career Timeline",
  capabilities: "Capabilities",
  deployments: "Deployments",
  stack: "Stack",
  // logs: "Field Reports", // TODO: Uncomment when blog posts are ready
  resume: "Credentials",
  contact: "Contact",
};

const TopBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoText, setLogoText] = useState(`VM-INTERFACE v${profile.version}`);
  const logoClickCount = useRef(0);
  const logoResetTimer = useRef<ReturnType<typeof setTimeout>>();

  // Logo click easter egg: 5 clicks triggers scramble
  const handleLogoClick = useCallback(() => {
    logoClickCount.current++;
    clearTimeout(logoResetTimer.current);
    logoResetTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 2000);

    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      const original = `VM-INTERFACE v${profile.version}`;
      let frame = 0;
      const interval = setInterval(() => {
        const output = original
          .split("")
          .map((char, i) => {
            if (char === " " || char === ".") return char;
            if (i < frame - 3) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("");
        setLogoText(output);
        frame++;
        if (frame > original.length + 8) {
          setLogoText(original);
          clearInterval(interval);
        }
      }, 30);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

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

  // Close mobile menu on scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [mobileMenuOpen]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 backdrop-blur-sm transition-all duration-300 ${
        scrolled
          ? "bg-background/80 border-b border-primary/20"
          : "bg-background/60 border-b border-border/50"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
            <button
              onClick={handleLogoClick}
              className="tracking-widest hover:text-primary transition-colors"
              aria-label="Scroll to top"
            >
              {logoText}
            </button>
          <AnimatedActiveSection section={activeSection} scrolled={scrolled} />
        </div>

          {/* Desktop navigation — visible when scrolled */}
          <nav
            className="hidden lg:flex items-center gap-4"
            role="navigation"
            aria-label="Main navigation"
          >
            {scrolled &&
              sectionIds.slice(0, 5).map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`uppercase tracking-wider transition-colors ${
                    activeSection === id ? "text-primary" : "hover:text-foreground"
                  }`}
                  aria-label={`Navigate to ${sectionLabels[id]}`}
                >
                  {sectionLabels[id]}
                </button>
              ))}
          </nav>

          <div className="flex items-center gap-3">
          <span className="hidden sm:inline">
            STATUS: <span className="text-terminal-green">OPERATIONAL</span>
          </span>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="lg:hidden p-1.5 border border-border rounded-sm hover:border-primary/50 hover:text-primary transition-all"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[52px] left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border lg:hidden"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="max-w-6xl mx-auto py-3 px-4 grid grid-cols-2 gap-1">
                {sectionIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`text-left px-3 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider transition-colors ${
                      activeSection === id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-card"
                    }`}
                  >
                    {sectionLabels[id]}
                  </button>
                ))}
      </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
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
      · {sectionLabels[section] || section}
    </motion.span>
  );
};

export default TopBar;
