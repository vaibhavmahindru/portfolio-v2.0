import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const commands: Record<string, string> = {
  help: "Available commands: help, stack, deploy, status, clear",
  stack: "React 18 | TypeScript | Tailwind CSS | Framer Motion | Vite",
  deploy: "Deploying to edge... ✓ Deployed successfully.",
  status: "Runtime: Active | Uptime: 99.99% | Region: Edge (Global)",
};

const TerminalOverlay = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
        e.preventDefault();
        setOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (cmd === "clear") {
      setHistory([]);
    } else {
      const output = commands[cmd] || `Unknown command: "${cmd}". Type "help" for available commands.`;
      setHistory((prev) => [...prev, { cmd: input.trim(), output }]);
    }
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[91] w-full max-w-lg bg-card border border-border rounded-md p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest">
                Terminal v3.2
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                Press ~ to close
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 mb-3">
              {history.map((h, i) => (
                <div key={i} className="font-mono text-xs">
                  <span className="text-primary">&gt; </span>
                  <span className="text-foreground">{h.cmd}</span>
                  <p className="text-muted-foreground ml-3">{h.output}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="font-mono text-xs text-primary">&gt;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground/40"
                placeholder="Type a command..."
                autoFocus
              />
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TerminalOverlay;
