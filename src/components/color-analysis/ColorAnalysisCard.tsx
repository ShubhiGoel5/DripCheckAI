import type { ColorSignal } from "@/types/analysis";
import { motion } from "framer-motion";
import { EASE } from "@/components/motion/primitives";
import { ScoreBar } from "@/components/ui/ScoreBar";

interface ColorAnalysisCardProps {
  colorsData: {
    dominantColors: ColorSignal[];
    accentColors: string[];
    harmonyType: string;
    harmonyExplanation: string;
  };
  harmonyScore: number;
}

export const ColorAnalysisCard = ({ colorsData, harmonyScore }: ColorAnalysisCardProps) => {
  const total = colorsData.dominantColors.reduce((sum, c) => sum + c.percentage, 0) || 1;

  return (
    <div className="space-y-8">
      {/* Proportional swatch strip */}
      {colorsData.dominantColors.length > 0 && (
        <div>
          <div className="flex h-20 w-full overflow-hidden border border-foreground" role="img" aria-label="Colour proportions in the outfit">
            {colorsData.dominantColors.map((c, i) => (
              <motion.div
                key={c.name}
                style={{ backgroundColor: c.hex }}
                title={`${c.name} ${c.percentage}%`}
                initial={{ width: 0 }}
                whileInView={{ width: `${(c.percentage / total) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: EASE }}
              />
            ))}
          </div>
          <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
            {colorsData.dominantColors.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm">
                <span className="flex items-center gap-2.5 font-medium">
                  <span className="h-3 w-3 border border-foreground/40" style={{ backgroundColor: c.hex }} aria-hidden="true" />
                  {c.name}
                </span>
                <span className="font-mono text-xs tabular text-muted-foreground">{c.percentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {colorsData.accentColors && colorsData.accentColors.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="label mr-2">Accents</span>
          {colorsData.accentColors.map((c, i) => (
            <span key={i} className="chip">
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-[1fr_16rem]">
        <div>
          <p className="label">Harmony</p>
          <p className="mt-1 font-display text-2xl leading-tight text-signal">{colorsData.harmonyType || "—"}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{colorsData.harmonyExplanation}</p>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <p className="label">Harmony score</p>
            <p className="font-mono text-sm tabular">{harmonyScore}/100</p>
          </div>
          <ScoreBar value={harmonyScore} className="mt-3" />
        </div>
      </div>
    </div>
  );
};
