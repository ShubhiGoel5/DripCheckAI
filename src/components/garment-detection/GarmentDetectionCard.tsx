import { Shirt, Watch, Gem, Footprints } from "lucide-react";
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
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Stage 1</p>
      <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Fashion Component Detection</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Every outfit element recognized by our computer vision engine, with extracted styling tags.
      </p>
    </div>
    <div className="space-y-3">
      {garments.length === 0 && (
        <div className="rounded-2xl bg-muted/60 p-4 border border-border">
          <p className="font-semibold text-foreground">No garments detected</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Make sure to upload a clear full-body image.
          </p>
        </div>
      )}
      {garments.map((garment) => {
        const Icon = getIcon(garment.category);

        return (
          <div key={garment.id} className="rounded-2xl bg-muted/50 p-4 border border-border transition-all hover:bg-muted/70">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#FF3CAC,#784BA0,#2BFFFE)] text-white shadow-md">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-bold text-foreground">{garment.label}</p>
                    <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {garment.category}
                    </span>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary shadow-sm shrink-0">
                    {garment.confidence}% match
                  </span>
                </div>

                {/* Attribute Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {garment.dominantColor && (
                    <span className="flex items-center gap-1.5 rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs border border-border">
                      <span className="h-2 w-2 rounded-full border border-black/10" style={{ backgroundColor: garment.dominantColor.toLowerCase().replace(" ", "") }} />
                      {garment.dominantColor}
                    </span>
                  )}
                  {garment.material && (
                    <span className="rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground shadow-xs border border-border">
                      {garment.material}
                    </span>
                  )}
                  {garment.pattern && (
                    <span className="rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground shadow-xs border border-border">
                      {garment.pattern}
                    </span>
                  )}
                  {garment.fitType && (
                    <span className="rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground shadow-xs border border-border">
                      {garment.fitType} fit
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

