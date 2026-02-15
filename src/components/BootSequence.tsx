import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_KEY = "vm-boot-seen";

const bootLines = [
  "Initializing environment...",
  "Validating secure modules...",
  "Connecting to cloud infrastructure...",
  "System status: STABLE",
];

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Skip boot on repeat visits
  const alreadySeen = typeof window !== "undefined" && sessionStorage.getItem(BOOT_KEY);

  const handleSkip = useCallback(() => {
    setExiting(true);
    sessionStorage.setItem(BOOT_KEY, "1");
    setTimeout(onComplete, 400);
  }, [onComplete]);

  useEffect(() => {
    if (alreadySeen) {
      onComplete();
      return;
    }

    // Shortened timings: 300ms base + 400ms per line + 500ms hold = ~2.3s total
    const timers = bootLines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), 300 + i * 400)
    );
    const exitTimer = setTimeout(() => {
      setExiting(true);
      sessionStorage.setItem(BOOT_KEY, "1");
      setTimeout(onComplete, 400);
    }, 300 + bootLines.length * 400 + 500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
    };
  }, [onComplete, alreadySeen]);

  if (alreadySeen) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip Boot
          </button>

          <div className="font-mono space-y-3 px-6">
            {bootLines.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-sm ${
                  i === bootLines.length - 1
                    ? "text-terminal-green"
                    : i === visibleLines - 1 && visibleLines < bootLines.length
                    ? "text-primary cursor-blink"
                    : "text-muted-foreground"
                }`}
              >
                &gt; {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSequence;
