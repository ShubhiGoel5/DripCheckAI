import { motion } from "framer-motion";
import { EASE } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";

interface ScoreBarProps {
  value: number;
  /** Override the fill colour (e.g. a swatch hex) */
  color?: string;
  className?: string;
  delay?: number;
}

/** A 3px rule that draws itself to `value` (0–100) when scrolled into view. */
export const ScoreBar = ({ value, color, className, delay = 0 }: ScoreBarProps) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-[3px] w-full bg-border", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full origin-left bg-foreground"
        style={{ width: `${pct}%`, ...(color ? { backgroundColor: color } : null) }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      />
    </div>
  );
};
