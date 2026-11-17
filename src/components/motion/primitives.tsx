import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

export const EASE = [0.2, 0.7, 0.2, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li";
}

/** Fades and lifts its children in once, when they scroll into view. */
export const Reveal = ({ children, delay = 0, y = 22, className, as = "div" }: RevealProps) => {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
};

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
  /** Count when scrolled into view (default) or immediately */
  onView?: boolean;
}

/** A number that ticks up from its previous value to `value`. */
export const CountUp = ({ value, duration = 1.3, className, onView = true }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const from = useRef(0);
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (onView && !inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const controls = animate(from.current, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        from.current = v;
        setN(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, inView, onView, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
};

/** Infinite horizontal ticker of mono labels. */
export const Marquee = ({ items }: { items: string[] }) => {
  const row = (
    <ul className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className="label whitespace-nowrap px-6 text-foreground">{t}</span>
          <span className="text-signal">✕</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="group overflow-hidden border-y border-foreground bg-background py-3" role="presentation">
      <div className="marquee flex w-max group-hover:[animation-play-state:paused]">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
};
