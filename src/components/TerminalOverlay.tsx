import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/config/profile";
import { projects } from "@/config/projects";

/* ─── Section map for goto ─── */
const sectionMap: Record<string, string> = {
  about: "about",
  experience: "about",
  capabilities: "capabilities",
  deployments: "deployments",
  projects: "deployments",
  stack: "stack",
  logs: "logs",
  blog: "logs",
  resume: "resume",
  social: "social",
  contact: "contact",
  github: "github",
  top: "__top__",
};

/* ─── All available commands for tab autocomplete ─── */
const ALL_COMMANDS = [
  "help",
  "about",
  "whoami",
  "stack",
  "status",
  "goto",
  "clear",
  "exit",
  "ls",
  "cat",
  "ping",
  "uptime",
  "history",
  "matrix",
  "sudo",
  "view-source",
];

/* ─── Page start timestamp ─── */
const PAGE_START = Date.now();

/* ─── Visited sections tracker ─── */
const visitedSections: string[] = [];
const trackSection = (id: string) => {
  if (!visitedSections.includes(id)) visitedSections.push(id);
};

// Observe sections being scrolled into view
if (typeof window !== "undefined") {
  const observeSections = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            trackSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3 }
    );
    const sectionIds = [
      "about",
      "capabilities",
      "deployments",
      "stack",
      "logs",
      "resume",
      "social",
      "contact",
      "github",
    ];
    // Defer to avoid running before DOM is ready
    setTimeout(() => {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    }, 3000);
  };
  if (document.readyState === "complete") {
    observeSections();
  } else {
    window.addEventListener("load", observeSections, { once: true });
  }
}

/* ─── Color helpers for HTML output ─── */
const c = {
  green: (t: string) => `<span class="text-terminal-green">${t}</span>`,
  primary: (t: string) => `<span class="text-primary">${t}</span>`,
  yellow: (t: string) => `<span class="text-status-experimental">${t}</span>`,
  red: (t: string) => `<span class="text-destructive">${t}</span>`,
  muted: (t: string) => `<span class="text-muted-foreground">${t}</span>`,
  bold: (t: string) => `<span class="font-bold text-foreground">${t}</span>`,
};

/* ─── Matrix Rain Effect ─── */
const MatrixRain = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0fa";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100]"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
};

/* ─── Terminal Overlay ─── */
const TerminalOverlay = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<
    { cmd: string; output: string; isHtml?: boolean }[]
  >([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState(-1);
  const [showMatrix, setShowMatrix] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const theme = "dark";

  // Toggle on ~ key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT"
        )
          return;
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const addOutput = useCallback(
    (cmd: string, output: string, isHtml = false) => {
      setHistory((prev) => [...prev, { cmd, output, isHtml }]);
      setCmdHistory((prev) => [...prev, cmd]);
      setCmdHistoryIdx(-1);
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;
    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    setInput("");

    switch (cmd) {
      case "help":
        addOutput(
          raw,
          [
            `${c.bold("Available commands:")}`,
            `  ${c.primary("help")}             Show this help menu`,
            `  ${c.primary("about / whoami")}    Display bio & system info`,
            `  ${c.primary("stack")}             Show technology stack`,
            `  ${c.primary("status")}            Show runtime status`,
            `  ${c.primary("goto")} ${c.muted("<section>")}   Navigate to a section`,
            `  ${c.primary("view-source")}       View annotated source code`,
            `  ${c.primary("ls projects")}       List deployed projects`,
            `  ${c.primary("cat resume")}        Display condensed resume`,
            `  ${c.primary("ping")}              Network connectivity check`,
            `  ${c.primary("uptime")}            Time spent on this page`,
            `  ${c.primary("history")}           Sections visited`,
            `  ${c.primary("matrix")}            ${c.muted("You know what this does")}`,
            `  ${c.primary("exit / quit")}        Close the terminal`,
            `  ${c.primary("clear")}             Clear terminal history`,
            ``,
            `${c.muted("Tip: Use Tab for autocomplete, ↑/↓ for command history")}`,
          ].join("\n"),
          true
        );
        break;

      case "about":
      case "whoami":
        addOutput(
          raw,
          [
            `${c.bold(profile.name)} — ${c.primary(profile.title)}`,
            `${c.muted("Location:")} ${profile.location}`,
            `${c.muted("Status:")} ${c.green(profile.status)}`,
            ``,
            profile.bio,
            ``,
            `${c.muted("GitHub:")} ${c.primary(profile.links.github)}`,
          ].join("\n"),
          true
        );
        break;

      case "stack":
        addOutput(
          raw,
          [
            `${c.bold("Technology Stack")}`,
            ...Object.entries(profile.terminalStack).map(
              ([category, tools]) =>
                `${c.primary(`${category}:`)}${" ".repeat(Math.max(1, 12 - category.length))}${tools}`
            ),
          ].join("\n"),
          true
        );
        break;

      case "status":
        addOutput(
          raw,
          [
            `${c.muted("Runtime:")}    ${c.green("Active")}`,
            `${c.muted("Uptime:")}     ${profile.systemJson.uptime}`,
            `${c.muted("Primary:")}    ${profile.systemJson.primary_function}`,
            `${c.muted("Cloud:")}      ${profile.systemJson.cloud_integration}`,
            `${c.muted("Theme:")}      ${theme}`,
            `${c.muted("Session:")}    ${formatUptime(Date.now() - PAGE_START)}`,
          ].join("\n"),
          true
        );
        break;

      case "goto": {
        const target = sectionMap[arg];
        if (!target) {
          addOutput(
            raw,
            `${c.red("Unknown section:")} "${arg}"\n${c.muted("Available:")} ${Object.keys(sectionMap).join(", ")}`,
            true
          );
        } else if (target === "__top__") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          addOutput(raw, `${c.green("Navigating to top...")}`, true);
          setOpen(false);
        } else {
          const el = document.getElementById(target);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            addOutput(raw, `${c.green(`Navigating to ${arg}...`)}`, true);
            setOpen(false);
          } else {
            addOutput(
              raw,
              `${c.red(`Section "${arg}" not found in DOM.`)}`,
              true
            );
          }
        }
        break;
      }

      case "view-source":
        addOutput(
          raw,
          `${c.green("Opening annotated source view...")}`,
          true
        );
        setTimeout(() => {
          setOpen(false);
          // Fire custom event to open the view source overlay
          window.dispatchEvent(new Event("open-view-source"));
        }, 400);
        break;

      case "clear":
        setHistory([]);
        break;

      case "exit":
      case "quit":
      case "q":
        addOutput(raw, c.green("Closing terminal... goodbye."), true);
        setTimeout(() => setOpen(false), 400);
        break;

      case "ls":
        if (arg === "projects" || arg === "") {
          const lines = projects.map(
            (p) =>
              `  ${c.primary(p.slug.padEnd(22))} ${
                p.status === "PRODUCTION"
                  ? c.green(p.status)
                  : p.status === "ACTIVE"
                  ? c.primary(p.status)
                  : c.yellow(p.status)
              }  ${c.muted(p.tagline.slice(0, 50))}`
          );
          addOutput(
            raw,
            [`${c.bold("Deployed Projects")}`, ...lines].join("\n"),
            true
          );
        } else {
          addOutput(
            raw,
            `${c.red(`ls: cannot access '${arg}': No such directory`)}`,
            true
          );
        }
        break;

      case "cat":
        if (arg === "resume") {
          addOutput(
            raw,
            [
              `${c.bold("═══ RESUME ═══")}`,
              ``,
              `${c.primary(profile.name)}`,
              `${profile.title} | ${profile.location}`,
              `${c.muted(profile.contact.email)}`,
              ``,
              `${c.bold("SUMMARY")}`,
              profile.resumeBio,
              ``,
              `${c.bold("EXPERIENCE")}`,
              ...profile.experience.map(
                (e) =>
                  `  ${c.primary(`v${e.version}`)} ${e.title}${e.subtitle ? ` ${c.muted("@")} ${c.green(e.subtitle)}` : ""} ${c.muted(`(${e.period})`)}`
              ),
              ``,
              `${c.bold("STACK")}`,
              ...Object.entries(profile.terminalStack).map(
                ([category, tools]) =>
                  `  ${c.primary(`${category}:`)}${" ".repeat(Math.max(1, 12 - category.length))}${tools}`
              ),
              ``,
              `${c.bold("LINKS")}`,
              `  ${c.muted("GitHub:")}   ${c.primary(profile.links.github)}`,
              `  ${c.muted("Email:")}    ${c.primary(profile.contact.email)}`,
              ``,
              `${c.muted("Run 'goto resume' to view the full credentials package.")}`,
            ].join("\n"),
            true
          );
        } else {
          addOutput(
            raw,
            `${c.red(`cat: ${arg || "(no file)"}: No such file`)}`,
            true
          );
        }
        break;

      case "ping": {
        const latencies = [12, 8, 15, 11, 9];
        const lines = latencies.map(
          (l, i) =>
            `${c.muted(`seq=${i + 1}`)} ${c.green(`time=${l}ms`)} ${c.muted("TTL=64")}`
        );
        const avg = Math.round(
          latencies.reduce((a, b) => a + b) / latencies.length
        );
        addOutput(
          raw,
          [
            `${c.bold("PING")} portfolio.vaibhav.dev (127.0.0.1):`,
            ...lines,
            ``,
            `--- ${c.primary("ping statistics")} ---`,
            `${c.muted(`${latencies.length} transmitted, ${latencies.length} received, 0% loss`)}`,
            `${c.green(`avg: ${avg}ms`)}`,
          ].join("\n"),
          true
        );
        break;
      }

      case "uptime": {
        const elapsed = Date.now() - PAGE_START;
        addOutput(
          raw,
          [
            `${c.muted("Session Duration:")} ${c.green(formatUptime(elapsed))}`,
            `${c.muted("Sections Visited:")} ${c.primary(String(visitedSections.length))}`,
            `${c.muted("Commands Entered:")} ${c.primary(String(cmdHistory.length + 1))}`,
          ].join("\n"),
          true
        );
        break;
      }

      case "history":
        if (visitedSections.length === 0) {
          addOutput(
            raw,
            c.muted("No sections visited yet. Start scrolling!"),
            true
          );
        } else {
          const lines = visitedSections.map(
            (s, i) => `  ${c.muted(String(i + 1).padStart(2, " "))}. ${c.primary(s)}`
          );
          addOutput(
            raw,
            [`${c.bold("Browsing History (sections visited)")}`, ...lines].join(
              "\n"
            ),
            true
          );
        }
        break;

      case "matrix":
        addOutput(raw, c.green("Entering the Matrix..."), true);
        setShowMatrix(true);
        break;

      case "sudo":
        if (arg.startsWith("hire")) {
          addOutput(
            raw,
            [
              `${c.green("✓ Access granted.")}`,
              `${c.primary("Preparing contract...")}`,
              `${c.primary("Configuring compensation package...")}`,
              `${c.primary("Allocating dedicated workspace...")}`,
              ``,
              `${c.bold("Just kidding — but I appreciate the enthusiasm!")}`,
              `${c.muted("Run 'goto contact' to get in touch.")}`,
            ].join("\n"),
            true
          );
        } else {
          addOutput(
            raw,
            `${c.red("[sudo] password for visitor: ")}${c.muted("Nice try.")}`,
            true
          );
        }
        break;

      default:
        addOutput(
          raw,
          `${c.red(`Command not found: "${raw}"`)}. Type ${c.primary('"help"')} for available commands.`,
          true
        );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx =
        cmdHistoryIdx === -1
          ? cmdHistory.length - 1
          : Math.max(0, cmdHistoryIdx - 1);
      setCmdHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistoryIdx === -1) return;
      const nextIdx = cmdHistoryIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setCmdHistoryIdx(-1);
        setInput("");
      } else {
        setCmdHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = input.trim().toLowerCase();
      if (!current) return;

      const matches = ALL_COMMANDS.filter((c) => c.startsWith(current));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      } else if (matches.length > 1) {
        addOutput(
          current,
          matches.map((m) => `  ${m}`).join("\n")
        );
      }
    }
  };

  return (
    <>
      {/* Matrix rain overlay */}
      <AnimatePresence>
        {showMatrix && (
          <MatrixRain onComplete={() => setShowMatrix(false)} />
        )}
      </AnimatePresence>

      {/* Terminal overlay */}
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
              className="fixed inset-4 sm:inset-auto sm:top-12 sm:left-1/2 sm:-translate-x-1/2 z-[91] w-auto sm:w-full sm:max-w-lg bg-card border border-border rounded-md p-4 shadow-xl flex flex-col"
              role="dialog"
              aria-label="Terminal overlay"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-status-experimental/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-terminal-green/60" />
                  </div>
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest ml-2">
                    Terminal v3.2
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  Press ~ to close
                </span>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 max-h-72 sm:max-h-72 overflow-y-auto space-y-1.5 mb-3"
              >
                {/* Welcome message */}
                {history.length === 0 && (
                  <div className="font-mono text-xs text-muted-foreground">
                    <p>
                      Welcome to{" "}
                      <span className="text-primary">VM Terminal</span>. Type{" "}
                      <span className="text-primary">"help"</span> to see
                      available commands.
                    </p>
                  </div>
                )}
                  {history.map((h, i) => (
                  <div key={i} className="font-mono text-sm sm:text-xs">
                    <div>
                      <span className="text-primary">$ </span>
                      <span className="text-foreground">{h.cmd}</span>
                    </div>
                    {h.isHtml ? (
                      <pre
                        className="text-muted-foreground ml-2 whitespace-pre-wrap mt-0.5"
                        dangerouslySetInnerHTML={{ __html: h.output }}
                      />
                    ) : (
                      <pre className="text-muted-foreground ml-2 whitespace-pre-wrap mt-0.5">
                        {h.output}
                      </pre>
                    )}
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 border-t border-border/50 pt-2"
              >
                <span className="font-mono text-sm sm:text-xs text-primary">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent font-mono text-sm sm:text-xs text-foreground outline-none placeholder:text-muted-foreground/40 py-1 sm:py-0"
                  placeholder="Type a command..."
                  autoFocus
                  aria-label="Terminal command input"
                />
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Terminal Hint Badge ─── */
export const TerminalHintBadge = () => {
  const [showLabel, setShowLabel] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("vm-terminal-hint");
    if (seen) setHasSeen(true);
    else {
      const t = setTimeout(() => {
        sessionStorage.setItem("vm-terminal-hint", "1");
        setHasSeen(true);
      }, 8000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClick = () => {
    // Simulate pressing ~ to open terminal
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "~", bubbles: true })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.4 }}
      className="fixed bottom-6 right-6 sm:right-[200px] z-40"
    >
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        className="relative w-8 h-8 rounded-md bg-card/90 backdrop-blur-sm border border-border hover:border-primary/50 flex items-center justify-center transition-colors"
        aria-label="Open terminal"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="font-mono text-xs text-muted-foreground">~</span>

        {/* Pulse animation for first-time visitors */}
        {!hasSeen && (
          <motion.div
            className="absolute inset-0 rounded-md border border-primary/40"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <span className="font-mono text-[10px] text-muted-foreground bg-card/90 border border-border rounded px-2 py-1">
              Terminal (~)
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Helpers ─── */
function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export default TerminalOverlay;
