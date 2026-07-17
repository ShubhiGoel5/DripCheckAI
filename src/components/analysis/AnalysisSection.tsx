import { Eye, Network, Wand2 } from "lucide-react";
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
  imageUrl?: string;
}

export const AnalysisSection = ({ result, isLoading, imageUrl }: AnalysisSectionProps) => {
  // Dynamically compute the composition list from the garments detected by Gemini
  const computedComposition: OutfitCompositionItem[] = result
    ? (["Top Wear", "Bottom Wear", "Footwear", "Accessories", "Jewelry"] as const).map((cat) => {
        const matched = (result.garments || []).find((g) => g.category === cat);
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
        <div className="rounded-2xl bg-card/70 border border-border backdrop-blur-xl p-10 sm:p-16 text-center shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-muted border border-border shadow-sm transition-transform duration-500 group-hover:scale-110">
              <Eye className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-4">Upload a look to reveal the pipeline.</h3>
            <p className="mx-auto max-w-xl text-base text-muted-foreground">
              Garments, colors, style probabilities, score logic, and recommendations will appear here as structured outputs.
            </p>
          </div>
        </div>
      )}

      {!isLoading && result && (
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] xl:grid-cols-[450px_1fr] relative z-10">
          
          {/* Left Column: Original Uploaded Image — desktop sticky sidebar */}
          {imageUrl && (
            <div className="space-y-6 hidden lg:block">
              <div className="sticky top-24 rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <img
                  src={imageUrl}
                  alt="Uploaded fit"
                  className="w-full h-auto max-h-[80vh] object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          )}

          {/* Mobile: compact image preview above results */}
          {imageUrl && (
            <div className="lg:hidden mb-2">
              <div className="rounded-2xl overflow-hidden border border-border shadow-md">
                <img
                  src={imageUrl}
                  alt="Uploaded fit"
                  className="w-full max-h-[40vh] object-contain"
                />
              </div>
            </div>
          )}

          {/* Right Column: Pipeline Results */}
          <div className="space-y-8">
            {/* Validation pre-check notification */}
            <div className={`rounded-xl border p-5 shadow-sm backdrop-blur-md ${
              result.validation?.isValid !== false ? "bg-white/5 border-white/10" : "bg-red-500/10 border-red-500/30"
            }`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${result.validation?.isValid !== false ? "text-primary" : "text-red-400"}`}>
                {result.validation?.isValid !== false ? "Visibility Guardrail" : "Pre-Validation Rejection Alert"}
              </p>
              <p className="mt-2 text-base font-medium leading-relaxed text-foreground">
                {result.validation?.isValid !== false ? result.imageScope : result.validation?.rejectionReason}
              </p>
            </div>

            {result.validation?.isValid !== false && (
              <>
                {/* Grid Stage 1 & 2 */}
                <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
                  <PipelineShell index={0}>
                    <GarmentDetectionCard garments={result.garments || []} />
                  </PipelineShell>
                  <PipelineShell index={1}>
                    <ColorAnalysisCard colorsData={result.colors || { dominantColors: [], accentColors: [], harmonyType: "", harmonyExplanation: "" }} harmonyScore={result.scores?.colorHarmony || 0} />
                  </PipelineShell>
                </div>

              {/* Grid Stage 3 & 4 */}
              <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                <PipelineShell index={2}>
                  <StyleClassificationCard styles={result.aesthetics || []} />
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
                      <DripScore 
                        score={result.scores?.overallScore || 0} 
                        confidence={result.scoreConfidence || "Low"} 
                        scoresData={result.scores || {
                          outfitCohesion: 0,
                          colorHarmony: 0,
                          silhouetteBalance: 0,
                          footwearCompatibility: 0,
                          accessoryBalance: 0,
                          jewelryBalance: 0,
                          trendAlignment: 0,
                          occasionSuitability: 0,
                          personalStyleAlignment: 0,
                          overallScore: 0
                        }} 
                      />
                    </div>
                  </div>
                </PipelineShell>
                <PipelineShell index={5}>
                  <AIReasoningCard
                    explainability={result.explainability || { overallExplanation: "", scoreDeductionDetails: "", scoreImprovementDetails: "" }}
                    strengths={result.strengths || []}
                    weaknesses={result.weaknesses || []}
                  />
                </PipelineShell>
              </div>

              {/* Recommendations Stage 7 */}
              <PipelineShell index={6}>
                <RecommendationsCard recommendations={result.recommendations || { immediate: [], colors: [], accessories: [], styling: [], trends: [] }} />
              </PipelineShell>

              {/* Interactive Simulation & Coaching: Stages 8 & 9 */}
              <div className="grid gap-6 lg:grid-cols-2">
                <PipelineShell index={7}>
                  <WardrobeSimulator baseScore={result.scores?.overallScore || 0} scenarios={result.simulation || []} />
                </PipelineShell>
                <PipelineShell index={8}>
                  <FashionCoachCard coaching={result.coaching || { fashionPrinciples: [], stylingConcepts: [], colorConcepts: [], silhouetteConcepts: [] }} />
                </PipelineShell>
              </div>
            </>
          )}
          </div>
        </div>
      )}
    </section>
  );
};

