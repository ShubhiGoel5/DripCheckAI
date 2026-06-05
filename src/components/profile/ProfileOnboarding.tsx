import { useState, useEffect } from "react";
import { User, Ruler, Settings } from "lucide-react";
import { getStoredProfile, setStoredProfile, UserProfile } from "@/lib/gemini-service";

export const ProfileOnboarding = () => {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());

  useEffect(() => {
    setStoredProfile(profile);
  }, [profile]);

  const handleChange = (field: keyof UserProfile, value: string | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleStylePreference = (style: string) => {
    setProfile((prev) => {
      const current = prev.stylePreferences;
      if (current.includes(style)) {
        return { ...prev, stylePreferences: current.filter((s) => s !== style) };
      } else {
        return { ...prev, stylePreferences: [...current, style] };
      }
    });
  };

  const STYLES = ["Minimalist", "Streetwear", "Smart Casual", "Old Money", "Y2K", "Athleisure", "Gorpcore", "Preppy", "Grunge"];
  const BODY_TYPES = ["Rectangle", "Triangle", "Inverted Triangle", "Pear", "Hourglass", "Athletic"];

  return (
    <section id="profile-onboarding" className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl glass-panel p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle glow effect inside the card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

        <div className="mb-8 border-b border-white/10 pb-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            <User className="h-4 w-4" />
            Step 1: The Canvas
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Build your Stylist Profile
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">
            The AI needs to know who it's styling. Tell us about your proportions and aesthetic goals so we can give you highly personalized advice.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 relative z-10">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Gender Identity</label>
              <select
                value={profile.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
              >
                <option value="Unspecified">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Age Range</label>
                <select
                  value={profile.ageRange}
                  onChange={(e) => handleChange("ageRange", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                >
                  <option value="Under 18">Under 18</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45+">45+</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Height</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={profile.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    placeholder="e.g., 5'10 or 178cm"
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Body Shape</label>
              <select
                value={profile.bodyType}
                onChange={(e) => handleChange("bodyType", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
              >
                {BODY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-muted-foreground">Used to evaluate silhouette proportions and length balance.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Fashion Experience</label>
              <select
                value={profile.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
              >
                <option value="Beginner">Beginner (Need basic rules)</option>
                <option value="Intermediate">Intermediate (Know the basics)</option>
                <option value="Advanced">Advanced (Break the rules)</option>
              </select>
              <p className="mt-2 text-xs text-muted-foreground">Determines how technical the AI's coaching will be.</p>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">Aesthetic Goals (Select 1-3)</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStylePreference(style)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ${
                      profile.stylePreferences.includes(style)
                        ? "border-primary bg-primary text-white shadow-glow scale-105"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
