export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface GarmentDetection {
  id: string;
  label: string;
  category: "Top Wear" | "Bottom Wear" | "Footwear" | "Accessories" | "Jewelry";
  confidence: number;
  visibility: "visible" | "not_visible";
  dominantColor: string;
  secondaryColors: string[];
  material: string;
  pattern: string;
  fitType: string;
}

export interface ColorSignal {
  name: string;
  hex: string;
  percentage: number;
}

export interface StyleClassification {
  label: string;
  probability: number;
}

export interface OutfitCompositionItem {
  category: "Top Wear" | "Bottom Wear" | "Footwear" | "Accessories" | "Jewelry";
  item: string;
  confidence: number;
  note: string;
  visibility: "visible" | "not_visible";
}

export interface ScoreFactor {
  label: string;
  detail: string;
  impact: "positive" | "warning";
}

export interface Recommendation {
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
}

export interface DetailedGeminiAnalysis {
  validation: {
    isValid: boolean;
    rejectionReason: string | null;
  };
  imageScope: string;
  scoreConfidence: ConfidenceLevel;
  
  garments: GarmentDetection[];
  
  colors: {
    dominantColors: ColorSignal[];
    accentColors: string[];
    harmonyType: string;
    harmonyExplanation: string;
  };
  
  silhouette: {
    proportions: string;
    silhouetteType: string;
    lengthBalance: string;
    widthBalance: string;
    fitBalance: string;
    layeringEffectiveness: string;
    structure: string;
    explanation: string;
  };
  
  footwear: {
    formalityConsistency: string;
    styleConsistency: string;
    colorCompatibility: string;
    trendCompatibility: string;
    explanation: string;
  };
  
  accessories: {
    visualBalance: string;
    focalPoints: string;
    coordination: string;
    status: "Under-accessorized" | "Balanced" | "Over-accessorized";
    explanation: string;
  };

  aesthetics: StyleClassification[];

  strengths: Array<{
    title: string;
    explanation: string;
  }>;
  
  weaknesses: Array<{
    title: string;
    explanation: string;
  }>;

  scores: {
    outfitCohesion: number;
    colorHarmony: number;
    silhouetteBalance: number;
    footwearCompatibility: number;
    accessoryBalance: number;
    jewelryBalance: number;
    trendAlignment: number;
    occasionSuitability: number;
    personalStyleAlignment: number;
    overallScore: number;
  };

  explainability: {
    overallExplanation: string;
    scoreDeductionDetails: string;
    scoreImprovementDetails: string;
  };

  recommendations: {
    immediate: Recommendation[];
    colors: Recommendation[];
    accessories: Recommendation[];
    styling: Recommendation[];
    trends: Recommendation[];
  };

  simulation: Array<{
    scenario: string;
    projectedScore: number;
    explanation: string;
  }>;

  coaching: {
    fashionPrinciples: string[];
    stylingConcepts: string[];
    colorConcepts: string[];
    silhouetteConcepts: string[];
  };
}

export type VisualAnalysisResult = DetailedGeminiAnalysis;

