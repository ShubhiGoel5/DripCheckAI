import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import type { VisualAnalysisResult } from "@/types/analysis";
import { getAnalysisHistory, clearAnalysisHistory, type HistoryItem } from "@/lib/gemini-service";
import { toast } from "sonner";
import { CountUp, Reveal } from "@/components/motion/primitives";

interface HistoryDashboardProps {
  onLoadPastAnalysis: (analysis: VisualAnalysisResult, imageUrl: string) => void;
  onBackToStylist: () => void;
}

const mostCommon = (values: string[]) => {
  const counts = values.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
};

export const HistoryDashboard = ({ onLoadPastAnalysis, onBackToStylist }: HistoryDashboardProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    let mounted = true;
    getAnalysisHistory().then((data) => {
      if (mounted) setHistory(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleClearHistory = () => {
    if (confirm("Clear your whole archive? This can't be undone.")) {
      clearAnalysisHistory();
      setHistory([]);
      toast.success("Archive cleared.");
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  // Oldest first for the chart
  const chartData = [...history].reverse().map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: item.analysis.scores.overallScore,
    occasion: item.occasion,
  }));

  const total = history.length;
  const avgScore = total > 0 ? Math.round(history.reduce((sum, item) => sum + item.analysis.scores.overallScore, 0) / total) : 0;
  const bestScore = total > 0 ? Math.max(...history.map((item) => item.analysis.scores.overallScore)) : 0;

  const topWeakness = mostCommon(history.flatMap((item) => item.analysis.weaknesses.map((w: { title: string }) => w.title)));
  const dominantAesthetic = mostCommon(
    history.flatMap((item) =>
      item.analysis.aesthetics.filter((ae: { probability: number }) => ae.probability > 40).map((ae: { label: string }) => ae.label),
    ),
  );

  const insight = () => {
    if (total < 2) return "Check at least two outfits and this page starts showing your trend and what keeps tripping you up.";
    const scores = history.map((item) => item.analysis.scores.overallScore);
    const diff = scores[0] - scores[scores.length - 1]; // history is newest-first
    const trend = diff >= 0 ? "up" : "down";
    let s = `Your score is ${trend} ${Math.abs(diff)} points since the first check. `;
    if (topWeakness) s += `The thing that keeps coming back: “${topWeakness}.” `;
    if (dominantAesthetic) s += `Your wardrobe leans ${dominantAesthetic}.`;
    return s;
  };

  return (
    <section className="page pb-24 pt-10 md:pt-14">
      <button
        type="button"
        onClick={onBackToStylist}
        className="label inline-flex items-center gap-2 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back
      </button>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="display text-[clamp(3rem,7vw,5.5rem)]">Archive</h2>
        {total > 0 && (
          <button type="button" onClick={handleClearHistory} className="link pb-3 text-sm font-medium">
            Clear archive
          </button>
        )}
      </div>

      {total === 0 ? (
        <div className="mt-10 border-t border-foreground pt-8">
          <p className="display max-w-2xl text-3xl sm:text-4xl">Nothing here yet.</p>
          <p className="mt-4 max-w-md text-muted-foreground">
            Every outfit you check is saved on this device. Come back after a few and you'll see your trend.
          </p>
          <button type="button" onClick={onBackToStylist} className="btn-solid mt-8">
            Check your first fit
          </button>
        </div>
      ) : (
        <>
          {/* Numbers */}
          <dl className="mt-10 grid grid-cols-3 border-y border-foreground">
            {[
              ["Fits checked", total],
              ["Average", avgScore],
              ["Best", bestScore],
            ].map(([label, value], i) => (
              <div key={label} className={`py-5 ${i > 0 ? "border-l border-border pl-5 sm:pl-8" : ""}`}>
                <dt className="label">{label}</dt>
                <dd className="display tabular mt-1 text-5xl sm:text-6xl">
                  <CountUp value={Number(value)} duration={1.4} onView={false} />
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <p className="label mb-4">Score over time</p>
              <div className="h-72 w-full" role="img" aria-label="Line chart of your overall score over time">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="hsl(30 14% 76%)" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(28 8% 36%)" fontSize={11} tickLine={false} axisLine={{ stroke: "hsl(24 16% 8%)" }} dy={8} />
                    <YAxis domain={[0, 100]} stroke="hsl(28 8% 36%)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 0,
                        border: "1px solid hsl(24 16% 8%)",
                        backgroundColor: "hsl(42 40% 97%)",
                        boxShadow: "none",
                        fontSize: 12,
                      }}
                      cursor={{ stroke: "hsl(24 16% 8%)", strokeWidth: 1 }}
                    />
                    <Line
                      type="linear"
                      dataKey="score"
                      stroke="hsl(24 16% 8%)"
                      strokeWidth={2}
                      dot={{ r: 3.5, fill: "hsl(24 16% 8%)", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "hsl(12 84% 47%)", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <blockquote className="mt-10 border-l-2 border-signal pl-6">
                <p className="label mb-3">The pattern</p>
                <p className="font-display text-xl leading-snug sm:text-2xl">{insight()}</p>
              </blockquote>
            </div>

            {/* Contact sheet */}
            <div>
              <p className="label mb-4">All checks · newest first</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-2">
                {history.map((item, i) => (
                  <Reveal as="li" key={item.id} delay={(i % 4) * 0.07} y={18}>
                    <button
                      type="button"
                      onClick={() => onLoadPastAnalysis(item.analysis, item.imageUrl)}
                      className="group block w-full text-left"
                      aria-label={`Open ${item.occasion} look, score ${item.analysis.scores.overallScore}`}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span className="absolute left-0 top-0 bg-background px-2 py-1 font-mono text-xs tabular">
                          {item.analysis.scores.overallScore}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-tight group-hover:text-signal">{item.occasion}</p>
                      <p className="label mt-0.5">{formatDate(item.timestamp)}</p>
                    </button>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
