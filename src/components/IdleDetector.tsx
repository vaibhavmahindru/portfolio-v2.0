import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IdleDetector = () => {
  const [idle, setIdle] = useState(false);

  const resetIdle = useCallback(() => {
    setIdle(false);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), 15000);
    };

    const handleActivity = () => {
      resetIdle();
      startTimer();
    };

    window.addEventListener("mousemove", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity, { passive: true });
    startTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [resetIdle]);

  return (
    <>
      {/* Dim overlay when idle */}
      <AnimatePresence>
        {idle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-30 pointer-events-none bg-background/30"
          />
        )}
      </AnimatePresence>

      {/* Idle text */}
      <AnimatePresence>
        {idle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none font-mono text-[10px] text-muted-foreground"
          >
            System Idle
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IdleDetector;
