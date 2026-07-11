import { Palette } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ColorSignal } from "@/types/analysis";

interface ColorAnalysisCardProps {
  colorsData: {
    dominantColors: ColorSignal[];
    accentColors: string[];
    harmonyType: string;
    harmonyExplanation: string;
  };
  harmonyScore: number;
}

export const ColorAnalysisCard = ({ colorsData, harmonyScore }: ColorAnalysisCardProps) => (
  <GlassCard className="p-6">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-black uppercase text-[#784BA0]">Stage 2</p>
        <h3 className="font-display text-3xl font-black text-white">Color Science Analysis</h3>
      </div>
      <Palette className="h-7 w-7 text-[#FF3CAC]" aria-hidden="true" />
    </div>

    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-[#784BA0]">Dominant Palette</label>
        <div className="mt-2 space-y-3">
          {colorsData.dominantColors.map((color) => (
            <div key={color.name}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg border-2 border-white shadow-sm" style={{ backgroundColor: color.hex }} />
                  <p className="text-xs font-black text-white">{color.name}</p>
                </div>
                <p className="text-xs font-black text-[#784BA0]">{color.percentage}%</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/78">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${color.percentage}%`, backgroundColor: color.hex }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {colorsData.accentColors && colorsData.accentColors.length > 0 && (
        <div className="pt-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-[#784BA0]">Accent Colors</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {colorsData.accentColors.map((color, idx) => (
              <span key={idx} className="rounded-lg bg-white/10 px-2 py-1 text-xs font-bold text-white border border-white/80 shadow-sm">
                {color}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/40 bg-white/30 p-3.5 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-wider text-[#784BA0]">Harmony Type</p>
        <p className="mt-1 text-sm font-black text-[#FF3CAC]">{colorsData.harmonyType}</p>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-[#5F4967]">
          {colorsData.harmonyExplanation}
        </p>
      </div>
    </div>

    <div className="mt-5 rounded-2xl bg-white/58 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-black text-white">Harmony Score</p>
        <p className="text-sm font-black text-[#FF3CAC]">{harmonyScore}/100</p>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#FF3CAC,#784BA0,#2BFFFE)] transition-all duration-1000" style={{ width: `${harmonyScore}%` }} />
      </div>
    </div>
  </GlassCard>
);

