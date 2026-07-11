import { Shirt, ShoppingBag, Watch, Gem, Footprints } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { GarmentDetection } from "@/types/analysis";

interface GarmentDetectionCardProps {
  garments: GarmentDetection[];
}

const getIcon = (category: GarmentDetection["category"]) => {
  if (category === "Accessories") return Watch;
  if (category === "Footwear") return Footprints;
  if (category === "Jewelry") return Gem;
  return Shirt;
};

export const GarmentDetectionCard = ({ garments }: GarmentDetectionCardProps) => (
  <GlassCard className="p-6">
    <div className="mb-5">
      <p className="text-sm font-black uppercase text-[#FF3CAC]">Stage 1</p>
      <h3 className="font-display text-3xl font-black text-foreground">Fashion Component Detection</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#5F4967]">
        Every outfit element recognized by our computer vision engine, with extracted styling tags.
      </p>
    </div>
    <div className="space-y-4">
      {garments.length === 0 && (
        <div className="rounded-2xl bg-white/58 p-4 shadow-[0_12px_32px_rgba(120,75,160,0.1)]">
          <p className="font-black text-foreground">No garments detected</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#5F4967]">
            Make sure to upload a clear full-body image.
          </p>
        </div>
      )}
      {garments.map((garment) => {
        const Icon = getIcon(garment.category);

        return (
          <div key={garment.id} className="rounded-2xl bg-white/58 p-4 shadow-[0_12px_32px_rgba(120,75,160,0.1)] transition-all hover:bg-white/70">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#FF3CAC,#784BA0,#2BFFFE)] text-white shadow-[0_12px_30px_rgba(255,60,172,0.22)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-black text-foreground">{garment.label}</p>
                    <span className="inline-block rounded-full bg-[#784BA0]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#784BA0]">
                      {garment.category}
                    </span>
                  </div>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-black text-[#FF3CAC] shadow-sm">
                    {garment.confidence}% match
                  </span>
                </div>

                {/* Attribute Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {garment.dominantColor && (
                    <span className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-foreground shadow-sm">
                      <span className="h-2 w-2 rounded-full border border-black/10 bg-[#784BA0]/20" style={{ backgroundColor: garment.dominantColor.toLowerCase().replace(" ", "") }} />
                      Color: {garment.dominantColor}
                    </span>
                  )}
                  {garment.material && (
                    <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-[#4F3A56] shadow-sm">
                      Material: {garment.material}
                    </span>
                  )}
                  {garment.pattern && (
                    <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-[#4F3A56] shadow-sm">
                      Pattern: {garment.pattern}
                    </span>
                  )}
                  {garment.fitType && (
                    <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-[#4F3A56] shadow-sm">
                      Fit: {garment.fitType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </GlassCard>
);

