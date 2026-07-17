import { useCallback, useState } from "react";
import { AnalysisSection } from "@/components/analysis/AnalysisSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RunwaySection } from "@/components/runway/RunwaySection";
import { ProfileOnboarding } from "@/components/profile/ProfileOnboarding";
import { UploadSection } from "@/components/upload/UploadSection";
import { OccasionSelectorDialog } from "@/components/upload/OccasionSelectorDialog";
import { HistoryDashboard } from "@/components/history/HistoryDashboard";
import { analyzeOutfitWithGemini, getStoredProfile, saveToAnalysisHistory } from "@/lib/gemini-service";
import type { VisualAnalysisResult } from "@/types/analysis";
import type { UploadedAsset } from "@/types/upload";
import { toast } from "sonner";


const Index = () => {
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisualAnalysisResult | null>(null);

  // Layout and dialog states
  const [activeView, setActiveView] = useState<"stylist" | "history">("stylist");
  const [occasionDialogOpen, setOccasionDialogOpen] = useState(false);

  const handleAssetSelect = useCallback((asset: UploadedAsset) => {
    setUploadedAsset(asset);
    setAnalysisResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedAsset(null);
    setAnalysisResult(null);
  }, []);

  // Intercept analysis to ask for occasion
  const handleTriggerAnalyze = useCallback(() => {
    if (!uploadedAsset) return;
    setOccasionDialogOpen(true);
  }, [uploadedAsset]);

  // Execute Gemini analysis with occasion and profile
  const handleConfirmOccasion = useCallback(async (occasion: string) => {
    if (!uploadedAsset) return;

    setIsAnalyzing(true);
    try {
      const profile = getStoredProfile();
      const result = await analyzeOutfitWithGemini(uploadedAsset.preview, occasion, profile);
      
      setAnalysisResult(result);

      if (result.validation?.isValid === false) {
        toast.error(result.validation?.rejectionReason || "Outfit validation rejected. See details below.");
      } else {
        // Save to history on success
        saveToAnalysisHistory(result, uploadedAsset.preview, occasion);
        toast.success("Visual analysis complete! Outfit critique generated.");
        
        // Scroll down to analysis results
        setTimeout(() => {
          document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } catch (error) {
      toast.error((error as Error).message || "An unexpected error occurred during outfit analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedAsset]);

  // Load a historical analysis into the main viewer
  const handleLoadPastAnalysis = useCallback((analysis: VisualAnalysisResult, imageUrl: string) => {
    setUploadedAsset({
      file: new File([], "archived-look"),
      preview: imageUrl,
      kind: "image",
    });
    setAnalysisResult(analysis);
    setActiveView("stylist");
    
    setTimeout(() => {
      document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden paper-grain text-foreground">
      <SiteHeader
        activeView={activeView}
        onViewChange={setActiveView}
      />
      <main>
        {activeView === "stylist" ? (
          <>
            <HeroSection />
            <ProfileOnboarding />
            <UploadSection
              asset={uploadedAsset}
              isAnalyzing={isAnalyzing}
              onAssetSelect={handleAssetSelect}
              onClear={handleClear}
              onAnalyze={handleTriggerAnalyze}
            />
            <AnalysisSection result={analysisResult} isLoading={isAnalyzing} imageUrl={uploadedAsset?.preview} />
            <RunwaySection />
          </>
        ) : (
          <HistoryDashboard
            onLoadPastAnalysis={handleLoadPastAnalysis}
            onBackToStylist={() => setActiveView("stylist")}
          />
        )}
      </main>
      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="text-sm font-medium text-foreground/50">
            DripCheckAI keeps the focus on fashion, confidence, and self-expression.
          </p>
          <nav className="flex items-center gap-4" aria-label="Footer navigation">
            <a href="#upload" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">Check Fit</a>
            <a href="#profile-onboarding" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">My Profile</a>
            <a href="#analysis" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">Analysis</a>
          </nav>
        </div>
      </footer>

      {/* Global Modals */}
      <OccasionSelectorDialog
        open={occasionDialogOpen}
        onOpenChange={setOccasionDialogOpen}
        onConfirm={handleConfirmOccasion}
        onOpenProfile={() => {
          setOccasionDialogOpen(false);
          // TODO: scroll to static profile onboarding section
          document.getElementById("profile-onboarding")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default Index;

