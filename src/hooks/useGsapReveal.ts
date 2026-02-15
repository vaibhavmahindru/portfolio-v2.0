import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealPreset = "fade-up" | "fade-left" | "fade-right" | "scale-in" | "clip-up";

interface UseGsapRevealOptions {
  preset?: RevealPreset;
  delay?: number;
  duration?: number;
  stagger?: number;
  /** CSS selector for children to stagger (e.g. ".card") */
  staggerSelector?: string;
  /** How far the trigger should start inside the viewport (default "85%") */
  start?: string;
}

const presets: Record<RevealPreset, gsap.TweenVars> = {
  "fade-up": { y: 60, opacity: 0 },
  "fade-left": { x: -60, opacity: 0 },
  "fade-right": { x: 60, opacity: 0 },
  "scale-in": { scale: 0.85, opacity: 0 },
  "clip-up": { clipPath: "inset(100% 0 0 0)", opacity: 0 },
};

const presetTargets: Record<RevealPreset, gsap.TweenVars> = {
  "fade-up": { y: 0, opacity: 1 },
  "fade-left": { x: 0, opacity: 1 },
  "fade-right": { x: 0, opacity: 1 },
  "scale-in": { scale: 1, opacity: 1 },
  "clip-up": { clipPath: "inset(0% 0 0 0)", opacity: 1 },
};

/**
 * Attaches a GSAP ScrollTrigger reveal animation to the returned ref.
 * Respects `prefers-reduced-motion`.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseGsapRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    preset = "fade-up",
    delay = 0,
    duration = 0.8,
    stagger = 0.12,
    staggerSelector,
    start = "top 85%",
  } = options;

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    const targets = staggerSelector ? el.querySelectorAll(staggerSelector) : [el];
    if (targets.length === 0) return;

    const from = presets[preset];
    const to = presetTargets[preset];

    gsap.set(targets, from);

    const tween = gsap.to(targets, {
      ...to,
      duration,
      delay,
      stagger: targets.length > 1 ? stagger : 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [preset, delay, duration, stagger, staggerSelector, start]);

  return ref;
}

export default useGsapReveal;

