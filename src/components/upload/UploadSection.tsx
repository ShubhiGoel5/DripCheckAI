import { useCallback, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";
import type { UploadedAsset } from "@/types/upload";
import { toast } from "sonner";

interface UploadSectionProps {
  asset: UploadedAsset | null;
  isAnalyzing: boolean;
  onAssetSelect: (asset: UploadedAsset) => void;
  onClear: () => void;
  onAnalyze: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const isValidImageFile = (file: File): boolean => {
  const ext = file.name.toLowerCase().split(".").pop() || "";
  return ACCEPTED_TYPES.includes(file.type) || ["jpg", "jpeg", "png", "webp"].includes(ext);
};

const readAsset = (file: File, onAssetSelect: (asset: UploadedAsset) => void) => {
  if (!isValidImageFile(file)) {
    toast.error("Unsupported file type. Please upload a JPG, JPEG, PNG, or WebP image.");
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    toast.error(`File is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum size is 10MB.`);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => onAssetSelect({ file, preview: reader.result as string, kind: "image" });
  reader.readAsDataURL(file);
};

const STEPS = [
  ["01", "Upload a full-length photo"],
  ["02", "Say where you're going"],
  ["03", "Get the read"],
] as const;

/** Corner crop marks. They grow when the parent (a `group`) is hovered or dragged over. */
const Marks = ({ active }: { active?: boolean }) => (
  <>
    {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
      <span
        key={c}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute border-foreground transition-all duration-300 ease-out",
          active ? "h-10 w-10 border-signal" : "h-5 w-5 group-hover:h-8 group-hover:w-8",
          c,
        )}
      />
    ))}
  </>
);

export const UploadSection = ({ asset, isAnalyzing, onAssetSelect, onClear, onAnalyze }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = useCallback(() => inputRef.current?.click(), []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) readAsset(file, onAssetSelect);
    },
    [onAssetSelect],
  );

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) readAsset(file, onAssetSelect);
      event.target.value = "";
    },
    [onAssetSelect],
  );

  const dragProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDrop: handleDrop,
  };

  return (
    <section id="upload" aria-labelledby="hero-heading" className="page grid gap-10 pb-16 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-12 lg:pb-24">
      {/* Copy */}
      <div className="lg:col-span-6 lg:pt-6 xl:col-span-4">
        <p className="label animate-rise">AI outfit critique</p>
        <h1 id="hero-heading" className="display mt-5 text-[clamp(2.75rem,5.6vw,5rem)]">
          {[
            <span key="a">Is the fit</span>,
            <em key="b" className="text-signal">
              working?
            </em>,
          ].map((line, i) => (
            // Each line slides up from behind a mask; padding keeps descenders from clipping.
            <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <motion.span
                className="block"
                initial={{ y: "110%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.95, delay: 0.1 + i * 0.14, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <p className="animate-rise mt-8 max-w-md text-base leading-snug text-foreground/80" style={{ animationDelay: "140ms" }}>
          Upload one full-body photo. You get a score out of 100, what's carrying the look, what's letting it down, and
          the changes that would move the number.
        </p>

        <ol className="mt-10 max-w-md border-t border-border">
          {STEPS.map(([n, text], i) => (
            <motion.li
              key={n}
              className="group flex items-baseline gap-5 border-b border-border py-3"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.55 + i * 0.1, ease: EASE }}
            >
              <span className="label w-6 text-signal">{n}</span>
              <span className="text-[15px] font-medium transition-transform duration-300 group-hover:translate-x-1.5">{text}</span>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Editorial photo — wide screens only, so the upload stays first on phones */}
      <motion.figure
        className="hidden xl:col-span-3 xl:mt-24 xl:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <motion.img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
            alt="A woman in a tailored outfit, photographed full length"
            className="h-full w-full object-cover"
            initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.12 }}
            animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
          />
        </div>
        <figcaption className="label mt-3 flex justify-between">
          <span>Fig. 1</span>
          <span>Full length</span>
        </figcaption>
      </motion.figure>

      {/* Plate */}
      <div className="animate-rise lg:col-span-6 xl:col-span-5" style={{ animationDelay: "120ms" }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          onChange={handleInput}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <div aria-live="polite" className="sr-only">
          {asset ? "Outfit photo added and ready to analyze" : "No photo added yet"}
        </div>

        {asset ? (
          <figure>
            <div
              {...dragProps}
              className={cn(
                "relative flex aspect-[4/5] max-h-[78vh] w-full items-center justify-center bg-muted p-3 transition-colors sm:p-5",
                isDragging && "bg-signal/10",
              )}
            >
              <Marks active={isDragging} />
              <motion.img
                key={asset.preview.slice(-24)}
                src={asset.preview}
                alt="Your uploaded outfit"
                className="h-full w-full object-contain"
                initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.04 }}
                animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
                transition={{ duration: 0.9, ease: EASE }}
              />
              {/* Scan line while the model is reading the photo */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    className="pointer-events-none absolute inset-3 overflow-hidden sm:inset-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-hidden="true"
                  >
                    <div className="animate-scan absolute inset-x-0 h-24 -translate-y-full bg-signal/10 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-signal" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <figcaption className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-5 text-sm">
                <button type="button" onClick={openFilePicker} className="link font-medium">
                  Replace photo
                </button>
                <button type="button" onClick={onClear} className="link font-medium">
                  Remove
                </button>
              </div>
              <button type="button" onClick={onAnalyze} disabled={isAnalyzing} className="btn-solid sm:min-w-[220px]">
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {isAnalyzing ? "Reading…" : "Get the read"}
                {!isAnalyzing && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </figcaption>
          </figure>
        ) : (
          <div
            {...dragProps}
            onClick={openFilePicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openFilePicker();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload a full-body outfit photo"
            className={cn(
              "hatch group relative flex aspect-[4/5] max-h-[78vh] w-full cursor-pointer flex-col items-center justify-center p-8 text-center transition-all duration-300",
              isDragging ? "scale-[1.015] bg-signal/10" : "bg-muted/50 hover:bg-muted",
            )}
          >
            <Marks active={isDragging} />
            <p className="label">{isDragging ? "Release to add" : "Drop a photo here"}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={isDragging ? "drag" : "idle"}
                className="display mt-4 text-3xl sm:text-4xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                {isDragging ? "Let go." : "Show us the fit."}
              </motion.p>
            </AnimatePresence>
            <span className="btn-solid pointer-events-none mt-8">Choose a file</span>
            <p className="mt-6 max-w-xs text-sm text-muted-foreground">
              Head to toe works best. JPG, PNG or WebP, up to 10&nbsp;MB.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
