/**
 * Global GSAP ScrollTrigger-powered cinematic animations.
 * Attaches scroll-driven effects to elements with `data-gsap` attributes.
 *
 * Usage: add `data-gsap="fade-up"` (or other preset) to any element.
 * Add `data-gsap-delay="0.2"` or `data-gsap-stagger=".card"` for extras.
 */
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const presets: Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  "fade-up": {
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1 },
  },
  "fade-left": {
    from: { x: -50, opacity: 0 },
    to: { x: 0, opacity: 1 },
  },
  "fade-right": {
    from: { x: 50, opacity: 0 },
    to: { x: 0, opacity: 1 },
  },
  "scale-in": {
    from: { scale: 0.9, opacity: 0 },
    to: { scale: 1, opacity: 1 },
  },
  "clip-up": {
    from: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
    to: { clipPath: "inset(0% 0 0 0)", opacity: 1 },
  },
  "clip-left": {
    from: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    to: { clipPath: "inset(0 0% 0 0)", opacity: 1 },
  },
  "line-draw": {
    from: { scaleX: 0, transformOrigin: "left center" },
    to: { scaleX: 1 },
  },
};

const ScrollAnimations = () => {
  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Find all elements with data-gsap attribute
      const elements = document.querySelectorAll<HTMLElement>("[data-gsap]");

      elements.forEach((el) => {
        const preset = el.dataset.gsap || "fade-up";
        const delay = parseFloat(el.dataset.gsapDelay || "0");
        const duration = parseFloat(el.dataset.gsapDuration || "0.8");
        const staggerSelector = el.dataset.gsapStagger;
        const startPos = el.dataset.gsapStart || "top 85%";

        const config = presets[preset];
        if (!config) return;

        const targets = staggerSelector ? el.querySelectorAll(staggerSelector) : [el];
        if (targets.length === 0) return;

        gsap.set(targets, config.from);

        gsap.to(targets, {
          ...config.to,
          duration,
          delay,
          stagger: targets.length > 1 ? 0.1 : 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: startPos,
            toggleActions: "play none none none",
          },
        });
      });

      // ─── Section divider lines ───
      document.querySelectorAll<HTMLElement>(".gsap-divider").forEach((line) => {
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(line, {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });

      // ─── Parallax elements ───
      document.querySelectorAll<HTMLElement>("[data-gsap-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.gsapParallax || "0.3");
        gsap.to(el, {
          y: () => -100 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
};

export default ScrollAnimations;

