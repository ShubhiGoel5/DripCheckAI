import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Marquee } from "@/components/motion/primitives";
import { AnalysisSection } from "@/components/analysis/AnalysisSection";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OPEN_PROFILE_EVENT, ProfileOnboarding } from "@/components/profile/ProfileOnboarding";
import { UploadSection } from "@/components/upload/UploadSection";
import { OccasionSelectorDialog } from "@/components/upload/OccasionSelectorDialog";
import { HistoryDashboard } from "@/components/history/HistoryDashboard";
import { analyzeOutfitWithGemini, getStoredProfile, saveToAnalysisHistory } from "@/lib/gemini-service";
import type { VisualAnalysisResult } from "@/types/analysis";
import type { UploadedAsset } from "@/types/upload";
import { toast } from "sonner";

const TICKER = ["Score out of 100", "What's working", "What's holding it back", "Colour palette", "What to change", "What-if simulator", "Saved to your archive"];

const Index = () => {
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisualAnalysisResult | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<"stylist" | "history">("stylist");
  const [occasionDialogOpen, setOccasionDialogOpen] = useState(false);

  const scrollToAnalysis = () =>
    setTimeout(() => document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" }), 150);

  const handleAssetSelect = useCallback((asset: UploadedAsset) => {
    setUploadedAsset(asset);
    setAnalysisResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedAsset(null);
    setAnalysisResult(null);
  }, []);

  // Ask for the occasion before analysing
  const handleTriggerAnalyze = useCallback(() => {
    if (!uploadedAsset) return;
    setOccasionDialogOpen(true);
  }, [uploadedAsset]);

  const handleConfirmOccasion = useCallback(
    async (chosenOccasion: string) => {
      if (!uploadedAsset) return;

      setOccasion(chosenOccasion);
      setIsAnalyzing(true);
      scrollToAnalysis();
      try {
        const profile = getStoredProfile();
        const result = await analyzeOutfitWithGemini(uploadedAsset.preview, chosenOccasion, profile);

        setAnalysisResult(result);

        if (result.validation?.isValid === false) {
          toast.error(result.validation?.rejectionReason || "That photo couldn't be read. See details below.");
        } else {
          saveToAnalysisHistory(result, uploadedAsset.preview, chosenOccasion);
          toast.success("Your read is ready.");
          scrollToAnalysis();
        }
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong while analyzing the outfit.");
      } finally {
        setIsAnalyzing(false);
      }
    },
    [uploadedAsset],
  );

  // Load a past analysis into the main viewer
  const handleLoadPastAnalysis = useCallback((analysis: VisualAnalysisResult, imageUrl: string) => {
    setUploadedAsset({ file: new File([], "archived-look"), preview: imageUrl, kind: "image" });
    setAnalysisResult(analysis);
    setActiveView("stylist");
    scrollToAnalysis();
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip text-foreground">
      <SiteHeader activeView={activeView} onViewChange={setActiveView} />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {activeView === "stylist" ? (
              <>
                <UploadSection
                  asset={uploadedAsset}
                  isAnalyzing={isAnalyzing}
                  onAssetSelect={handleAssetSelect}
                  onClear={handleClear}
                  onAnalyze={handleTriggerAnalyze}
                />
                <div className="pb-16 lg:pb-24">
                  <Marquee items={TICKER} />
                </div>
                <ProfileOnboarding />
                <AnalysisSection
                  result={analysisResult}
                  isLoading={isAnalyzing}
                  imageUrl={uploadedAsset?.preview}
                  occasion={occasion}
                />
              </>
            ) : (
              <HistoryDashboard onLoadPastAnalysis={handleLoadPastAnalysis} onBackToStylist={() => setActiveView("stylist")} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <OccasionSelectorDialog
        open={occasionDialogOpen}
        onOpenChange={setOccasionDialogOpen}
        onConfirm={handleConfirmOccasion}
        onOpenProfile={() => {
          setOccasionDialogOpen(false);
          setTimeout(() => window.dispatchEvent(new Event(OPEN_PROFILE_EVENT)), 120);
        }}
      />
    </div>
  );
};

export default Index;
