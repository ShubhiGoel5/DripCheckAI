import { ScoreBar } from "@/components/ui/ScoreBar";
import { CountUp, Reveal } from "@/components/motion/primitives";

interface DripScoreProps {
  score: number;
  confidence?: string;
  scoresData?: {
    outfitCohesion: number;
    colorHarmony: number;
    silhouetteBalance: number;
    footwearCompatibility: number;
    accessoryBalance: number;
    jewelryBalance: number;
    trendAlignment: number;
    occasionSuitability: number;
    personalStyleAlignment: number;
  };
}

const bandFor = (score: number) => {
  if (score >= 85) return "Exceptional";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Solid, with room to move";
  if (score >= 40) return "Needs work";
  return "Back to the drawing board";
};

/** The headline number. Big serif numeral, one line of context. */
export const DripScore = ({ score, confidence = "High" }: DripScoreProps) => (
  <div role="status" aria-label={`Overall score ${score} out of 100, confidence ${confidence}`}>
    <p className="label">Overall score</p>
    <div className="mt-2 flex items-end gap-3">
      <CountUp value={score} duration={1.8} onView={false} className="display tabular text-[clamp(4.5rem,9vw,7rem)] leading-[0.8]" />
      <span className="label pb-3 sm:pb-5">/ 100</span>
    </div>
    <p className="mt-5 font-display text-xl leading-tight sm:text-2xl">{bandFor(score)}</p>
    <p className="label mt-2">Confidence · {confidence}</p>
  </div>
);

interface BreakdownProps {
  scoresData: NonNullable<DripScoreProps["scoresData"]>;
}

export const ScoreBreakdown = ({ scoresData }: BreakdownProps) => {
  const rows = [
    { label: "Cohesion", value: scoresData.outfitCohesion, desc: "How well the pieces read as one outfit." },
    { label: "Colour harmony", value: scoresData.colorHarmony, desc: "Palette relationships and contrast." },
    { label: "Silhouette", value: scoresData.silhouetteBalance, desc: "Proportion, volume and length." },
    { label: "Footwear", value: scoresData.footwearCompatibility, desc: "Formality and colour match with the shoes." },
    { label: "Accessories", value: scoresData.accessoryBalance, desc: "Visual weight and coordination." },
    { label: "Jewellery", value: scoresData.jewelryBalance, desc: "Placement and metal consistency." },
    { label: "Trend", value: scoresData.trendAlignment, desc: "How current it feels. Low weight overall." },
    { label: "Occasion", value: scoresData.occasionSuitability, desc: "Fit for where you're going." },
    { label: "Personal style", value: scoresData.personalStyleAlignment, desc: "Match with the looks in your profile." },
  ];

  return (
    <dl className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
      {rows.map((r, i) => (
        <Reveal key={r.label} delay={(i % 2) * 0.08} y={14}>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[15px] font-semibold">{r.label}</dt>
            <dd className="font-mono text-sm tabular">
              <CountUp value={r.value} duration={1.1} />
            </dd>
          </div>
          <ScoreBar value={r.value} className="mt-2" delay={(i % 2) * 0.08} />
          <p className="mt-1.5 text-xs text-muted-foreground">{r.desc}</p>
        </Reveal>
      ))}
    </dl>
  );
};
