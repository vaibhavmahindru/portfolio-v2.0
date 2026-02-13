import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLines = [
  "Initializing runtime...",
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

  const handleSkip = useCallback(() => {
    setExiting(true);
    setTimeout(onComplete, 500);
  }, [onComplete]);

  useEffect(() => {
    const timers = bootLines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), 600 + i * 800)
    );
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 500);
    }, 600 + bootLines.length * 800 + 800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip Boot →
          </button>

          <div className="font-mono space-y-3 px-6">
            {bootLines.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
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
