import Image from "next/image";
import {
  Smartphone,
  Wifi,
  CreditCard,
  PanelsTopLeft,
  Sparkles,
} from "lucide-react";
import { brandStyles } from "@/lib/product-presentation";
import { placeholderNames } from "@/config/product-placeholders";
import { cn } from "@/lib/utils";
import type { Brand, PlaceholderId } from "@/types/product";
// Code-native visual variants; future asset references can replace this field without external image requests.
const icons = {
  package: Smartphone,
  sim: CreditCard,
  banner: PanelsTopLeft,
  promotion: Sparkles,
};
export function ProductVisual({
  brand,
  compact = false,
  placeholderId = "package",
}: {
  brand: Brand;
  compact?: boolean;
  placeholderId?: PlaceholderId;
}) {
  const Icon = icons[placeholderId];
  const label =
    "Placeholder " +
    placeholderNames[placeholderId] +
    ", bukan gambar produk resmi";
  if (compact)
    return (
      <span
        role="img"
        aria-label={label}
        title={placeholderNames[placeholderId]}
        className="grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white"
      >
        {placeholderId === "package" ? (
          <Wifi aria-hidden="true" className="size-5" strokeWidth={1.6} />
        ) : (
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
        )}
      </span>
    );
  if (placeholderId === "package") return <Image src={"/images/products/" + brand + ".webp"} width={920} height={920} unoptimized alt={"Ilustrasi kartu " + brandStyles[brand].label} className="mb-4 max-h-52 w-full rounded-xl bg-secondary object-contain" />;
  return (
    <div
      role="img"
      aria-label={label}
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
        <Icon className="size-12" />

      </div>
      <span className="absolute right-3 bottom-2 text-[10px] tracking-wide text-muted-foreground">
        ILUSTRASI · {placeholderNames[placeholderId]}
      </span>
    </div>
  );
}
