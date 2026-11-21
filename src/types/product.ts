export type Brand = "xl" | "smartfren" | "axis";
export type Usage = "social" | "streaming" | "gaming" | "work" | "general";
export type InformationStatus = "demo" | "verified";
export type PlaceholderId = "package" | "sim" | "banner" | "promotion";
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
  category: string;
  placeholderId: PlaceholderId;
  sourceUrl: string;
  lastVerifiedAt: string;
  informationStatus: InformationStatus;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  revision: number;
}
export interface ProductFilters {
  brand: Brand | "all";
  minPrice: number;
  maxPrice: number;
  minQuota: number;
  minValidity: number;
  availability: "all" | "available" | "unavailable";
  keyword: string;
  informationStatus?: InformationStatus | "all";
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
  informationStatus?: InformationStatus | "all";
}
export interface Recommendation {
  product: Product;
  score: number;
  monthlyCost: number;
  reasons: string[];
}
