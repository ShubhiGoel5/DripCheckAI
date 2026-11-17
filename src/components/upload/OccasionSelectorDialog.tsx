import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getStoredProfile } from "@/lib/gemini-service";
import { cn } from "@/lib/utils";

interface OccasionSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (occasion: string) => void;
  onOpenProfile: () => void;
}

const OCCASIONS = [
  { value: "Casual Outing", label: "Casual outing" },
  { value: "Office", label: "Office" },
  { value: "College", label: "College" },
  { value: "Date", label: "Date night" },
  { value: "Party", label: "Party" },
  { value: "Interview", label: "Interview" },
  { value: "Wedding", label: "Wedding" },
  { value: "Travel", label: "Travel" },
  { value: "Other", label: "Something else" },
];

export const OccasionSelectorDialog = ({ open, onOpenChange, onConfirm, onOpenProfile }: OccasionSelectorDialogProps) => {
  const [selected, setSelected] = useState("Casual Outing");
  const profile = getStoredProfile();

  const handleConfirm = () => {
    onConfirm(selected);
    onOpenChange(false);
  };

  const label = OCCASIONS.find((o) => o.value === selected)?.label ?? selected;
  const aesthetics = profile.stylePreferences.join(", ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 rounded-none border border-foreground bg-background p-0 shadow-xl sm:rounded-none">
        <DialogHeader className="space-y-0 border-b border-foreground p-6 text-left">
          <p className="label">One question</p>
          <DialogTitle className="display mt-2 text-4xl font-normal leading-[0.95]">Where are you going?</DialogTitle>
          <DialogDescription className="mt-3 text-sm text-muted-foreground">
            The same outfit scores differently at an interview and at a party. Pick the one that fits.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <div role="radiogroup" aria-label="Occasion" className="grid grid-cols-2 gap-px border border-foreground bg-foreground sm:grid-cols-3">
            {OCCASIONS.map((occ) => {
              const on = selected === occ.value;
              return (
                <button
                  key={occ.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setSelected(occ.value)}
                  className={cn(
                    "min-h-[56px] px-3 text-left text-sm font-semibold transition-colors",
                    on ? "bg-foreground text-background" : "bg-background hover:bg-muted",
                  )}
                >
                  {occ.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-start justify-between gap-4 text-sm">
            <p className="text-muted-foreground">
              Using your profile:{" "}
              <span className="font-medium text-foreground">
                {[profile.bodyType, profile.height, aesthetics].filter(Boolean).join(" · ") || "not set"}
              </span>
            </p>
            <button type="button" onClick={onOpenProfile} className="link shrink-0 font-medium">
              Edit
            </button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border p-6 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => onOpenChange(false)} className="btn-line sm:min-w-[120px]">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className="btn-solid">
            Read it for “{label}”
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
