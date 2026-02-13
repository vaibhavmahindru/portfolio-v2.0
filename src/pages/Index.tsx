import GridBackground from "@/components/GridBackground";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import StatusWidget from "@/components/StatusWidget";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="dark relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <GridBackground />
      <ScrollProgress />
      <StatusWidget />

      <main className="relative z-10">
        <HeroSection />
        <ProjectsSection />

        {/* Footer */}
        <footer className="px-6 py-16 border-t border-border">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              © 2026 · Built with precision
            </span>
            <div className="flex gap-6">
              {["GitHub", "LinkedIn", "Email"].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                  whileHover={{ y: -1 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
