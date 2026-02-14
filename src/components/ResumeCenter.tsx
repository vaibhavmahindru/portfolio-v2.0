import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink, Linkedin } from "lucide-react";

const metrics = [
  { label: "Experience", value: "5+ Years" },
  { label: "Primary Stack", value: "Backend + AWS" },
  { label: "Projects Delivered", value: "12+" },
  { label: "Certifications", value: "AWS (Soon)" },
];

const ResumeCenter = () => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
    // Direct download — replace # with actual PDF URL
    const link = document.createElement("a");
    link.href = "#";
    link.download = "Alex_Chen_Resume.pdf";
    link.click();
  };

  return (
    <section id="resume" className="px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Resume
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            Credential Package
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left — Summary + Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Resume preview thumbnail */}
            <div className="glow-border rounded-md bg-card p-4 aspect-[8.5/11] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] grid-overlay" />
              <div className="text-center space-y-2 relative z-10">
                <p className="font-mono text-xs text-muted-foreground">RESUME PREVIEW</p>
                <div className="w-32 mx-auto space-y-1.5">
                  <div className="h-1.5 bg-foreground/10 rounded-full w-full" />
                  <div className="h-1 bg-foreground/5 rounded-full w-3/4" />
                  <div className="h-1 bg-foreground/5 rounded-full w-full" />
                  <div className="h-1 bg-foreground/5 rounded-full w-5/6" />
                  <div className="h-4" />
                  <div className="h-1 bg-foreground/5 rounded-full w-full" />
                  <div className="h-1 bg-foreground/5 rounded-full w-2/3" />
                  <div className="h-1 bg-foreground/5 rounded-full w-full" />
                  <div className="h-1 bg-foreground/5 rounded-full w-4/5" />
                </div>
              </div>
            </div>

            <p className="text-secondary-foreground leading-relaxed text-sm">
              Systems engineer with 5+ years building backend services, cloud infrastructure,
              and automation pipelines. Focused on scalable architecture, reliability, and
              clean engineering practices.
            </p>
          </motion.div>

          {/* Right — Actions + Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-3 justify-center"
          >
            <button
              onClick={handleDownload}
              className="relative px-5 py-3 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors text-center flex items-center justify-center gap-2 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {downloaded ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2"
                  >
                    ✓ Downloaded
                  </motion.span>
                ) : (
                  <motion.span
                    key="download"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <a
              href="#"
              className="px-5 py-3 text-xs font-mono border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary transition-colors text-center flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Online Version
            </a>
            <a
              href="#"
              className="px-5 py-3 text-xs font-mono border border-border text-muted-foreground rounded-sm hover:border-muted-foreground transition-colors text-center flex items-center justify-center gap-2"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
            </a>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {metrics.map((m) => (
                <div key={m.label} className="glow-border rounded-md bg-card p-3">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p className="font-mono text-sm text-foreground mt-1">{m.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResumeCenter;
