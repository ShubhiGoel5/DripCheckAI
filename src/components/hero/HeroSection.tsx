import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Upload, ScanLine, Trophy } from "lucide-react";

const HOW_IT_WORKS = [
  { step: "1", icon: Upload, label: "Upload your fit" },
  { step: "2", icon: ScanLine, label: "AI scans every detail" },
  { step: "3", icon: Trophy, label: "Get your Drip Score" },
];

export const HeroSection = () => (
  <section
    aria-labelledby="hero-heading"
    className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-10 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 relative"
  >
    {/* Background Glow */}
    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] -z-10 pointer-events-none" />

    <div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        AI Personal Fashion Stylist
      </motion.div>

      <motion.h1
        id="hero-heading"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.16 }}
        className="max-w-5xl text-[clamp(3rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-foreground"
      >
        Dress Better.
        <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-400 pb-2">
          Stand Out.
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.28 }}
        className="mt-6 max-w-xl space-y-2"
      >
        <p className="text-lg font-semibold leading-relaxed text-foreground/80 sm:text-xl">
          Upload your outfit and get a professional stylist critique in seconds.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          Garment detection, color harmony analysis, actionable recommendations, and a personalized Drip Score — all powered by Gemini AI.
        </p>
      </motion.div>

      {/* How it works strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.36 }}
        className="mt-8 flex flex-wrap items-center gap-2"
        aria-label="How it works"
      >
        {HOW_IT_WORKS.map(({ step, icon: Icon, label }, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-xs">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/15 text-[10px] font-black text-primary">
                {step}
              </span>
              <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {label}
            </div>
            {i < HOW_IT_WORKS.length - 1 && (
              <span className="text-border text-xs font-bold select-none" aria-hidden="true">→</span>
            )}
          </div>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.44 }}
        className="mt-8 flex flex-wrap items-center gap-4"
      >
        {/* Primary CTA — large and unmissable */}
        <a
          href="#upload"
          className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-10 text-base font-bold text-white shadow-glow transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Start analyzing your outfit"
        >
          Run Free Analysis
          <ArrowDown className="h-5 w-5" aria-hidden="true" />
        </a>
        {/* Secondary — text link style, clearly subordinate */}
        <a
          href="#profile-onboarding"
          className="text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors"
        >
          Personalize my results →
        </a>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.22, ease: "easeOut" }}
      className="relative mx-auto min-h-[380px] w-full max-w-[520px] lg:min-h-[560px]"
      aria-hidden="true"
    >
      <div className="absolute left-4 top-4 h-[74%] w-[62%] rounded-2xl glass-panel p-2 z-10 transition-transform duration-500 hover:scale-[1.02]">
        <div className="h-full w-full rounded-xl bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
      </div>

      <div className="absolute bottom-12 right-2 h-[60%] w-[56%] rounded-2xl glass-panel p-2 z-20 transition-transform duration-500 hover:scale-[1.02] hover:-translate-y-2">
        <div className="h-full w-full rounded-xl bg-[url('https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-6 top-16 rounded-xl glass-panel px-6 py-4 z-30 shadow-md"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Drip Score</p>
        <p className="mt-1 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-fuchsia-400">92</p>
      </motion.div>

      <div className="absolute bottom-2 left-2 grid w-[90%] grid-cols-3 gap-2 rounded-xl glass-panel p-3 z-30">
        {(["Detect Garments", "Analyze Colors", "Coach Style"] as const).map((label) => {
          const [top, bottom] = label.split(" ");
          return (
            <div key={label} className="rounded-lg bg-primary/5 p-3 text-center border border-primary/10">
              <p className="text-sm font-bold text-foreground">{top}</p>
              <p className="text-xs font-medium text-muted-foreground">{bottom}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  </section>
);

