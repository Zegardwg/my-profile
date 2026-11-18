import { Smartphone, Wifi } from "lucide-react";
import { brandStyles } from "@/lib/product-presentation";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types/product";

export function ProductVisual({
  brand,
  compact = false,
}: {
  brand: Brand;
  compact?: boolean;
}) {
  if (compact)
    return (
      <span
        role="img"
        aria-label="Placeholder ilustrasi paket, bukan gambar produk resmi"
        title="Ilustrasi placeholder"
        className="grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white"
      >
        <Wifi aria-hidden="true" className="size-5" strokeWidth={1.6} />
      </span>
    );
  return (
    <div
      role="img"
      aria-label="Placeholder ilustrasi paket, bukan gambar produk resmi"
      className={cn(
        "relative mb-5 flex h-32 items-center justify-center overflow-hidden rounded-xl",
        brandStyles[brand].surface,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "relative rotate-8 rounded-xl border-2 border-current bg-white p-3",
          brandStyles[brand].text,
        )}
      >
        <Smartphone className="size-12" />
        <Wifi className="absolute top-6 left-7 size-5 bg-white" />
      </div>
      <span className="absolute right-3 bottom-2 text-[10px] tracking-wide text-muted-foreground">
        PLACEHOLDER · DEMO
      </span>
    </div>
  );
}
