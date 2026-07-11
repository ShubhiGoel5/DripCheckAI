import { motion } from "framer-motion";
import { Camera, Sparkles, User, Key, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  activeView: "stylist" | "history";
  onViewChange: (view: "stylist" | "history") => void;
}

export const SiteHeader = ({ activeView, onViewChange }: SiteHeaderProps) => (
  <motion.header
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease: "easeOut" }}
    className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8"
  >
    <button
      type="button"
      onClick={() => onViewChange("stylist")}
      className="group flex items-center gap-3 text-left focus:outline-none"
      aria-label="DripCheckAI home"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary shadow-glow transition-transform duration-300 group-hover:scale-[1.05]">
        <Sparkles className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-tight text-foreground">DripCheckAI</span>
    </button>

    <nav className="hidden sm:flex items-center gap-1 rounded-full glass-panel px-1.5 py-1.5 text-sm font-medium text-muted-foreground">
      <button
        onClick={() => onViewChange("stylist")}
        className={cn(
          "px-4 py-1.5 rounded-full transition-all duration-200",
          activeView === "stylist" ? "bg-white/10 text-foreground shadow-sm" : "hover:text-foreground hover:bg-white/5"
        )}
      >
        Stylist
      </button>
      <button
        onClick={() => onViewChange("history")}
        className={cn(
          "flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all duration-200",
          activeView === "history" ? "bg-white/10 text-foreground shadow-sm" : "hover:text-foreground hover:bg-white/5"
        )}
      >
        <BarChart3 className="h-4 w-4" />
        Evolution
      </button>
    </nav>

    <a
      href="#upload"
      className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Camera className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Check Fit</span>
    </a>
  </motion.header>
);

