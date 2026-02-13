import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SystemFooter = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  return (
    <>
      <footer className="px-6 py-12 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>VM-INTERFACE © 2026</span>
            <span className="hidden sm:inline">·</span>
            <span>Built with React + Tailwind</span>
            <span className="hidden sm:inline">·</span>
            <span>Version: 3.2</span>
          </div>
          <button
            onClick={() => setShowDiagnostics(true)}
            className="hover:text-primary transition-colors"
          >
            Diagnostics
          </button>
        </div>
      </footer>

      {/* Diagnostics Modal */}
      <AnimatePresence>
        {showDiagnostics && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowDiagnostics(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-card border border-border rounded-md p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm text-foreground">System Diagnostics</h3>
                <button
                  onClick={() => setShowDiagnostics(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {[
                { label: "Framework", value: "React 18 + Vite" },
                { label: "Styling", value: "Tailwind CSS" },
                { label: "Animations", value: "Framer Motion" },
                { label: "Performance", value: "Lighthouse 90+" },
                { label: "Region", value: "Edge (Global)" },
                { label: "Version", value: "3.2.0" },
              ].map((d) => (
                <div
                  key={d.label}
                  className="flex justify-between font-mono text-xs"
                >
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="text-foreground">{d.value}</span>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SystemFooter;
