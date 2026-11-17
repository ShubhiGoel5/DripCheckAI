import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const steps = ["Looking at the pieces", "Pulling the palette", "Placing the style", "Scoring it", "Writing the fixes"];

/** Honest loading state: a typed list that ticks forward while the model works. */
export const PipelineProgress = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    }, 2200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="animate-rise border-t border-foreground pt-4" role="status" aria-live="polite">
      <p className="label">Reading your fit</p>
      <h3 className="display mt-3 text-[clamp(2.25rem,4.5vw,3.5rem)]">
        One moment<span className="animate-tick text-signal">.</span>
      </h3>
      <ol className="mt-8 max-w-md border-t border-border">
        {steps.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <li
              key={step}
              className={cn(
                "flex items-baseline gap-5 border-b border-border py-3 transition-opacity",
                !done && !active && "opacity-35",
              )}
            >
              <span className={cn("label w-6", active && "text-signal")}>{String(i + 1).padStart(2, "0")}</span>
              <span className={cn("flex-1 text-[15px] font-medium", done && "line-through decoration-foreground/40")}>{step}</span>
              <span className="label">{done ? "Done" : active ? "Now" : ""}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
