import { motion } from "framer-motion";
import { Flame, CheckCircle2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DripScoreProps {
  score: number;
  confidence?: string;
  scoresData?: {
    outfitCohesion: number;
    colorHarmony: number;
    silhouetteBalance: number;
    footwearCompatibility: number;
    accessoryBalance: number;
    jewelryBalance: number;
    trendAlignment: number;
    occasionSuitability: number;
    personalStyleAlignment: number;
  };
}

export const DripScore = ({ score, confidence = "High", scoresData }: DripScoreProps) => {
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  const subscores = scoresData ? [
    { label: "Outfit Cohesion", value: scoresData.outfitCohesion, desc: "How well all pieces fit together into a unified style." },
    { label: "Color Harmony", value: scoresData.colorHarmony, desc: "Color combinations, palette relationships, and contrast ratios." },
    { label: "Silhouette Balance", value: scoresData.silhouetteBalance, desc: "Proportions, volume styling, and height/width lengths." },
    { label: "Footwear Compatibility", value: scoresData.footwearCompatibility, desc: "Formality matching, shoe style, and color compatibility." },
    { label: "Accessory Balance", value: scoresData.accessoryBalance, desc: "Visual weight and coordination of bags, belts, etc." },
    { label: "Jewelry Balance", value: scoresData.jewelryBalance, desc: "Placement, metal consistency, and coordination of jewelry." },
    { label: "Trend Alignment", value: scoresData.trendAlignment, desc: "How current and trendy the elements are (low impact on overall)." },
    { label: "Occasion Suitability", value: scoresData.occasionSuitability, desc: "How appropriate the look is for your selected occasion." },
    { label: "Style Alignment", value: scoresData.personalStyleAlignment, desc: "How well it reflects the style preferences in your profile." },
  ] : [];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Circle Gauge */}
      <div className="relative grid h-60 w-60 place-items-center">
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,#FF3CAC,#784BA0,#2BFFFE,#FFE45E,#FF8C42,#FF3CAC)] opacity-30 blur-xl" />
        <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="14" />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeLinecap="round"
            strokeWidth="14"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.25, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#FF3CAC" />
              <stop offset="45%" stopColor="#784BA0" />
              <stop offset="72%" stopColor="#2BFFFE" />
              <stop offset="100%" stopColor="#FFE45E" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div
          initial={{ scale: 0.86, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="relative grid h-44 w-44 place-items-center rounded-full border border-white/70 bg-white/64 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_20px_50px_rgba(120,75,160,0.15)] backdrop-blur-2xl"
        >
          <div>
            <p className="mb-1 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-[#FF3CAC]">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              Overall Rating
            </p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="font-display text-5xl font-black leading-none text-foreground"
            >
              {score}
            </motion.p>
            <p className="mt-1 text-[10px] font-black text-[#6B5472]">Confidence: {confidence}</p>
          </div>
        </motion.div>
      </div>

      {/* Subscores Grid */}
      {subscores.length > 0 && (
        <TooltipProvider>
          <div className="w-full space-y-3.5 border-t border-border pt-5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#784BA0]">Fashion Breakdown</h4>
            <div className="grid gap-3">
              {subscores.map((sub) => (
                <div key={sub.label} className="rounded-xl bg-muted/50 p-2.5 border border-border shadow-sm transition-all hover:bg-muted">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-foreground">
                      {sub.label}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-[#6B5472] hover:text-[#FF3CAC] shrink-0">
                            <HelpCircle className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-xs font-semibold">
                          {sub.desc}
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <span className="text-xs font-black text-[#784BA0] shrink-0">{sub.value}/100</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#FF3CAC,#784BA0,#2BFFFE)] transition-all duration-1000"
                      style={{ width: `${sub.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>
      )}
    </div>
  );
};

