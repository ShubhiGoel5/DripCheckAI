import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CountUp } from "@/components/motion/primitives";
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

/** "What if" — pick a change, see the projected score. */
export const WardrobeSimulator = ({ baseScore, scenarios }: WardrobeSimulatorProps) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const selected = selectedIdx !== null ? scenarios[selectedIdx] : null;
  const activeScore = selected ? selected.projectedScore : baseScore;
  const diff = activeScore - baseScore;

  if (scenarios.length === 0) {
    return <p className="text-sm text-muted-foreground">No what-if scenarios came back for this look.</p>;
  }

  const rows = [{ label: "As photographed", score: baseScore, idx: null as number | null }].concat(
    scenarios.map((s, i) => ({ label: s.scenario, score: s.projectedScore, idx: i })),
  );

  return (
    <div className="grid gap-8 md:grid-cols-[14rem_1fr] md:gap-12">
      <div aria-live="polite">
        <p className="label">{selected ? "With this change" : "Right now"}</p>
        <CountUp value={activeScore} duration={0.7} className="display tabular mt-1 block text-6xl" />
        <p className={cn("label mt-2 transition-opacity duration-300", diff > 0 ? "text-signal" : "opacity-0")}>+{diff} points</p>
        <div className="mt-4 min-h-[4.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={selectedIdx ?? "base"}
              className="text-sm leading-relaxed text-muted-foreground"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {selected ? selected.explanation : "Choose a change to see how far it would move the score."}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <ul role="radiogroup" aria-label="What-if changes" className="border-t border-border">
        {rows.map((row) => {
          const isOn = selectedIdx === row.idx;
          return (
            <li key={row.idx ?? "base"} className="border-b border-border">
              <button
                type="button"
                role="radio"
                aria-checked={isOn}
                onClick={() => setSelectedIdx(row.idx)}
                className={cn(
                  "group flex w-full items-center gap-4 py-4 text-left transition-colors",
                  isOn ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                    isOn ? "border-signal" : "border-foreground/50 group-hover:border-foreground",
                  )}
                  aria-hidden="true"
                >
                  {isOn && (
                    <motion.span
                      layoutId="sim-dot"
                      className="h-2 w-2 rounded-full bg-signal"
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  )}
                </span>
                <span className={cn("flex-1 text-[15px]", isOn ? "font-semibold" : "font-medium")}>{row.label}</span>
                <span className="font-mono text-sm tabular">
                  {row.score}
                  {row.idx !== null && (
                    <span className="ml-2 text-xs text-signal">+{row.score - baseScore}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
