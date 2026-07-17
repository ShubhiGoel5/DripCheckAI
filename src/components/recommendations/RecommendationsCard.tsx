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
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Stage 7</p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Styling Recommendations</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Categorized, actionable steps recommended by the AI stylist to upgrade your outfit's aesthetic and score.
        </p>
      </div>

      <Tabs defaultValue="immediate" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-muted p-2 rounded-2xl border border-border shadow-inner mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-muted-foreground transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {cat.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="focus-visible:outline-none">
            {(!cat.data || cat.data.length === 0) ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No specific recommendations in this category for this look.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cat.data.map((item, idx) => (
                  <div key={idx} className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-xs transition-all hover:bg-muted/50">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase text-white ${
                          item.priority === "High" ? "bg-[#FF3CAC]" : item.priority === "Medium" ? "bg-[#784BA0]" : "bg-muted-foreground"
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-foreground">{item.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary">
                      <span>Action tip</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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

