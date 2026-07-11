import { Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { StyleClassification } from "@/types/analysis";

interface StyleClassificationCardProps {
  styles: StyleClassification[];
}

export const StyleClassificationCard = ({ styles }: StyleClassificationCardProps) => (
  <GlassCard className="p-6">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Stage 3</p>
        <h3 className="text-xl font-bold tracking-tight text-foreground mt-1">Aesthetic Archetypes</h3>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Prediction confidence percentages for various styling categories detected in this look.
        </p>
      </div>
      <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
    </div>
    <div className="space-y-5">
      {styles.map((style) => (
        <div key={style.label}>
          <div className="mb-2 flex items-center justify-between mt-3">
            <p className="font-semibold text-sm text-foreground">{style.label}</p>
            <p className="font-medium text-xs text-muted-foreground">{style.probability}% match</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-primary transition-all duration-1000 shadow-glow" style={{ width: `${style.probability}%` }} />
          </div>
        </div>
      ))}
    </div>
  </GlassCard>
);

