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
  { value: "Date", label: "Date Night", icon: Heart, color: "text-accent" },
  { value: "Party", label: "Party / Club", icon: PartyPopper, color: "text-accent" },
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
      <DialogContent className="max-w-md border border-white/10 glass-panel sm:rounded-2xl p-6 bg-background/95">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 shadow-sm border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            Where are we going?
          </DialogTitle>
          <DialogDescription className="mt-2 text-base font-medium text-muted-foreground">
            The stylist evaluates cohesion and appropriateness differently depending on where the outfit will be worn.
          </DialogDescription>
        </DialogHeader>

        {/* Occasion Grid */}
        <div className="my-6 grid grid-cols-2 gap-3">
          {OCCASIONS.map((occ) => {
            const Icon = occ.icon;
            const isSelected = selected === occ.value;
            return (
              <button
                key={occ.value}
                type="button"
                onClick={() => setSelected(occ.value)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border bg-muted/50 hover:bg-muted hover:border-border/80"
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", isSelected ? "text-primary" : occ.color)} />
                <span className={cn("text-sm font-semibold", isSelected ? "text-primary" : "text-foreground")}>{occ.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Info Summary */}
        <div className="rounded-xl border border-border bg-muted/50 p-4 relative">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stylist Profile Context</span>
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <Settings className="h-3.5 w-3.5" />
              Edit Profile
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
            <div>Body Shape: <strong className="text-foreground">{profile.bodyType}</strong></div>
            <div>Height: <strong className="text-foreground">{profile.height}</strong></div>
            <div className="col-span-2 mt-1 truncate">
              Aesthetics: <strong className="text-foreground">{profile.stylePreferences.join(", ")}</strong>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-2 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-full hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="h-11 rounded-full bg-primary text-white hover:bg-primary/90 shadow-glow transition-all"
          >
            Confirm & Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
