import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Wand2 } from "lucide-react";

const stats = [
  ["Detect", "Garments"],
  ["Analyze", "Colors"],
  ["Coach", "Style"],
];

export const HeroSection = () => (
  <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-10 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 relative">
    
    {/* Background Glow */}
    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.16 }}
        className="max-w-5xl text-[clamp(3.5rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight text-foreground"
      >
        Dress Better.
        <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pb-2">
          Stand Out.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.28 }}
        className="max-w-xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl mt-6"
      >
        Upload your outfit and get a professional stylist critique — garment detection, color harmony analysis, actionable recommendations, and personalized fashion coaching.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.38 }}
        className="mt-10 flex flex-wrap items-center gap-4"
      >
        <a
          href="#upload"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Run Analysis
          <ArrowDown className="h-5 w-5" aria-hidden="true" />
        </a>
        <span className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-6 text-base font-semibold text-foreground shadow-sm transition-all duration-300 hover:bg-white/10">
          <Wand2 className="h-4 w-4 text-accent" aria-hidden="true" />
          Personalized Coaching
        </span>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.22, ease: "easeOut" }}
      className="relative mx-auto min-h-[420px] w-full max-w-[520px] lg:min-h-[600px]"
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
        className="absolute right-6 top-16 rounded-xl glass-panel px-6 py-4 z-30"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pipeline Score</p>
        <p className="mt-1 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">92</p>
      </motion.div>

      <div className="absolute bottom-2 left-2 grid w-[90%] grid-cols-3 gap-2 rounded-xl glass-panel p-3 z-30">
        {stats.map(([top, bottom]) => (
          <div key={top} className="rounded-lg bg-black/20 p-3 text-center border border-white/5">
            <p className="text-lg font-bold text-white">{top}</p>
            <p className="text-xs font-medium text-muted-foreground">{bottom}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);
