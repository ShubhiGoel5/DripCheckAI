import { GlassCard } from "@/components/ui/GlassCard";
import type { OutfitCompositionItem } from "@/types/analysis";
import { Shirt, Scissors, Footprints, Gem, Watch } from "lucide-react";

interface OutfitCompositionCardProps {
  items: OutfitCompositionItem[];
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "top wear": return <Shirt className="w-5 h-5" />;
    case "bottom wear": return <Scissors className="w-5 h-5 rotate-90" />; // Fallback icon since lucide doesn't have pants
    case "footwear": return <Footprints className="w-5 h-5" />;
    case "jewelry": return <Gem className="w-5 h-5" />;
    case "accessories": return <Watch className="w-5 h-5" />;
    default: return <Shirt className="w-5 h-5" />;
  }
};

export const OutfitCompositionCard = ({ items }: OutfitCompositionCardProps) => (
  <GlassCard className="p-6 h-full">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-primary mb-1">Wardrobe Items</p>
        <h3 className="font-display text-3xl font-black text-foreground">Outfit Composition</h3>
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const isVisible = item.visibility === "visible";
        return (
          <div key={item.category} className={`group relative rounded-2xl border transition-all duration-300 p-5 ${isVisible ? 'border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50' : 'border-white/5 bg-white/5 opacity-70'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-xl ${isVisible ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted-foreground'}`}>
                {getCategoryIcon(item.category)}
              </div>
              {isVisible ? (
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Match</span>
                  <span className="text-sm font-black text-primary">{item.confidence}%</span>
                </div>
              ) : (
                <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-black uppercase text-muted-foreground border border-white/5">Not visible</span>
              )}
            </div>
            
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{item.category}</p>
            <p className={`font-display text-xl font-bold leading-tight ${isVisible ? 'text-foreground' : 'text-muted-foreground'}`}>{item.item}</p>
            
            {isVisible && (
              <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground/80">{item.note}</p>
            )}
          </div>
        );
      })}
    </div>
  </GlassCard>
);
