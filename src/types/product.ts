export type Brand = "xl" | "smartfren" | "axis";
export type Usage = "social" | "streaming" | "gaming" | "work" | "general";
export interface Product {
  id: string;
  brand: Brand;
  name: string;
  price: number;
  quotaGb: number;
  validityDays: number;
  benefits: readonly string[];
  restrictions: readonly string[];
  usages: readonly Usage[];
  available: boolean;
}
export interface ProductFilters {
  brand: Brand | "all";
  minPrice: number;
  maxPrice: number;
  minQuota: number;
  minValidity: number;
  availability: "all" | "available" | "unavailable";
  keyword: string;
}
export type ProductSort =
  "price-asc" | "price-desc" | "quota-desc" | "validity-desc";
export interface FinderRequirements {
  budget: number;
  usage: Usage;
  preferredValidity: number;
  preferredBrand: Brand | "all";
  minValidity: number;
  requiredBrand: Brand | "all";
}
export interface Recommendation {
  product: Product;
  score: number;
  monthlyCost: number;
  reasons: string[];
}
