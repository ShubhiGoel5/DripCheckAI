require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Analysis = require('./models/Analysis');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Need a larger payload limit because we are sending base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error: ", err));
} else {
  console.log("MONGO_URI is missing, skipping MongoDB connection");
}

// Route: Get History
app.get('/api/history', async (req, res) => {
  try {
    const history = await Analysis.find().sort({ timestamp: -1 });
    // Transform _id to id so frontend works identically
    const mapped = history.map(item => ({
      id: item._id,
      timestamp: item.timestamp,
      occasion: item.occasion,
      imageUrl: item.imageUrl,
      analysis: item.analysis
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Save to History
app.post('/api/history', async (req, res) => {
  try {
    const newAnalysis = new Analysis({
      occasion: req.body.occasion,
      imageUrl: req.body.imageUrl,
      analysis: req.body.analysis
    });
    const saved = await newAnalysis.save();
    res.json({ success: true, id: saved._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Clear History
app.delete('/api/history', async (req, res) => {
  try {
    await Analysis.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Analyze Image (Proxy to Gemini)
app.post('/api/analyze', async (req, res) => {
  try {
    const { imageDataUrl, occasion, profile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API Key missing in backend" });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Extract mime type and base64 data from the data URL
    const mimeTypeMatch = imageDataUrl.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");

    const systemPrompt = `You are a professional senior fashion stylist, fashion critic, and expert wardrobe consultant. 
You are tasked with analyzing a user's outfit image and returning a comprehensive, structured evaluation in JSON format.

First, perform the validation checks:
- The image must contain a human being showing their outfit.
- The image must not be extremely dark or blurry.
- The image must show a substantial portion of the outfit.
- Strict Rejections: Reject face-only selfies, cropped selfies, images where the lower body is not visible, or images where major outfit elements are hidden. (Footwear is optional and not strictly required).
- If the image fails these parameters, set validation.isValid = false, explain the specific reason in validation.rejectionReason (e.g. "Full-body image required. Please upload an image showing your complete outfit."), and leave other fields empty.

If the image is valid, perform the analysis taking into account the user's profile and selected occasion:
USER PROFILE:
- Gender: ${profile.gender}
- Age Range: ${profile.ageRange}
- Height: ${profile.height}
- Body Type: ${profile.bodyType}
- Experience Level: ${profile.experience}
- Style Preference: ${profile.stylePreferences.join(", ")}

OCCASION FOR THIS OUTFIT:
- Occasion: ${occasion}

ANALYSIS GUIDELINES:
1. Detect all visible garments: upper body, lower body, dresses, footwear, accessories, jewelry. For each, return category, label, confidence, dominant color, secondary colors, material, pattern, and fit type.
2. Analyze colors: harmony type, dominant/accent colors, and color explanation.
3. Analyze silhouette: proportions, silhouette shape, length/width balance, fit balance, layering, structure, and body-type specific balance explanation.
4. Evaluate footwear: formality consistency, style compatibility, and color compatibility.
5. Evaluate accessories & jewelry: visual balance, focal points, and accessories status.
6. Aesthetic classification: predict confidence percentages for styles.
7. Outfit Weaknesses (Exactly 3 items).
8. Outfit Strengths (Exactly 3 items).
9. Scoring (0-100): Cohesion, Color Harmony, Silhouette Balance, Footwear Compatibility, Accessory Balance, Jewelry Balance, Trend Alignment, Occasion Suitability, Personal Style Alignment, and Overall Score.
10. Recommendations: immediate tweaks, colors, accessories, styling, and trends.
11. Wardrobe Simulation: 3-5 incremental scenarios demonstrating how small changes affect the score.
12. Fashion Coach lessons: explain 2-4 actionable concepts.

You MUST respond with a JSON object. Return only the raw JSON. The JSON must EXACTLY match the following TypeScript interface structure:

\`\`\`typescript
interface DetailedGeminiAnalysis {
  validation: { isValid: boolean; rejectionReason: string | null; };
  imageScope: string;
  scoreConfidence: "High" | "Medium" | "Low";
  garments: Array<{ id: string; label: string; category: "Top Wear" | "Bottom Wear" | "Footwear" | "Accessories" | "Jewelry"; confidence: number; visibility: "visible" | "not_visible"; dominantColor: string; secondaryColors: string[]; material: string; pattern: string; fitType: string; }>;
  colors: { dominantColors: Array<{ name: string; hex: string; percentage: number; }>; accentColors: string[]; harmonyType: string; harmonyExplanation: string; };
  silhouette: { proportions: string; silhouetteType: string; lengthBalance: string; widthBalance: string; fitBalance: string; layeringEffectiveness: string; structure: string; explanation: string; };
  footwear: { formalityConsistency: string; styleConsistency: string; colorCompatibility: string; trendCompatibility: string; explanation: string; };
  accessories: { visualBalance: string; focalPoints: string; coordination: string; status: "Under-accessorized" | "Balanced" | "Over-accessorized"; explanation: string; };
  aesthetics: Array<{ label: string; probability: number; }>;
  strengths: Array<{ title: string; explanation: string; }>;
  weaknesses: Array<{ title: string; explanation: string; }>;
  scores: { outfitCohesion: number; colorHarmony: number; silhouetteBalance: number; footwearCompatibility: number; accessoryBalance: number; jewelryBalance: number; trendAlignment: number; occasionSuitability: number; personalStyleAlignment: number; overallScore: number; };
  explainability: { overallExplanation: string; scoreDeductionDetails: string; scoreImprovementDetails: string; };
  recommendations: { immediate: Array<{ title: string; detail: string; priority: "High" | "Medium" | "Low"; }>; colors: Array<{ title: string; detail: string; priority: "High" | "Medium" | "Low"; }>; accessories: Array<{ title: string; detail: string; priority: "High" | "Medium" | "Low"; }>; styling: Array<{ title: string; detail: string; priority: "High" | "Medium" | "Low"; }>; trends: Array<{ title: string; detail: string; priority: "High" | "Medium" | "Low"; }>; };
  simulation: Array<{ scenario: string; projectedScore: number; explanation: string; }>;
  coaching: { fashionPrinciples: string[]; stylingConcepts: string[]; colorConcepts: string[]; silhouetteConcepts: string[]; };
}
\`\`\``

    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let response;
    let lastError;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting to generate content with model: ${modelName}`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: [
            { 
              role: 'user', 
              parts: [
                { text: systemPrompt },
                { inlineData: { mimeType: mimeType, data: base64Data } }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.1,
          }
        });
        
        // If successful, break out of the loop
        break;
      } catch (err) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    if (!response) {
      throw new Error(`All fallback models failed. Last error: ${lastError?.message}`);
    }

    const textResult = response.text;

    if (!textResult) throw new Error("No response received from Gemini.");

    let cleanedJson = textResult.trim();
    if (cleanedJson.startsWith("```json")) {
      cleanedJson = cleanedJson.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (cleanedJson.startsWith("```")) {
      cleanedJson = cleanedJson.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    const parsed = JSON.parse(cleanedJson);
    res.json(parsed);

  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

module.exports = app;
