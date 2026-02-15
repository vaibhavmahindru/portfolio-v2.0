import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/config/profile";

interface FormErrors {
  name?: string;
  email?: string;
  scope?: string;
}

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const ContactModule = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    scope: "",
    timeline: "",
    budget: "",
    // Honeypot field — bots fill this in, humans don't
    _gotcha: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";

    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!validateEmail(form.email)) errs.email = "Enter a valid email address.";

    if (!form.scope.trim()) errs.scope = "Project scope is required.";
    else if (form.scope.trim().length < 10) errs.scope = "Please provide at least 10 characters.";

    return errs;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check — if filled, silently "succeed"
    if (form._gotcha) {
      setSubmitted(true);
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _gotcha, ...payload } = form;
      const res = await fetch(profile.contact.formAction, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
    setSubmitted(true);
      } else {
        window.location.href = `mailto:contact@vaibhavmahindru.com?subject=Project Inquiry from ${form.name}&body=${encodeURIComponent(form.scope)}`;
      }
    } catch {
      window.location.href = `mailto:contact@vaibhavmahindru.com?subject=Project Inquiry from ${form.name}&body=${encodeURIComponent(form.scope)}`;
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full bg-secondary border rounded-sm px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors";

  const errorClass = "border-destructive focus:border-destructive focus:ring-destructive/20";

  return (
    <section id="contact" className="px-4 sm:px-6 py-12 md:py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2" data-gsap="clip-up" data-gsap-duration="1">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            // Contact
          </span>
          <h2 className="text-3xl font-bold text-foreground">Initiate Connection</h2>
        </div>
        <div className="gsap-divider h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glow-border rounded-md bg-card p-8 text-center space-y-3"
            >
              <div className="status-dot bg-terminal-green mx-auto" />
              <p className="font-mono text-sm text-terminal-green">Connection established.</p>
              <p className="text-sm text-muted-foreground">Expect a response within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="glow-border rounded-md bg-card p-6 space-y-4"
              noValidate
            >
              {/* Honeypot — hidden from humans, bots fill it */}
              <input
                type="text"
                name="_gotcha"
                value={form._gotcha}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={handleChange}
                    className={`${fieldClass} ${errors.name ? errorClass : "border-border"}`}
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="font-mono text-[10px] text-destructive" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={100}
                    value={form.email}
                    onChange={handleChange}
                    className={`${fieldClass} ${errors.email ? errorClass : "border-border"}`}
                    placeholder="you@company.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="font-mono text-[10px] text-destructive" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-1.5">
                <label htmlFor="organization" className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                  Organization
                </label>
                <input
                  id="organization"
                    name="organization"
                    type="text"
                    maxLength={100}
                    value={form.organization}
                    onChange={handleChange}
                  className={`${fieldClass} border-border`}
                    placeholder="Company / Team"
                  />
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-1.5">
                <label htmlFor="scope" className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                  Project Scope *
                </label>
                <textarea
                  id="scope"
                  name="scope"
                  required
                  maxLength={1000}
                  rows={3}
                  value={form.scope}
                  onChange={handleChange}
                  className={`${fieldClass} ${errors.scope ? errorClass : "border-border"} resize-none`}
                  placeholder="Describe the project..."
                  aria-invalid={!!errors.scope}
                  aria-describedby={errors.scope ? "scope-error" : undefined}
                />
                {errors.scope && (
                  <p id="scope-error" className="font-mono text-[10px] text-destructive" role="alert">
                    {errors.scope}
                  </p>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="timeline" className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                    Estimated Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={form.timeline}
                    onChange={handleChange}
                    className={`${fieldClass} border-border`}
                  >
                    <option value="">Select...</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="1 month">~1 month</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="budget" className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={`${fieldClass} border-border`}
                  >
                    <option value="">Select...</option>
                    <option value="<5k">&lt; $5,000</option>
                    <option value="5-15k">$5,000 - $15,000</option>
                    <option value="15-50k">$15,000 - $50,000</option>
                    <option value="50k+">$50,000+</option>
                  </select>
                </div>
              </motion.div>

              <motion.button
                variants={fadeUp}
                type="submit"
                disabled={submitting}
                className="w-full px-5 py-4 md:py-3 text-xs font-mono bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Establishing Connection..." : "Establish Secure Channel"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ContactModule;
