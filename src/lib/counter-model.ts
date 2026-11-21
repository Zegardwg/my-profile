import { z } from "zod";
import type { Brand } from "../types/product";

export const offerSchema = z
  .object({
    brand: z.enum(["xl", "smartfren", "axis"]),
    price: z.number().int().min(0).max(100000000),
    originalPrice: z.number().int().positive().max(100000000).optional(),
    stock: z.number().int().min(0).max(100000),
    quota: z.number().min(0).max(100000),
    days: z.number().int().min(0).max(3650),
    benefits: z.string().trim().max(900),
    verifiedAt: z.union([z.literal(""), z.iso.date()]).optional(),
    updatedAt: z.iso.datetime().optional(),
    revision: z.number().int().nonnegative(),
  })
  .refine(
    (offer) =>
      offer.originalPrice === undefined ||
      (offer.price > 0 && offer.originalPrice > offer.price),
    {
      path: ["originalPrice"],
      message:
        "Untuk diskon, isi harga jual di atas Rp0 dan harga normal yang lebih tinggi.",
    },
  );
export type Offer = z.infer<typeof offerSchema>;
export const emptyOffer = (brand: Brand): Offer => ({
  brand,
  price: 0,
  stock: 0,
  quota: 0,
  days: 0,
  benefits: "",
  revision: 0,
});
export interface Campaign {
  id: "axis";
  bonus: boolean;
  free: boolean;
  limit: number;
  used: number;
  session: string;
  revision: number;
}
export const initialCampaign: Campaign = {
  id: "axis",
  bonus: false,
  free: false,
  limit: 0,
  used: 0,
  session: "",
  revision: 0,
};
export type Method = "qr" | "cash" | "free";
export type Stage = "pending" | "paid" | "handed" | "cancelled";
export interface Line {
  brand: Brand;
  price: number;
  originalPrice?: number;
  kind: "sale" | "bonus" | "free";
}
export interface Invoice {
  id: string;
  created: string;
  lines: Line[];
  total: number;
  code: string;
  session: string;
  method: Method;
  stage: Stage;
  received?: number;
  handedAt?: string;
}
export const isOpen = (i: Invoice) =>
  i.stage === "pending" || i.stage === "paid";
export const validCode = (s: string) => s.trim().toUpperCase() === "XLSMART";
export function remainingStock(offer: Offer, invoices: Invoice[]) {
  return (
    offer.stock -
    invoices
      .filter(isOpen)
      .reduce(
        (n, i) => n + i.lines.filter((l) => l.brand === offer.brand).length,
        0,
      )
  );
}
export function offerHighlights(offers: Offer[], invoices: Invoice[]) {
  const available = offers.filter(
    (offer) =>
      offer.verifiedAt &&
      offer.price > 0 &&
      remainingStock(offer, invoices) > 0,
  );
  const labels: Record<Brand, string[]> = { xl: [], smartfren: [], axis: [] };
  if (available.length < 2) return labels;
  for (const [field, label] of [
    ["price", "Harga terendah"],
    ["quota", "Kuota terbesar"],
    ["days", "Masa aktif terpanjang"],
  ] as const) {
    const values = available.map((offer) => offer[field]);
    if (values.some((value) => value <= 0)) continue;
    const best = field === "price" ? Math.min(...values) : Math.max(...values);
    const leaders = available.filter((offer) => offer[field] === best);
    if (leaders.length === available.length) continue;
    for (const offer of leaders) labels[offer.brand].push(label);
  }
  return labels;
}

export function remainingClaims(c: Campaign, invoices: Invoice[]) {
  return (
    c.limit -
    c.used -
    invoices.filter(
      (i) => isOpen(i) && i.method === "free" && i.session === c.session,
    ).length
  );
}
export function quote(
  brand: Brand,
  price: number,
  free: boolean,
  redeem: boolean,
  originalPrice?: number,
): Line[] {
  if (free) return [{ brand: "axis", price: 0, kind: "free" }];
  const lines: Line[] = [{ brand, price, kind: "sale" }];
  if (originalPrice !== undefined && originalPrice > price)
    lines[0].originalPrice = originalPrice;
  if (brand !== "axis" && redeem)
    lines.push({ brand: "axis", price: 0, kind: "bonus" });
  return lines;
}
