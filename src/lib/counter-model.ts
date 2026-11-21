import { z } from "zod";
import type { Brand } from "../types/product";

export const offerSchema = z.object({
  brand: z.enum(["xl", "smartfren", "axis"]),
  price: z.number().int().min(0).max(100000000),
  stock: z.number().int().min(0).max(100000),
  quota: z.number().min(0).max(100000),
  days: z.number().int().min(0).max(3650),
  benefits: z.string().trim().max(900),
  verifiedAt: z.union([z.literal(""), z.iso.date()]).optional(),
  updatedAt: z.iso.datetime().optional(),
  revision: z.number().int().nonnegative(),
});
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
): Line[] {
  if (free) return [{ brand: "axis", price: 0, kind: "free" }];
  const lines: Line[] = [{ brand, price, kind: "sale" }];
  if (brand !== "axis" && redeem)
    lines.push({ brand: "axis", price: 0, kind: "bonus" });
  return lines;
}
