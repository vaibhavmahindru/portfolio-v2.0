import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="space-y-2">
          <p className="font-mono text-xs text-primary uppercase tracking-widest">
            // Error
          </p>
          <h1 className="text-6xl font-bold font-mono text-foreground">404</h1>
        </div>

        <div className="glow-border rounded-md bg-card p-6 space-y-3 text-left font-mono text-sm">
          <p className="text-muted-foreground">
            &gt; Requesting route:{" "}
            <span className="text-status-deprecated">{location.pathname}</span>
          </p>
          <p className="text-muted-foreground">
            &gt; Status: <span className="text-status-deprecated">NOT FOUND</span>
          </p>
          <p className="text-muted-foreground">
            &gt; The requested module does not exist in this system.
          </p>
        </div>

        <a
          href="/"
          className="inline-block px-5 py-2.5 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
        >
          Return to Command Center
        </a>
      </motion.div>
    </div>
  );
};

export default NotFound;
