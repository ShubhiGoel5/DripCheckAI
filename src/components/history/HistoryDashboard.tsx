import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Clock, Calendar, Star, Trash2, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAnalysisHistory, clearAnalysisHistory } from "@/lib/gemini-service";
import { toast } from "sonner";

interface HistoryDashboardProps {
  onLoadPastAnalysis: (analysis: any, imageUrl: string) => void;
  onBackToStylist: () => void;
}

export const HistoryDashboard = ({ onLoadPastAnalysis, onBackToStylist }: HistoryDashboardProps) => {
  const [history, setHistory] = useState(() => getAnalysisHistory());
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your fashion history?")) {
      clearAnalysisHistory();
      setHistory([]);
      toast.success("Fashion history cleared.");
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Prepare chart data (reverse history to show oldest first)
  const chartData = [...history]
    .reverse()
    .map((item) => ({
      date: new Date(item.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      score: item.analysis.scores.overallScore,
      occasion: item.occasion,
    }));

  // Calculations
  const totalAnalyzed = history.length;
  const avgScore = totalAnalyzed > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.analysis.scores.overallScore, 0) / totalAnalyzed) 
    : 0;

  // Find common weakness & strengths
  const allWeaknesses = history.flatMap((item) => item.analysis.weaknesses.map((w: any) => w.title));
  const weaknessesCount = allWeaknesses.reduce((acc: any, val: string) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  const topWeakness = Object.entries(weaknessesCount)
    .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "None detected yet";

  const allAesthetics = history.flatMap((item) => 
    item.analysis.aesthetics.filter((ae: any) => ae.probability > 40).map((ae: any) => ae.label)
  );
  const aestheticsCount = allAesthetics.reduce((acc: any, val: string) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  const dominantAesthetic = Object.entries(aestheticsCount)
    .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "Undetermined";

  // Generate Insight Statements
  const generateInsight = () => {
    if (totalAnalyzed < 2) {
      return "Upload at least 2 outfits to unlock monthly fashion progression reports and weakness patterns.";
    }

    const scores = history.map((item) => item.analysis.scores.overallScore);
    const difference = scores[0] - scores[scores.length - 1];
    const trendWord = difference >= 0 ? "improved" : "decreased";
    const absDiff = Math.abs(difference);

    let statement = `Your overall outfit styling rating has ${trendWord} by ${absDiff}% since your first analysis. `;
    if (topWeakness !== "None detected yet") {
      statement += `Your most recurring styling bottleneck remains "${topWeakness}". Keep an eye on styling recommendations to counter this. `;
    }
    statement += `Your wardrobe exhibits a strong alignment with the "${dominantAesthetic}" aesthetic archetype.`;
    return statement;
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
        <div>
          <button
            type="button"
            onClick={onBackToStylist}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Stylist
          </button>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none tracking-tight text-foreground">
            Fashion Evolution
          </h2>
        </div>

        {totalAnalyzed > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClearHistory}
            className="h-10 rounded-full border-red-500/20 bg-red-500/10 text-xs font-bold text-red-500 hover:bg-red-500/20 hover:text-red-400 backdrop-blur-md"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>

      {totalAnalyzed === 0 ? (
        <div className="rounded-2xl glass-panel p-12 text-center shadow-lg relative z-10">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-white/5 border border-white/10 shadow-glow backdrop-blur-md">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-3xl font-extrabold text-foreground">No outfits saved yet</h3>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium text-muted-foreground leading-relaxed">
            Analyze outfits, improve your combinations, and save them. Your progression trend line, common style aesthetics, and weekly insights will appear here.
          </p>
          <Button
            type="button"
            onClick={onBackToStylist}
            className="mt-8 h-12 rounded-full px-8 bg-primary text-white hover:bg-primary/90 shadow-glow"
          >
            Analyze First Outfit
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] relative z-10">
          {/* Left Column: Progress Graph & Insight */}
          <div className="space-y-6">
            {/* Chart Card */}
            <div className="rounded-2xl glass-panel p-6 sm:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Rating Progression
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis domain={[0, 100]} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: "rgba(0,0,0,0.8)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                        backdropFilter: "blur(12px)",
                        color: "#fff"
                      }}
                      itemStyle={{ color: "#fff", fontWeight: "600" }}
                      cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#fff", stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Reports Card */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <Star className="h-24 w-24 text-primary" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 relative z-10">
                <Star className="h-4 w-4" />
                Monthly Styling Report
              </h3>
              <p className="text-lg font-medium text-foreground leading-relaxed relative z-10 max-w-2xl">
                {generateInsight()}
              </p>
            </div>
          </div>

          {/* Right Column: Key Stats & List Feed */}
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl glass-panel p-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Fits Evaluated</span>
                <p className="mt-2 text-4xl font-extrabold text-foreground">{totalAnalyzed}</p>
              </div>
              <div className="rounded-2xl glass-panel p-6 text-center border-primary/20 bg-primary/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Average Score</span>
                <p className="mt-2 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">{avgScore}</p>
              </div>
            </div>

            {/* Scrolling Feed */}
            <div className="rounded-2xl glass-panel p-6 flex flex-col max-h-[460px]">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-5 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Outfit Archives
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/20 p-3 hover:bg-white/5 transition-all cursor-pointer hover:border-white/10"
                    onClick={() => onLoadPastAnalysis(item.analysis, item.imageUrl)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt="Past fit preview"
                        className="h-12 w-12 rounded-lg object-cover border border-white/10"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{item.occasion}</p>
                        <p className="text-xs font-medium text-muted-foreground">{formatDate(item.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-foreground border border-white/5">
                        {item.analysis.scores.overallScore}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/10"
                        aria-label="View critique"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
