import { motion } from "framer-motion";

const GridBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Grid */}
      <div className="absolute inset-0 grid-overlay opacity-40" />
      
      {/* Scanline */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="scanline absolute inset-0 h-[200px]" />
      </div>

      {/* Radial fade at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, hsl(var(--background)) 70%)",
        }}
      />

      {/* Subtle corner vignette */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(var(--glow) / 0.15), transparent 70%)",
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default GridBackground;
