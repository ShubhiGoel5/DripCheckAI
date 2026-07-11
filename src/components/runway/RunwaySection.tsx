import { motion } from "framer-motion";
import { BadgeCheck, Crown, Gem, Sparkles } from "lucide-react";

const items = [
  { icon: Crown, title: "Premium AI Reasoning", copy: "Deep neural networks trained on high-fashion curation datasets." },
  { icon: Gem, title: "Aesthetic Precision", copy: "Meticulous color harmony algorithms and styling breakdowns." },
  { icon: BadgeCheck, title: "Flawless Execution", copy: "Structured, deterministic outputs that elevate your wardrobe." },
];

export const RunwaySection = () => (
  <section id="runway" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group rounded-2xl border border-white/10 glass-panel p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-white/5 hover:border-white/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="mb-8 flex items-center justify-between relative z-10">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 border border-white/10 shadow-glow backdrop-blur-md">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </span>
              <Sparkles className="h-5 w-5 text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white relative z-10">{item.title}</h3>
            <p className="mt-3 text-base font-medium text-muted-foreground relative z-10">{item.copy}</p>
          </motion.div>
        );
      })}
    </div>
  </section>
);
