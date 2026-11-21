import type { Brand, Product, Usage } from "@/types/product";

export const DEMO_LABEL = "DATA DEMO - BUKAN PENAWARAN RESMI";
export const brandNames: Record<Brand, string> = {
  xl: "XL",
  smartfren: "Smartfren",
  axis: "AXIS",
};
export const usageNames: Record<Usage, string> = {
  social: "WhatsApp dan media sosial",
  streaming: "YouTube dan video daring",
  gaming: "Bermain gim",
  work: "Kerja dan belajar",
  general: "Pemakaian umum",
};
type Seed = readonly [Brand, string, number, number, number, Usage, boolean];
// Fictional fixtures only. No commercial offer or verified operator benefit.
const seeds: readonly Seed[] = [
  ["xl", "Daily Discover", 15000, 5, 7, "social", true],
  ["xl", "Everyday Connect", 65000, 30, 30, "general", true],
  ["xl", "Play Session", 75000, 35, 30, "gaming", true],
  ["xl", "Focus Horizon", 95000, 50, 30, "work", true],
  ["xl", "Cinema Weekend", 35000, 15, 14, "streaming", false],
  ["xl", "Long Journey", 170000, 85, 60, "general", true],
  ["smartfren", "Social Spark", 18000, 6, 7, "social", true],
  ["smartfren", "Stream Explore", 80000, 45, 30, "streaming", true],
  ["smartfren", "Play Together", 70000, 32, 28, "gaming", true],
  ["smartfren", "Focus Studio", 100000, 55, 30, "work", true],
  ["smartfren", "Daily Space", 45000, 16, 14, "general", false],
  ["smartfren", "Long Stories", 180000, 90, 60, "streaming", true],
  ["axis", "Social Everyday", 40000, 18, 28, "social", true],
  ["axis", "Watch More", 60000, 27, 30, "streaming", true],
  ["axis", "Game Circle", 55000, 24, 30, "gaming", true],
  ["axis", "Study Space", 85000, 40, 30, "work", true],
  ["axis", "Daily Hello", 12000, 4, 7, "general", false],
  ["axis", "Long Connection", 150000, 70, 60, "general", true],
];
export const demoProducts: readonly Product[] = seeds.map(
  ([brand, name, price, quotaGb, validityDays, usage, available], index) => ({
    id: "demo-" + brand + "-" + (index + 1),
    brand,
    name,
    price,
    quotaGb,
    validityDays,
    available,
    category: usageNames[usage],
    placeholderId: "package",
    sourceUrl: "",
    lastVerifiedAt: "",
    informationStatus: "demo",
    archived: false,
    createdAt: "2026-11-18T00:00:00.000Z",
    updatedAt: "2026-11-18T00:00:00.000Z",
    revision: 1,
    usages: [usage, ...(usage === "general" ? [] : ["general" as const])],
    benefits: [
      "Ilustrasi kuota utama " + quotaGb + " GB",
      "Contoh penggunaan: " + usageNames[usage],
    ],
    restrictions: [
      "Paket fiktif; tidak dapat dibeli atau diaktifkan.",
      "Ilustrasi non-unlimited; tidak termasuk roaming atau bonus aplikasi.",
    ],
  }),
);
