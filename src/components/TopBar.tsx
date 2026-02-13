import { motion } from "framer-motion";

const TopBar = () => {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-3 backdrop-blur-sm bg-background/60 border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span className="tracking-widest">VM-INTERFACE v3.2</span>
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

export default TopBar;
