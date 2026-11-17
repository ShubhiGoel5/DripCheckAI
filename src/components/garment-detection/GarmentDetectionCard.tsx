import type { GarmentDetection } from "@/types/analysis";

interface GarmentDetectionCardProps {
  garments: GarmentDetection[];
}

const CATEGORIES = ["Top Wear", "Bottom Wear", "Footwear", "Accessories", "Jewelry"] as const;

const CATEGORY_LABEL: Record<(typeof CATEGORIES)[number], string> = {
  "Top Wear": "Top",
  "Bottom Wear": "Bottom",
  Footwear: "Shoes",
  Accessories: "Accessories",
  Jewelry: "Jewellery",
};

// Model colour names are free text ("Cream", "Navy Blue"); only show a dot when CSS understands the name.
const toCss = (name: string) => name.toLowerCase().replace(/\s/g, "");
const isCssColor = (name: string) => typeof CSS !== "undefined" && CSS.supports("color", toCss(name));

/** The pieces we could see, one ruled row per category. Missing categories say so. */
export const GarmentDetectionCard = ({ garments }: GarmentDetectionCardProps) => (
  <ul className="border-t border-border">
    {CATEGORIES.map((cat) => {
      const g = garments.find((x) => x.category === cat);
      return (
        <li key={cat} className="grid gap-x-6 gap-y-2 border-b border-border py-4 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline">
          <span className="label">{CATEGORY_LABEL[cat]}</span>

          {g ? (
            <>
              <div>
                <p className="font-display text-xl leading-tight">{g.label}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {g.dominantColor && (
                    <span className="chip">
                      {isCssColor(g.dominantColor) && (
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-foreground/30"
                          style={{ backgroundColor: toCss(g.dominantColor) }}
                          aria-hidden="true"
                        />
                      )}
                      {g.dominantColor}
                    </span>
                  )}
                  {g.material && <span className="chip">{g.material}</span>}
                  {g.pattern && <span className="chip">{g.pattern}</span>}
                  {g.fitType && <span className="chip">{g.fitType} fit</span>}
                </div>
              </div>
              <span className="font-mono text-xs text-muted-foreground tabular sm:text-right">{g.confidence}% sure</span>
            </>
          ) : (
            <p className="text-sm italic text-muted-foreground sm:col-span-2">Not in frame</p>
          )}
        </li>
      );
    })}
  </ul>
);
