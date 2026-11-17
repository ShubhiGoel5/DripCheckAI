import type { StyleClassification } from "@/types/analysis";
import { ScoreBar } from "@/components/ui/ScoreBar";

interface StyleClassificationCardProps {
  styles: StyleClassification[];
}

/** Aesthetic matches, strongest first. The leading one is set large. */
export const StyleClassificationCard = ({ styles }: StyleClassificationCardProps) => {
  const sorted = [...styles].sort((a, b) => b.probability - a.probability);
  const [lead, ...rest] = sorted;

  if (!lead) return <p className="text-sm text-muted-foreground">No clear aesthetic came through.</p>;

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-12">
      <div>
        <p className="label">Reads as</p>
        <p className="display mt-2 text-4xl sm:text-5xl">{lead.label}</p>
        <p className="label mt-3 text-signal">{lead.probability}% match</p>
      </div>

      <ul className="space-y-5">
        {rest.map((s) => (
          <li key={s.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[15px] font-semibold">{s.label}</span>
              <span className="font-mono text-xs tabular text-muted-foreground">{s.probability}%</span>
            </div>
            <ScoreBar value={s.probability} className="mt-2" />
          </li>
        ))}
      </ul>
    </div>
  );
};
