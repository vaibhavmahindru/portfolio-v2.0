import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink, Linkedin } from "lucide-react";
import { profile } from "@/config/profile";

/* Resume metrics come from profile.ts — edit there to update */
const metrics = profile.resumeMetrics as unknown as { label: string; value: string }[];

const ResumeCenter = () => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (profile.links.resume === "#") {
      alert("Resume PDF coming soon. Connect via the contact form below.");
      return;
    }
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
    const link = document.createElement("a");
    link.href = profile.links.resume;
    link.download = `${profile.name.replace(/\s+/g, "_")}_Resume.pdf`;
    link.click();
  };

  return (
    <section id="resume" className="px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-6">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          className="glow-border rounded-md bg-card p-6"
        >
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            {/* Left — identity + bio */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                </div>
              <div className="min-w-0">
                <p className="font-mono text-sm text-foreground font-medium">{profile.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{profile.title}</p>
                <p className="text-xs text-secondary-foreground mt-1 line-clamp-2">{profile.resumeBio}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-16 bg-border" />

            {/* Right — metrics + actions */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                    <p className="font-mono text-xs text-foreground font-medium mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
            <button
              onClick={handleDownload}
                  className="flex-1 px-3 py-2 text-[11px] font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {downloaded ? (
                  <motion.span
                    key="done"
                        initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                  >
                        Downloaded
                  </motion.span>
                ) : (
                  <motion.span
                        key="dl"
                        initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-1.5"
                  >
                        <Download className="w-3 h-3" /> Download PDF
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <a
                  href={profile.links.resumeOnline}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-[11px] font-mono border border-border text-foreground rounded-sm hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-1.5"
            >
                  <ExternalLink className="w-3 h-3" /> Online
            </a>
            <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-[11px] font-mono border border-border text-muted-foreground rounded-sm hover:border-muted-foreground transition-colors flex items-center gap-1.5"
            >
                  <Linkedin className="w-3 h-3" /> LinkedIn
            </a>
                </div>
            </div>
            </div>
          </motion.div>
      </div>
    </section>
  );
};

export default ResumeCenter;
