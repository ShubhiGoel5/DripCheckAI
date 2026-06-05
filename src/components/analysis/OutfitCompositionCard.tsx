import { GlassCard } from "@/components/ui/GlassCard";
import type { OutfitCompositionItem } from "@/types/analysis";

interface OutfitCompositionCardProps {
  items: OutfitCompositionItem[];
}

export const OutfitCompositionCard = ({ items }: OutfitCompositionCardProps) => (
  <GlassCard className="p-6">
    <div className="mb-5">
      <p className="text-sm font-black uppercase text-[#2B9EA0]">Stage 4</p>
      <h3 className="font-display text-3xl font-black text-[#171018]">Outfit Composition</h3>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.category} className="rounded-2xl border border-white/60 bg-white/58 p-4 shadow-[0_12px_32px_rgba(120,75,160,0.1)]">
          <p className="text-xs font-black uppercase text-[#784BA0]">{item.category}</p>
          <p className="mt-2 font-display text-2xl font-black leading-none text-[#171018]">{item.item}</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#5F4967]">{item.note}</p>
          <div className="mt-4 flex items-center gap-3">
            {item.visibility === "visible" ? (
              <>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/80">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#FF3CAC,#784BA0,#2BFFFE)]" style={{ width: `${item.confidence}%` }} />
                </div>
                <span className="text-sm font-black text-[#784BA0]">{item.confidence}%</span>
              </>
            ) : (
              <span className="rounded-full bg-[#171018] px-3 py-1 text-xs font-black uppercase text-white">Not visible</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </GlassCard>
);
