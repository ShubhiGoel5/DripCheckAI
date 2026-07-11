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
    { title: "Styling Logic", icon: GraduationCap, color: "text-[#FF3CAC]", bg: "bg-[#FF3CAC]/5", border: "border-[#FF3CAC]/10", data: coaching.stylingConcepts },
    { title: "Color Science", icon: Palette, color: "text-[#784BA0]", bg: "bg-[#784BA0]/5", border: "border-[#784BA0]/10", data: coaching.colorConcepts },
    { title: "Silhouette & Geometry", icon: Layers, color: "text-[#2BFFFE]", bg: "bg-[#2BFFFE]/5", border: "border-[#2BFFFE]/10", data: coaching.silhouetteConcepts },
    { title: "Timeless Principles", icon: Award, color: "text-[#FF8C42]", bg: "bg-[#FF8C42]/5", border: "border-[#FF8C42]/10", data: coaching.fashionPrinciples },
  ];

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <p className="text-sm font-black uppercase text-[#784BA0]">Stage 9</p>
        <h3 className="font-display text-3xl font-black text-foreground">Personal Fashion Coach</h3>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[#5F4967]">
          Every outfit represents a styling lesson. Learn the principles behind visual harmony and proportion theory applied to your look.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div key={idx} className={`rounded-2xl border ${sec.border} ${sec.bg} p-5 shadow-sm`}>
              <div className="mb-4 flex items-center gap-2">
                <span className={`grid h-8 w-8 place-items-center rounded-lg bg-background shadow-sm ${sec.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h4 className="text-sm font-black text-foreground uppercase tracking-wide">{sec.title}</h4>
              </div>
              <ul className="space-y-2.5">
                {sec.data && sec.data.length > 0 ? (
                  sec.data.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-xs font-semibold leading-relaxed text-[#4F3A56]">
                      <Sparkles className="mt-1 h-3 w-3 flex-shrink-0 text-[#FF8C42]" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs font-semibold text-[#6A5571] italic">
                    Refer to styling recommendations for specific concepts for this build.
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
