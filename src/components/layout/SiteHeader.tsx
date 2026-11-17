import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  activeView: "stylist" | "history";
  onViewChange: (view: "stylist" | "history") => void;
}

const NAV = [
  { id: "stylist" as const, label: "Check a fit" },
  { id: "history" as const, label: "Archive" },
];

export const SiteHeader = ({ activeView, onViewChange }: SiteHeaderProps) => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
  <header className="sticky top-0 z-50 border-b border-foreground bg-background">
    {/* Reading progress */}
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-px h-[3px] origin-left bg-signal"
      style={{ scaleX: progress }}
    />
    <div className="page flex h-14 items-center justify-between">
      <button
        type="button"
        onClick={() => onViewChange("stylist")}
        className="flex items-baseline gap-1.5"
        aria-label="DripCheck home"
      >
        <span className="font-display text-[26px] leading-none tracking-tight">DripCheck</span>
        <span className="label text-signal">AI</span>
      </button>

      <nav aria-label="Main" className="flex items-center gap-6">
        {NAV.map((item) => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative py-1 text-sm font-semibold transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {active && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-[3px] h-[2px] bg-signal"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  </header>
  );
};
