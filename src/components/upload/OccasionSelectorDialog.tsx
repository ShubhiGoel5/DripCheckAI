import { useState } from "react";
import { Briefcase, GraduationCap, Compass, Heart, PartyPopper, Award, Scroll, Plane, HelpCircle, Settings, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getStoredProfile } from "@/lib/gemini-service";
import { cn } from "@/lib/utils";

interface OccasionSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (occasion: string) => void;
  onOpenProfile: () => void;
}

const OCCASIONS = [
  { value: "Casual Outing", label: "Casual Outing", icon: Compass, color: "text-foreground" },
  { value: "Office", label: "Office / Work", icon: Briefcase, color: "text-foreground" },
  { value: "College", label: "College / School", icon: GraduationCap, color: "text-foreground" },
  { value: "Date", label: "Date Night", icon: Heart, color: "text-rose-500" },
  { value: "Party", label: "Party / Club", icon: PartyPopper, color: "text-violet-500" },
  { value: "Interview", label: "Job Interview", icon: Award, color: "text-primary" },
  { value: "Wedding", label: "Wedding / Gala", icon: Scroll, color: "text-foreground" },
  { value: "Travel", label: "Travel / Holiday", icon: Plane, color: "text-primary" },
  { value: "Other", label: "Other Context", icon: HelpCircle, color: "text-muted-foreground" },
];

export const OccasionSelectorDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onOpenProfile,
}: OccasionSelectorDialogProps) => {
  const [selected, setSelected] = useState("Casual Outing");
  const profile = getStoredProfile();

  const handleConfirm = () => {
    onConfirm(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-border bg-background/98 backdrop-blur-xl sm:rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 shadow-sm border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            Where are we going?
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm font-medium text-muted-foreground">
            The AI calibrates its critique — formality, color expectations, and appropriateness — based on your occasion.{" "}
            <strong className="text-foreground">One tap and you're done.</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Occasion Grid — min 44px tap targets (WCAG 2.5.5) */}
        <div
          className="my-5 grid grid-cols-2 gap-2.5"
          role="radiogroup"
          aria-label="Select your occasion"
        >
          {OCCASIONS.map((occ) => {
            const Icon = occ.icon;
            const isSelected = selected === occ.value;
            return (
              <button
                key={occ.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(occ.value)}
                className={cn(
                  "flex min-h-[52px] items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-muted/40 text-foreground hover:bg-muted hover:border-border/80"
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", isSelected ? "text-primary" : occ.color)} aria-hidden="true" />
                {occ.label}
              </button>
            );
          })}
        </div>

        {/* Profile Info Summary */}
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stylist Profile</span>
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
            >
              <Settings className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs font-medium text-muted-foreground">
            <div>Body Shape: <strong className="text-foreground">{profile.bodyType}</strong></div>
            <div>Height: <strong className="text-foreground">{profile.height}</strong></div>
            <div className="col-span-2 truncate">
              Aesthetics: <strong className="text-foreground">{profile.stylePreferences.join(", ") || "Not set"}</strong>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 mt-5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-full hover:bg-muted text-sm font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="h-11 rounded-full bg-primary text-white hover:bg-primary/90 shadow-glow transition-all text-sm font-semibold"
          >
            Analyze as "{selected}"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

