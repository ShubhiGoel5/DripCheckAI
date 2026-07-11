import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const GlassCard = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-2xl border bg-card/70 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md",
      className,
    )}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);
