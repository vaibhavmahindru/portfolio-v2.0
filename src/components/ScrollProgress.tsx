import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-primary origin-left"
      style={{ scaleX: progress / 100, transformOrigin: "left" }}
      transition={{ duration: 0.1 }}
    />
  );
};

export default ScrollProgress;
