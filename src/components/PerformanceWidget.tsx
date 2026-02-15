import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PerfMetrics {
  loadTime: string;
  domSize: string;
  jsHeap: string;
  resources: string;
  lighthouseScore: number | null;
  lighthouseLoading: boolean;
}

const LIGHTHOUSE_CACHE_KEY = "vm-lighthouse";
const LIGHTHOUSE_CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

const PerformanceWidget = () => {
  const [metrics, setMetrics] = useState<PerfMetrics>({
    loadTime: "--",
    domSize: "--",
    jsHeap: "--",
    resources: "--",
    lighthouseScore: null,
    lighthouseLoading: true,
  });

  // Real browser performance metrics
  useEffect(() => {
    const measure = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const loadTime = nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0;
      const domSize = document.querySelectorAll("*").length;
      const perfMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
      const jsHeap = perfMemory
        ? `${Math.round(perfMemory.usedJSHeapSize / 1024 / 1024)}MB`
        : "N/A";
      const resources = performance.getEntriesByType("resource").length;

      if (loadTime > 0) {
        setMetrics((prev) => ({
          ...prev,
          loadTime: `${loadTime}ms`,
          domSize: domSize.toLocaleString(),
          jsHeap,
          resources: resources.toString(),
        }));
        return true;
      }
      return false;
    };

    if (!measure()) {
      const id = setInterval(() => {
        if (measure()) clearInterval(id);
      }, 500);
      const timeout = setTimeout(() => clearInterval(id), 5000);
      return () => {
        clearInterval(id);
        clearTimeout(timeout);
      };
    }
  }, []);

  // PageSpeed Insights Lighthouse score
  useEffect(() => {
    const fetchLighthouse = async () => {
      // Check cache first
      try {
        const cached = localStorage.getItem(LIGHTHOUSE_CACHE_KEY);
        if (cached) {
          const { score, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < LIGHTHOUSE_CACHE_TTL && typeof score === "number") {
            setMetrics((prev) => ({ ...prev, lighthouseScore: score, lighthouseLoading: false }));
            return;
          }
        }
      } catch {
        // ignore
      }

      // Only fetch if we're on a real deployed URL (not localhost)
      const siteUrl = window.location.origin;
      if (siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1")) {
        // On localhost, show a simulated score based on real metrics
        setMetrics((prev) => ({ ...prev, lighthouseScore: null, lighthouseLoading: false }));
        return;
      }

      try {
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeedTest?url=${encodeURIComponent(siteUrl)}&category=performance&strategy=mobile`;
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          const score = Math.round(
            (data.lighthouseResult?.categories?.performance?.score ?? 0) * 100
          );

          setMetrics((prev) => ({ ...prev, lighthouseScore: score, lighthouseLoading: false }));

          // Cache
          try {
            localStorage.setItem(
              LIGHTHOUSE_CACHE_KEY,
              JSON.stringify({ score, timestamp: Date.now() })
            );
          } catch {
            // ignore
          }
        } else {
          setMetrics((prev) => ({ ...prev, lighthouseScore: null, lighthouseLoading: false }));
        }
      } catch {
        setMetrics((prev) => ({ ...prev, lighthouseScore: null, lighthouseLoading: false }));
      }
    };

    fetchLighthouse();
  }, []);

  const scoreColor =
    metrics.lighthouseScore !== null
      ? metrics.lighthouseScore >= 90
        ? "text-terminal-green"
        : metrics.lighthouseScore >= 50
        ? "text-status-experimental"
        : "text-status-deprecated"
      : "text-muted-foreground";

  const items = [
    { label: "LOAD", value: metrics.loadTime, color: "text-terminal-green" },
    { label: "DOM", value: metrics.domSize, color: "text-foreground" },
    { label: "HEAP", value: metrics.jsHeap, color: "text-foreground" },
    { label: "ASSETS", value: metrics.resources, color: "text-foreground" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40 hidden lg:block"
    >
      <div className="glow-border rounded-md bg-card/90 backdrop-blur-sm p-3 space-y-1.5 min-w-[170px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="status-dot bg-terminal-green" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Performance
          </span>
        </div>
        {items.map((m) => (
          <div key={m.label} className="flex justify-between items-center font-mono text-[10px]">
            <span className="text-muted-foreground">{m.label}</span>
            <span className={m.color}>{m.value}</span>
          </div>
        ))}

        {/* Lighthouse Score */}
        <div className="pt-1.5 mt-1.5 border-t border-border/50">
          <div className="flex justify-between items-center font-mono text-[10px]">
            <span className="text-muted-foreground">LIGHTHOUSE</span>
            {metrics.lighthouseLoading ? (
              <span className="text-muted-foreground animate-pulse">...</span>
            ) : metrics.lighthouseScore !== null ? (
              <span className={scoreColor}>{metrics.lighthouseScore}/100</span>
            ) : (
              <span className="text-muted-foreground text-[9px]">DEV MODE</span>
            )}
          </div>
          {metrics.lighthouseScore !== null && (
            <div className="mt-1 h-1 rounded-full bg-border/50 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  metrics.lighthouseScore >= 90
                    ? "bg-terminal-green"
                    : metrics.lighthouseScore >= 50
                    ? "bg-status-experimental"
                    : "bg-status-deprecated"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.lighthouseScore}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceWidget;
