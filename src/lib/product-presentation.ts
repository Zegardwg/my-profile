import type { Brand } from "@/types/product";

export const brandStyles: Record<
  Brand,
  { label: string; text: string; surface: string; border: string }
> = {
  xl: {
    label: "XL",
    text: "text-primary",
    surface: "bg-secondary",
    border: "border-t-primary",
  },
  smartfren: {
    label: "Smartfren",
    text: "text-[#b80b5a]",
    surface: "bg-[#fff0f6]",
    border: "border-t-smartfren",
  },
  axis: {
    label: "AXIS",
    text: "text-axis",
    surface: "bg-[#f6efff]",
    border: "border-t-axis",
  },
};
export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}
