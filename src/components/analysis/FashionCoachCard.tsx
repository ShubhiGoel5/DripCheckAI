import { Award, GraduationCap, Palette, Layers, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface FashionCoachCardProps {
  coaching: {
    fashionPrinciples: string[];
    stylingConcepts: string[];
    colorConcepts: string[];
    silhouetteConcepts: string[];
  };
}

export const FashionCoachCard = ({ coaching }: FashionCoachCardProps) => {
  const sections = [
    { title: "Styling Logic", icon: GraduationCap, color: "text-[#FF3CAC]", bg: "bg-[#FF3CAC]/8", border: "border-[#FF3CAC]/15", data: coaching.stylingConcepts },
    { title: "Color Science", icon: Palette, color: "text-[#784BA0]", bg: "bg-[#784BA0]/8", border: "border-[#784BA0]/15", data: coaching.colorConcepts },
    { title: "Silhouette & Geometry", icon: Layers, color: "text-[#2BFFFE]", bg: "bg-[#2BFFFE]/8", border: "border-[#2BFFFE]/15", data: coaching.silhouetteConcepts },
    { title: "Timeless Principles", icon: Award, color: "text-[#FF8C42]", bg: "bg-[#FF8C42]/8", border: "border-[#FF8C42]/15", data: coaching.fashionPrinciples },
  ];

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Stage 9</p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Personal Fashion Coach</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Every outfit represents a styling lesson. Learn the principles behind visual harmony and proportion theory applied to your look.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div key={idx} className={`rounded-2xl border ${sec.border} ${sec.bg} p-5`}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`grid h-8 w-8 place-items-center rounded-lg bg-background shadow-xs border border-border ${sec.color}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h4 className="text-sm font-bold text-foreground">{sec.title}</h4>
              </div>
              <ul className="space-y-2">
                {sec.data && sec.data.length > 0 ? (
                  sec.data.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/75">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#FF8C42]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground italic">
                    Refer to styling recommendations for specific concepts for this look.
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

