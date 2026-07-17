import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Camera, ImagePlus, Loader2, Sparkles, Upload, X, AlertCircle, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export const UploadSection = ({ asset, isAnalyzing, onAssetSelect, onClear, onAnalyze }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = useCallback(() => inputRef.current?.click(), []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) readAsset(file, onAssetSelect);
  }, [onAssetSelect]);

  const handleInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) readAsset(file, onAssetSelect);
    event.target.value = "";
  }, [onAssetSelect]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }, [openFilePicker]);

  return (
    <section id="upload" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20 relative">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">Input Layer</p>
          <h2 className="text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-foreground">
            Drop the fit.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-2">
            See the pipeline.
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-muted-foreground">
            The upload starts a visible computer vision flow, from garment detection to score reasoning. High-fidelity analysis requires a clear, full-body shot.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.12 }}
        >
          <div className="rounded-2xl glass-panel p-2 sm:p-3 relative overflow-hidden group">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              onClick={openFilePicker}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              aria-label="Upload a full-body outfit image"
              className={cn(
                "relative flex flex-col items-center justify-center min-h-[340px] cursor-pointer overflow-hidden rounded-xl border-2 border-dashed bg-black/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:min-h-[460px]",
                isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/20 hover:border-white/40 hover:bg-black/30",
              )}
            >
              <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={handleInput} className="sr-only" aria-hidden="true" />
              {/* Live region for screen readers to announce upload status */}
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {asset ? "Outfit image uploaded and ready for analysis" : "Upload zone is empty"}
              </div>

              {asset ? (
                <>
                  <img src={asset.preview} alt="Uploaded outfit preview" className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onClear();
                    }}
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-md text-white transition-all hover:bg-red-500 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="Remove image"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <div className="rounded-xl glass-panel p-4 sm:p-6 backdrop-blur-xl bg-white/10">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            Ready for the read
                          </p>
                          <p className="mt-1 text-xl font-bold text-white">
                            Your look is locked in.
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onAnalyze();
                          }}
                          disabled={isAnalyzing}
                          className="bg-primary text-white hover:bg-primary/90 hover:scale-105 shadow-glow transition-all rounded-full px-6"
                        >
                          {isAnalyzing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ArrowRight className="mr-2 h-5 w-5" />}
                          {isAnalyzing ? "Analyzing Pipeline..." : "Run Analysis"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-8 grid h-24 w-24 place-items-center rounded-full bg-white/5 border border-white/10 shadow-lg backdrop-blur-md"
                  >
                    {isDragging ? <ImagePlus className="h-10 w-10 text-primary" /> : <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />}
                  </motion.div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {isDragging ? "Release the look" : "Upload your outfit"}
                  </h3>
                  <p className="mt-4 max-w-sm text-base text-muted-foreground">
                    Drag a full-body photo here or tap to browse. JPG, PNG, and WebP up to 10MB.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-md">
                      <Camera className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                      Full-body shot
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-md">
                      <AlertCircle className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                      Max 10MB
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
