import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getStoredProfile, setStoredProfile, UserProfile } from "@/lib/gemini-service";
import { cn } from "@/lib/utils";

export const OPEN_PROFILE_EVENT = "dripcheck:open-profile";

const STYLES = ["Minimalist", "Streetwear", "Smart Casual", "Old Money", "Y2K", "Athleisure", "Gorpcore", "Preppy", "Grunge"];
const BODY_TYPES = ["Rectangle", "Triangle", "Inverted Triangle", "Pear", "Hourglass", "Athletic"];

const fieldClass =
  "w-full border-0 border-b border-foreground bg-transparent px-0 py-2.5 text-[15px] font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-signal focus:outline-none focus:ring-0 rounded-none";

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="label">{label}</span>
    {children}
    {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
  </label>
);

export const ProfileOnboarding = () => {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setStoredProfile(profile);
  }, [profile]);

  // Lets other parts of the app (the occasion dialog) open this panel.
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setTimeout(() => document.getElementById("profile-onboarding")?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
    };
    window.addEventListener(OPEN_PROFILE_EVENT, handler);
    return () => window.removeEventListener(OPEN_PROFILE_EVENT, handler);
  }, []);

  const handleChange = (field: keyof UserProfile, value: string | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleStylePreference = (style: string) => {
    setProfile((prev) => {
      const current = prev.stylePreferences;
      return {
        ...prev,
        stylePreferences: current.includes(style) ? current.filter((s) => s !== style) : [...current, style],
      };
    });
  };

  const summary = [profile.bodyType, profile.height, ...profile.stylePreferences].filter(Boolean).join(" · ");

  return (
    <section id="profile-onboarding" className="page pb-16 lg:pb-24">
      <div className="border-y border-foreground">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="profile-panel"
          className="flex w-full items-center justify-between gap-6 py-5 text-left"
        >
          <span className="grid gap-1 sm:grid-cols-[14rem_1fr] sm:items-baseline sm:gap-8">
            <span className="font-display text-2xl leading-none sm:text-3xl">Tune it to you</span>
            <span className={cn("text-sm text-muted-foreground", !open && "truncate")}>
              {open ? "Optional. Saved on this device and sent with each analysis." : summary || "Optional — height, body shape, the looks you like."}
            </span>
          </span>
          <Plus className={cn("h-6 w-6 shrink-0 transition-transform duration-200", open && "rotate-45")} aria-hidden="true" />
        </button>

        {open && (
          <div id="profile-panel" className="animate-rise grid gap-x-12 gap-y-8 pb-10 pt-2 md:grid-cols-2">
            <div className="space-y-7">
              <Field label="Gender">
                <select value={profile.gender} onChange={(e) => handleChange("gender", e.target.value)} className={fieldClass}>
                  <option value="Unspecified">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-6">
                <Field label="Age range">
                  <select value={profile.ageRange} onChange={(e) => handleChange("ageRange", e.target.value)} className={fieldClass}>
                    <option value="Under 18">Under 18</option>
                    <option value="18-24">18–24</option>
                    <option value="25-34">25–34</option>
                    <option value="35-44">35–44</option>
                    <option value="45+">45+</option>
                  </select>
                </Field>
                <Field label="Height">
                  <input
                    type="text"
                    value={profile.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    placeholder="5'10 or 178cm"
                    className={fieldClass}
                  />
                </Field>
              </div>

              <Field label="Body shape" hint="Used to judge proportion and length balance.">
                <select value={profile.bodyType} onChange={(e) => handleChange("bodyType", e.target.value)} className={fieldClass}>
                  {BODY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="space-y-7">
              <Field label="Experience" hint="Sets how technical the coaching gets.">
                <select value={profile.experience} onChange={(e) => handleChange("experience", e.target.value)} className={fieldClass}>
                  <option value="Beginner">Beginner — give me the rules</option>
                  <option value="Intermediate">Intermediate — I know the basics</option>
                  <option value="Advanced">Advanced — I break the rules</option>
                </select>
              </Field>

              <div>
                <p id="style-prefs-label" className="label">
                  Looks you like <span className="normal-case tracking-normal">(pick up to three)</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-labelledby="style-prefs-label">
                  {STYLES.map((style) => {
                    const on = profile.stylePreferences.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleStylePreference(style)}
                        className={cn(
                          "min-h-[40px] border px-4 text-sm font-medium transition-colors",
                          on
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground",
                        )}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
