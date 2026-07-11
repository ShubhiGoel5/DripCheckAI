import { AlertTriangle, CheckCircle2, Award, Sparkles, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface AIReasoningCardProps {
  explainability: {
    overallExplanation: string;
    scoreDeductionDetails: string;
    scoreImprovementDetails: string;
  };
  strengths: Array<{ title: string; explanation: string }>;
  weaknesses: Array<{ title: string; explanation: string }>;
}

export const AIReasoningCard = ({ explainability, strengths, weaknesses }: AIReasoningCardProps) => (
  <GlassCard className="p-6">
    <div className="mb-6">
      <p className="text-sm font-black uppercase text-[#784BA0]">Stage 6</p>
      <h3 className="font-display text-3xl font-black text-foreground">Stylist's Reasoning & Critique</h3>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-[#5F4967]">
        A detailed breakdown of why this score was assigned, including constructive feedback and highlights.
      </p>
    </div>

    {/* Overall Comments */}
    <div className="mb-6 space-y-4 rounded-2xl bg-muted/30 p-4 border border-border shadow-sm">
      <div>
        <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#784BA0]">
          <Sparkles className="h-4 w-4 text-[#FF3CAC]" />
          Overall Impression
        </h4>
        <p className="mt-1.5 text-sm font-semibold leading-relaxed text-foreground">
          {explainability.overallExplanation}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 border-t border-border pt-3 text-xs">
        <div>
          <span className="font-black text-[#784BA0] uppercase tracking-wide">Deductions Detail:</span>
          <p className="mt-1 font-semibold text-[#5F4967] leading-relaxed">{explainability.scoreDeductionDetails}</p>
        </div>
        <div>
          <span className="font-black text-[#784BA0] uppercase tracking-wide">Strengths Detail:</span>
          <p className="mt-1 font-semibold text-[#5F4967] leading-relaxed">{explainability.scoreImprovementDetails}</p>
        </div>
      </div>
    </div>

    {/* Strengths & Weaknesses Grids */}
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Strengths */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#17B982]">
          <CheckCircle2 className="h-4 w-4" />
          Outfit Strengths
        </h4>
        {strengths.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-[#17B982]/10 bg-[#17B982]/5 p-3.5 shadow-sm">
            <p className="text-xs font-black text-[#17B982] uppercase tracking-wide">
              {idx + 1}. {item.title}
            </p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#4F3A56]">
              {item.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Weaknesses */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FF8C42]">
          <AlertCircle className="h-4 w-4" />
          Outfit Weaknesses
        </h4>
        {weaknesses.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-[#FF8C42]/20 bg-[#FF8C42]/5 p-3.5 shadow-sm">
            <p className="text-xs font-black text-[#FF8C42] uppercase tracking-wide">
              {idx + 1}. {item.title}
            </p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#4F3A56]">
              {item.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  </GlassCard>
);

