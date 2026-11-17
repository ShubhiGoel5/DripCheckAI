import { motion } from "framer-motion";
import { EASE } from "@/components/motion/primitives";
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
  const all = [
    { value: "immediate", label: "Do first", data: recommendations.immediate },
    { value: "colors", label: "Colour", data: recommendations.colors },
    { value: "accessories", label: "Accessories", data: recommendations.accessories },
    { value: "styling", label: "Fit & proportion", data: recommendations.styling },
    { value: "trends", label: "Trends", data: recommendations.trends },
  ];
  // Hide empty tabs; if everything is empty keep one so the empty message shows.
  const populated = all.filter((c) => c.data && c.data.length > 0);
  const categories = populated.length > 0 ? populated : all.slice(0, 1);

  return (
    <Tabs defaultValue={categories[0].value} className="w-full">
      <TabsList className="mb-2 h-auto w-full flex-wrap justify-start gap-x-6 gap-y-1 rounded-none border-b border-border bg-transparent p-0">
        {categories.map((cat) => (
          <TabsTrigger
            key={cat.value}
            value={cat.value}
            className="-mb-px rounded-none border-b-2 border-transparent bg-transparent px-0 py-3 text-sm font-semibold text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:border-signal data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            {cat.label}
            <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">{cat.data?.length ?? 0}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((cat) => (
        <TabsContent key={cat.value} value={cat.value} className="mt-0 focus-visible:outline-none">
          {!cat.data || cat.data.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">Nothing to add in this category for this look.</p>
          ) : (
            <ol className="divide-y divide-border">
              {cat.data.map((item, idx) => (
                <motion.li
                  key={idx}
                  className="group grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[2.5rem_1fr_auto]"
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: EASE }}
                >
                  <span className="font-mono text-xs text-muted-foreground sm:pt-2">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <h4 className="font-display text-xl leading-tight">{item.title}</h4>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                  </div>
                  <span
                    className={`label self-start sm:pt-2 ${item.priority === "High" ? "text-signal" : ""}`}
                  >
                    {item.priority}
                  </span>
                </motion.li>
              ))}
            </ol>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
