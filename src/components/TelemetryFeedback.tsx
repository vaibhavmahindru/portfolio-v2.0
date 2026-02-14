import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TelemetryEvent {
  id: number;
  text: string;
}

let eventId = 0;

const TelemetryFeedback = () => {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);

  const addEvent = useCallback((text: string) => {
    const id = ++eventId;
    setEvents((prev) => [...prev.slice(-2), { id, text }]);
    setTimeout(() => {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }, 1500);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Card expansion
      if (target.closest("[data-cursor-label]")) {
        const label = target.closest("[data-cursor-label]")?.getAttribute("data-cursor-label");
        if (label) addEvent(`Event: ${label} Inspected`);
        return;
      }
      // Buttons
      if (target.closest("button")) {
        const btn = target.closest("button") as HTMLButtonElement;
        const text = btn.textContent?.trim().slice(0, 30);
        if (text) addEvent(`Event: ${text}`);
        return;
      }
      // Links
      if (target.closest("a")) {
        addEvent("Event: Link Activated");
      }
    };

    window.addEventListener("click", handler, true);
    return () => window.removeEventListener("click", handler, true);
  }, [addEvent]);

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none hidden lg:block">
      <AnimatePresence>
        {events.map((ev) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-[10px] text-muted-foreground mb-1"
          >
            &gt; {ev.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TelemetryFeedback;
