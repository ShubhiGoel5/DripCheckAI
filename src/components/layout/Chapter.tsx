import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";

interface ChapterProps {
  /** Short mono label above the title, e.g. "01" */
  no: string;
  title: string;
  /** One quiet line explaining the section */
  note?: string;
  children: ReactNode;
  className?: string;
  /** Kept for API compatibility; reveals are now scroll-triggered. */
  index?: number;
}

const view = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * A numbered block of the report. When it scrolls in, the top rule draws across,
 * the title rises out of a mask, and the content follows.
 */
export const Chapter = ({ no, title, note, children, className }: ChapterProps) => (
  <section className={cn("pt-4", className)}>
    <motion.span
      className="mb-4 block h-px origin-left bg-foreground"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={view}
      transition={{ duration: 1, ease: EASE }}
    />
    <header className="mb-6 grid gap-x-8 gap-y-1 sm:grid-cols-[5rem_1fr]">
      <motion.span
        className="label pt-2 text-signal"
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={view}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {no}
      </motion.span>
      <div>
        <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.h3
            className="font-display text-2xl leading-none tracking-tight sm:text-3xl"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={view}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            {title}
          </motion.h3>
        </span>
        {note && (
          <motion.p
            className="mt-2 max-w-xl text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={view}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {note}
          </motion.p>
        )}
      </div>
    </header>
    <motion.div
      className="sm:pl-[7rem]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={view}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
    >
      {children}
    </motion.div>
  </section>
);
