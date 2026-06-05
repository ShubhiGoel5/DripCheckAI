import { ArrowRight, Sparkles, Zap, Palette, Watch, Layers, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Recommendation } from "@/types/analysis";

interface RecommendationsCardProps {
  recommendations: {
    immediate: Recommendation[];
    colors: Recommendation[];
    accessories: Recommendation[];
    styling: Recommendation[];
    trends: Recommendation[];
  };
}

export const RecommendationsCard = ({ recommendations }: RecommendationsCardProps) => {
  const categories = [
    { value: "immediate", label: "Immediate Tweaks", icon: Zap, data: recommendations.immediate },
    { value: "colors", label: "Color Science", icon: Palette, data: recommendations.colors },
    { value: "accessories", label: "Accessories", icon: Watch, data: recommendations.accessories },
    { value: "styling", label: "Styling & Proportions", icon: Layers, data: recommendations.styling },
    { value: "trends", label: "Trend Ideas", icon: TrendingUp, data: recommendations.trends },
  ];

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <p className="text-sm font-black uppercase text-[#FF3CAC]">Stage 7</p>
        <h3 className="font-display text-3xl font-black text-[#171018]">Styling Recommendations</h3>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[#5F4967]">
          Categorized, actionable steps recommended by the AI stylist to upgrade your outfit's aesthetic and score.
        </p>
      </div>

      <Tabs defaultValue="immediate" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-white/20 p-2 rounded-2xl border border-white/40 shadow-inner mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black text-[#4F3A56] transition-all data-[state=active]:bg-[#171018] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="focus-visible:outline-none">
            {(!cat.data || cat.data.length === 0) ? (
              <div className="text-center py-8 text-sm font-semibold text-[#5F4967]">
                No specific recommendations in this category for this look.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cat.data.map((item, idx) => (
                  <div key={idx} className="flex flex-col justify-between rounded-2xl border border-white/60 bg-white/58 p-5 shadow-sm transition-all hover:bg-white/70">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <Sparkles className="h-4.5 w-4.5 text-[#FF3CAC]" aria-hidden="true" />
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase text-white ${
                          item.priority === "High" ? "bg-[#FF3CAC]" : item.priority === "Medium" ? "bg-[#784BA0]" : "bg-[#6A5571]"
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <h4 className="font-display text-xl font-black text-[#171018]">{item.title}</h4>
                      <p className="mt-2 text-xs font-semibold leading-relaxed text-[#5F4967]">{item.detail}</p>
                    </div>
                    <div className="mt-5 flex items-center gap-1 text-xs font-black text-[#784BA0]">
                      <span>Action tip</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </GlassCard>
  );
};

