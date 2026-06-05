import { Eye, Network, Wand2, BookOpen } from "lucide-react";
import { AIReasoningCard } from "@/components/ai-reasoning/AIReasoningCard";
import { ColorAnalysisCard } from "@/components/color-analysis/ColorAnalysisCard";
import { GarmentDetectionCard } from "@/components/garment-detection/GarmentDetectionCard";
import { RecommendationsCard } from "@/components/recommendations/RecommendationsCard";
import { DripScore } from "@/components/drip-score/DripScore";
import { StyleClassificationCard } from "@/components/style-classification/StyleClassificationCard";
import type { VisualAnalysisResult, OutfitCompositionItem } from "@/types/analysis";
import { OutfitCompositionCard } from "./OutfitCompositionCard";
import { PipelineProgress } from "./PipelineProgress";
import { PipelineShell } from "./PipelineShell";
import { WardrobeSimulator } from "./WardrobeSimulator";
import { FashionCoachCard } from "./FashionCoachCard";

interface AnalysisSectionProps {
  result: VisualAnalysisResult | null;
  isLoading: boolean;
}

export const AnalysisSection = ({ result, isLoading }: AnalysisSectionProps) => {
  // Dynamically compute the composition list from the garments detected by Gemini
  const computedComposition: OutfitCompositionItem[] = result
    ? (["Top Wear", "Bottom Wear", "Footwear", "Accessories", "Jewelry"] as const).map((cat) => {
        const matched = result.garments.find((g) => g.category === cat);
        return {
          category: cat,
          item: matched ? matched.label : "Not visible",
          confidence: matched ? matched.confidence : 0,
          visibility: matched ? "visible" : "not_visible",
          note: matched
            ? `Detected a ${matched.label.toLowerCase()} in ${matched.dominantColor} (${matched.material}, ${matched.pattern} pattern, ${matched.fitType} fit).`
            : `No visible ${cat.toLowerCase()} was recognized in the uploaded fit photo.`,
        };
      })
    : [];

  return (
    <section id="analysis" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20 relative">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between relative z-10">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Network className="h-4 w-4 text-primary" aria-hidden="true" />
            Visual Analysis Pipeline
          </p>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-foreground">
            See every decision.
          </h2>
        </div>
        <p className="max-w-md text-lg font-medium leading-relaxed text-muted-foreground pb-2">
          The interface surfaces detection, color extraction, classification, scoring, and reasoning as structured data.
        </p>
      </div>

      {isLoading && <PipelineProgress />}

      {!isLoading && !result && (
        <div className="rounded-2xl glass-panel p-10 sm:p-16 text-center shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-white/5 border border-white/10 shadow-glow backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
              <Eye className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-white mb-4">Upload a look to reveal the pipeline.</h3>
            <p className="mx-auto max-w-xl text-base text-muted-foreground">
              Garments, colors, style probabilities, score logic, and recommendations will appear here as structured outputs.
            </p>
          </div>
        </div>
      )}

      {!isLoading && result && (
        <div className="space-y-8 relative z-10">
          {/* Validation pre-check notification */}
          <div className={`rounded-xl border p-5 shadow-sm backdrop-blur-md ${
            result.validation.isValid ? "bg-white/5 border-white/10" : "bg-red-500/10 border-red-500/30"
          }`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${result.validation.isValid ? "text-primary" : "text-red-400"}`}>
              {result.validation.isValid ? "Visibility Guardrail" : "Pre-Validation Rejection Alert"}
            </p>
            <p className="mt-2 text-base font-medium leading-relaxed text-foreground">
              {result.validation.isValid ? result.imageScope : result.validation.rejectionReason}
            </p>
          </div>

          {result.validation.isValid && (
            <>
              {/* Grid Stage 1 & 2 */}
              <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
                <PipelineShell index={0}>
                  <GarmentDetectionCard garments={result.garments} />
                </PipelineShell>
                <PipelineShell index={1}>
                  <ColorAnalysisCard colorsData={result.colors} harmonyScore={result.scores.colorHarmony} />
                </PipelineShell>
              </div>

              {/* Grid Stage 3 & 4 */}
              <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                <PipelineShell index={2}>
                  <StyleClassificationCard styles={result.aesthetics} />
                </PipelineShell>
                <PipelineShell index={3}>
                  <OutfitCompositionCard items={computedComposition} />
                </PipelineShell>
              </div>

              {/* Grid Stage 5 & 6 */}
              <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
                <PipelineShell index={4}>
                  <div className="rounded-2xl glass-panel p-6 sm:p-8 flex flex-col justify-between h-full">
                    <div>
                      <p className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                        <Wand2 className="h-4 w-4" aria-hidden="true" />
                        Stage 5: Drip Breakdown
                      </p>
                      <DripScore score={result.scores.overallScore} confidence={result.scoreConfidence} scoresData={result.scores} />
                    </div>
                  </div>
                </PipelineShell>
                <PipelineShell index={5}>
                  <AIReasoningCard
                    explainability={result.explainability}
                    strengths={result.strengths}
                    weaknesses={result.weaknesses}
                  />
                </PipelineShell>
              </div>

              {/* Recommendations Stage 7 */}
              <PipelineShell index={6}>
                <RecommendationsCard recommendations={result.recommendations} />
              </PipelineShell>

              {/* Interactive Simulation & Coaching: Stages 8 & 9 */}
              <div className="grid gap-6 lg:grid-cols-2">
                <PipelineShell index={7}>
                  <WardrobeSimulator baseScore={result.scores.overallScore} scenarios={result.simulation} />
                </PipelineShell>
                <PipelineShell index={8}>
                  <FashionCoachCard coaching={result.coaching} />
                </PipelineShell>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};


