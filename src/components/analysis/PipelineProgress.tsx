import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, CircleDashed } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const steps = [
  "Detecting Garments",
  "Extracting Colors",
  "Identifying Style",
  "Computing Score",
  "Generating Recommendations",
];

export const PipelineProgress = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    }, 360);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="grid place-items-center">
          <div className="relative grid h-72 w-72 place-items-center rounded-full bg-white/50">
            <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(#FF3CAC,#784BA0,#2BFFFE,#FFE45E,#FF8C42,#FF3CAC)] opacity-35 blur-xl" />
            <div className="relative grid h-48 w-48 place-items-center rounded-full border border-white/70 bg-white/10 shadow-[0_24px_70px_rgba(120,75,160,0.18)] backdrop-blur-2xl">
              <CircleDashed className="h-16 w-16 animate-spin text-[#FF3CAC]" aria-hidden="true" />
              <p className="mt-4 text-center text-sm font-black uppercase text-[#784BA0]">Analyzing Image</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase text-[#FF3CAC]">Visual analysis in progress</p>
          <h3 className="mt-2 font-display text-4xl font-black leading-none text-foreground">Building the evidence trail</h3>
          <div className="mt-7 space-y-4">
            {steps.map((step, index) => {
              const isComplete = index < activeStep;
              const isActive = index === activeStep;

              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-4 shadow-[0_12px_34px_rgba(120,75,160,0.1)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#FF3CAC,#784BA0,#2BFFFE)] text-white">
                      {isComplete ? <Check className="h-5 w-5" /> : <CircleDashed className={isActive ? "h-5 w-5 animate-spin" : "h-5 w-5 opacity-60"} />}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-foreground">{step}</p>
                        <p className="text-xs font-black uppercase text-[#6A5571]">{isComplete ? "Complete" : isActive ? "Running" : "Queued"}</p>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#FF3CAC,#784BA0,#2BFFFE)]"
                          initial={{ width: "0%" }}
                          animate={{ width: isComplete ? "100%" : isActive ? "72%" : "0%" }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
