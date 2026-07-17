import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, BarChart3, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  activeView: "stylist" | "history";
  onViewChange: (view: "stylist" | "history") => void;
}

export const SiteHeader = ({ activeView, onViewChange }: SiteHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "stylist" as const, label: "My Stylist", icon: null },
    { id: "history" as const, label: "My Wardrobe", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.button
          type="button"
          onClick={() => onViewChange("stylist")}
          className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          aria-label="DripCheckAI home"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-glow transition-transform duration-300 group-hover:scale-[1.07]">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">DripCheckAI</span>
        </motion.button>

        {/* Desktop Nav */}
        <motion.nav
          className="hidden sm:flex items-center gap-1 rounded-full bg-muted px-2 py-1.5 text-sm font-medium"
          aria-label="Main navigation"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 text-sm font-semibold",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                {item.label}
              </button>
            );
          })}
        </motion.nav>

        <div className="flex items-center gap-2">
          {/* Desktop CTA */}
          <motion.a
            href="#upload"
            className="hidden sm:inline-flex h-10 min-w-[44px] items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Check your fit — scroll to upload"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            Check Fit
          </motion.a>

          {/* Mobile CTA */}
          <a
            href="#upload"
            className="sm:hidden inline-flex h-10 min-w-[44px] items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:bg-primary/90"
            aria-label="Check your fit"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            Check Fit
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="sm:hidden grid h-10 w-10 place-items-center rounded-full border border-border bg-muted transition-all hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen
              ? <X className="h-4 w-4 text-foreground" aria-hidden="true" />
              : <Menu className="h-4 w-4 text-foreground" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="sm:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};


