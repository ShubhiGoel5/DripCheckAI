import type { DetailedGeminiAnalysis } from "@/types/analysis";

export interface UserProfile {
  gender: string;
  ageRange: string;
  height: string;
  bodyType: "Rectangle" | "Triangle" | "Inverted Triangle" | "Pear" | "Hourglass" | "Athletic";
  experience: "Beginner" | "Intermediate" | "Advanced";
  stylePreferences: string[];
}

// --- Storage helpers ---

export const getStoredProfile = (): UserProfile => {
  const defaults: UserProfile = {
    gender: "Unspecified",
    ageRange: "20-29",
    height: "175cm",
    bodyType: "Rectangle",
    experience: "Beginner",
    stylePreferences: ["Smart Casual", "Minimalist"],
  };
  
  const saved = localStorage.getItem("dripcheck_user_profile");
  if (!saved) return defaults;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return defaults;
  }
};

export const setStoredProfile = (profile: UserProfile): void => {
  localStorage.setItem("dripcheck_user_profile", JSON.stringify(profile));
};


export interface HistoryItem {
  id: string;
  timestamp: string;
  imageUrl: string;
  occasion: string;
  analysis: DetailedGeminiAnalysis;
}

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

export const getAnalysisHistory = async (): Promise<HistoryItem[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/history`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return await res.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};

export const saveToAnalysisHistory = async (analysis: DetailedGeminiAnalysis, imageUrl: string, occasion: string): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysis, imageUrl, occasion })
    });
    if (!res.ok) throw new Error("Failed to save history");
  } catch (error) {
    console.error("Error saving history:", error);
  }
};

export const clearAnalysisHistory = async (): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/history`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to clear history");
  } catch (error) {
    console.error("Error clearing history:", error);
  }
};

export const analyzeOutfitWithGemini = async (
  imageDataUrl: string,
  occasion: string,
  profile: UserProfile
): Promise<DetailedGeminiAnalysis> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imageDataUrl,
        occasion,
        profile
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error || `Backend Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing outfit:", error);
    throw error;
  }
};
