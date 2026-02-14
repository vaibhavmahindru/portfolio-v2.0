import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 300 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    },
    [cursorX, cursorY, visible]
  );

  useEffect(() => {
    // Disable on touch devices
    if ("ontouchstart" in window) return;

    window.addEventListener("mousemove", handleMouseMove);
    
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest("[data-cursor-label]");
      if (card) {
        setHoverLabel(card.getAttribute("data-cursor-label"));
        setIsHovering(true);
      } else if (target.closest("a, button, [role='button']")) {
        setIsHovering(true);
        setHoverLabel(null);
      } else {
        setIsHovering(false);
        setHoverLabel(null);
      }
    };

    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [handleMouseMove]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[999] pointer-events-none mix-blend-difference"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full bg-foreground"
          animate={{ width: isHovering ? 6 : 4, height: isHovering ? 6 : 4 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[998] pointer-events-none"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full border border-foreground/30"
          animate={{
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
            opacity: isHovering ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.25 }}
        />
        {hoverLabel && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-mono text-[10px] text-foreground whitespace-nowrap"
          >
            {hoverLabel}
          </motion.span>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
