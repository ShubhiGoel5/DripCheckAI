import { motion } from "framer-motion";
import { EASE } from "@/components/motion/primitives";
import { AIReasoningCard } from "@/components/ai-reasoning/AIReasoningCard";
import { ColorAnalysisCard } from "@/components/color-analysis/ColorAnalysisCard";
import { GarmentDetectionCard } from "@/components/garment-detection/GarmentDetectionCard";
import { RecommendationsCard } from "@/components/recommendations/RecommendationsCard";
import { DripScore, ScoreBreakdown } from "@/components/drip-score/DripScore";
import { StyleClassificationCard } from "@/components/style-classification/StyleClassificationCard";
import { Chapter } from "@/components/layout/Chapter";
import type { VisualAnalysisResult } from "@/types/analysis";
import { PipelineProgress } from "./PipelineProgress";
import { WardrobeSimulator } from "./WardrobeSimulator";
import { FashionCoachCard } from "./FashionCoachCard";

interface AnalysisSectionProps {
  result: VisualAnalysisResult | null;
  isLoading: boolean;
  imageUrl?: string;
  occasion?: string | null;
}

const EMPTY_SCORES = {
  outfitCohesion: 0,
  colorHarmony: 0,
  silhouetteBalance: 0,
  footwearCompatibility: 0,
  accessoryBalance: 0,
  jewelryBalance: 0,
  trendAlignment: 0,
  occasionSuitability: 0,
  personalStyleAlignment: 0,
  overallScore: 0,
};

export const AnalysisSection = ({ result, isLoading, imageUrl, occasion }: AnalysisSectionProps) => {
  // Nothing to show until there's a photo being read or a result to read.
  if (!isLoading && !result) return null;

  const valid = result?.validation?.isValid !== false;

  return (
    <section id="analysis" aria-label="Your read" className="page pb-24 pt-4 lg:pb-32">
      {isLoading && <PipelineProgress />}

      {!isLoading && result && !valid && (
        <div className="animate-rise border-t border-signal pt-4" role="alert">
          <p className="label text-signal">Couldn't read this one</p>
          <p className="display mt-3 max-w-3xl text-3xl sm:text-4xl">{result.validation?.rejectionReason || "This photo didn't work for an outfit check."}</p>
          <p className="mt-5 max-w-md text-sm text-muted-foreground">
            Try a clear, well-lit photo where your whole outfit is in frame, from head to shoes.
          </p>
        </div>
      )}

      {!isLoading && result && valid && (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          {/* Photo — pinned while the report scrolls */}
          {imageUrl && (
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <figure>
                <div className="bg-muted p-3">
                  <motion.img
                    src={imageUrl}
                    alt="Your outfit"
                    className="mx-auto max-h-[42vh] w-full object-contain lg:max-h-[70vh]"
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 1, ease: EASE }}
                  />
                </div>
                {occasion && (
                  <figcaption className="label mt-3 flex justify-between">
                    <span>Occasion</span>
                    <span className="text-foreground">{occasion}</span>
                  </figcaption>
                )}
              </figure>
            </aside>
          )}

          <div className="min-w-0 space-y-16">
            {/* Verdict */}
            <div className="animate-rise">
              <DripScore score={result.scores?.overallScore || 0} confidence={result.scoreConfidence || "Low"} scoresData={result.scores} />
              {result.explainability?.overallExplanation && (
                <p className="mt-8 max-w-2xl font-display text-xl leading-snug sm:text-2xl">
                  {result.explainability.overallExplanation}
                </p>
              )}
              {result.imageScope && <p className="mt-4 max-w-xl text-sm text-muted-foreground">{result.imageScope}</p>}
            </div>

            <Chapter no="01" title="The breakdown" note="Nine things we scored, each out of 100." index={1}>
              <ScoreBreakdown scoresData={result.scores || EMPTY_SCORES} />
            </Chapter>

            <Chapter no="02" title="What's working, what isn't" index={2}>
              <AIReasoningCard
                explainability={result.explainability || { overallExplanation: "", scoreDeductionDetails: "", scoreImprovementDetails: "" }}
                strengths={result.strengths || []}
                weaknesses={result.weaknesses || []}
              />
            </Chapter>

            <Chapter no="03" title="What to change" note="Ordered by how much each one helps." index={3}>
              <RecommendationsCard
                recommendations={result.recommendations || { immediate: [], colors: [], accessories: [], styling: [], trends: [] }}
              />
            </Chapter>

            <Chapter no="04" title="What if" note="Try a change and see where the score lands." index={4}>
              <WardrobeSimulator baseScore={result.scores?.overallScore || 0} scenarios={result.simulation || []} />
            </Chapter>

            <Chapter no="05" title="The pieces" note="What we could see in the photo." index={5}>
              <GarmentDetectionCard garments={result.garments || []} />
            </Chapter>

            <Chapter no="06" title="The palette" index={6}>
              <ColorAnalysisCard
                colorsData={result.colors || { dominantColors: [], accentColors: [], harmonyType: "", harmonyExplanation: "" }}
                harmonyScore={result.scores?.colorHarmony || 0}
              />
            </Chapter>

            <Chapter no="07" title="The style" index={7}>
              <StyleClassificationCard styles={result.aesthetics || []} />
            </Chapter>

            <Chapter no="08" title="Worth knowing" note="The reasoning behind the advice, if you want to learn it." index={8}>
              <FashionCoachCard
                coaching={result.coaching || { fashionPrinciples: [], stylingConcepts: [], colorConcepts: [], silhouetteConcepts: [] }}
              />
            </Chapter>
          </div>
        </div>
      )}
    </section>
  );
};
