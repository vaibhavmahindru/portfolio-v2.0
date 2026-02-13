import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ContactModule = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organization: "",
    scope: "",
    timeline: "",
    budget: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const fieldClass =
    "w-full bg-secondary border border-border rounded-sm px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <section id="contact" className="px-6 py-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Contact
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            Initiate Connection
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glow-border rounded-md bg-card p-8 text-center space-y-3"
            >
              <div className="status-dot bg-terminal-green mx-auto" />
              <p className="font-mono text-sm text-terminal-green">
                Connection established.
              </p>
              <p className="text-sm text-muted-foreground">
                Expect a response within 24 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glow-border rounded-md bg-card p-6 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    Organization
                  </label>
                  <input
                    name="organization"
                    type="text"
                    maxLength={100}
                    value={form.organization}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Company / Team"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  Project Scope
                </label>
                <textarea
                  name="scope"
                  required
                  maxLength={1000}
                  rows={3}
                  value={form.scope}
                  onChange={handleChange}
                  className={fieldClass + " resize-none"}
                  placeholder="Describe the project..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    Estimated Timeline
                  </label>
                  <select
                    name="timeline"
                    value={form.timeline}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    <option value="">Select...</option>
                    <option value="1-2 weeks">1–2 weeks</option>
                    <option value="1 month">~1 month</option>
                    <option value="2-3 months">2–3 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    <option value="">Select...</option>
                    <option value="<5k">&lt; $5,000</option>
                    <option value="5-15k">$5,000 – $15,000</option>
                    <option value="15-50k">$15,000 – $50,000</option>
                    <option value="50k+">$50,000+</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-5 py-3 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors mt-2"
              >
                Establish Secure Channel
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ContactModule;
