import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface SimulationScenario {
  scenario: string;
  projectedScore: number;
  explanation: string;
}

interface WardrobeSimulatorProps {
  baseScore: number;
  scenarios: SimulationScenario[];
}

export const WardrobeSimulator = ({ baseScore, scenarios }: WardrobeSimulatorProps) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const activeScore = selectedIdx !== null ? scenarios[selectedIdx].projectedScore : baseScore;
  const activeDiff = activeScore - baseScore;
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (activeScore / 100) * circumference;

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <p className="text-sm font-black uppercase text-[#2BFFFE]">Stage 8</p>
        <h3 className="font-display text-3xl font-black text-white">Interactive Wardrobe Simulator</h3>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[#5F4967]">
          Select one of the stylist's hypothetical upgrades below to preview the projected score and visual balance improvements.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr] items-center">
        {/* Left Side: Score Preview */}
        <div className="flex flex-col items-center justify-center p-4 rounded-3xl border border-white/60 bg-white/30 text-center shadow-sm">
          <div className="relative grid h-44 w-44 place-items-center mb-2">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,#FF3CAC,#784BA0,#2BFFFE,#FFE45E)] opacity-20 blur-lg" />
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="10" />
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="url(#simScoreGradient)"
                strokeLinecap="round"
                strokeWidth="10"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="simScoreGradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2BFFFE" />
                  <stop offset="50%" stopColor="#784BA0" />
                  <stop offset="100%" stopColor="#FF3CAC" />
                </linearGradient>
              </defs>
            </svg>
            <div className="relative text-center">
              <p className="text-[9px] font-black uppercase text-[#784BA0]">Projected Score</p>
              <span className="font-display text-4xl font-black text-white">{activeScore}</span>
              {activeDiff > 0 && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={activeDiff}
                  className="absolute -top-4 -right-6 rounded-full bg-[#17B982] px-2 py-0.5 text-[10px] font-black text-white shadow-md flex items-center gap-0.5"
                >
                  <Plus className="h-2.5 w-2.5" />
                  {activeDiff}
                </motion.div>
              )}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIdx !== null ? selectedIdx : "base"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[80px]"
            >
              <h4 className="text-xs font-black uppercase tracking-wider text-[#FF3CAC]">
                {selectedIdx !== null ? "Selected Scenario" : "Baseline Outfit"}
              </h4>
              <p className="mt-1 text-xs font-semibold text-white leading-relaxed max-w-xs">
                {selectedIdx !== null 
                  ? scenarios[selectedIdx].explanation 
                  : "Currently displaying your uploaded look as-is. Click any recommendation on the right to simulate changes."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Scenarios Selection */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setSelectedIdx(null)}
            className={cn(
              "w-full flex items-center justify-between rounded-2xl border p-4 text-left transition-all",
              selectedIdx === null
                ? "border-black bg-[#171018] text-white shadow-md"
                : "border-white bg-white/40 text-white hover:bg-white/10"
            )}
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Current Build</span>
              <p className="text-sm font-black">As Analyzed</p>
            </div>
            <span className="text-sm font-black">{baseScore}</span>
          </button>

          {scenarios.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  "w-full flex items-center justify-between rounded-2xl border p-4 text-left transition-all",
                  isSelected
                    ? "border-[#FF3CAC] bg-[#FF3CAC]/10 shadow-[0_8px_24px_rgba(255,60,172,0.14)]"
                    : "border-white bg-white/40 text-white hover:bg-white/10"
                )}
              >
                <div className="pr-4 min-w-0">
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#784BA0]">
                    <Wand2 className="h-3 w-3" />
                    Simulated Step {idx + 1}
                  </span>
                  <p className="text-sm font-black truncate">{item.scenario}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black">{item.projectedScore}</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#17B982] text-white text-[10px] font-black">
                    +{item.projectedScore - baseScore}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};
