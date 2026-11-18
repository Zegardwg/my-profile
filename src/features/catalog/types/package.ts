// Compatibility names for the Phase 2 module structure.
export type { Brand, Usage, Product as DemoPackage } from "@/types/product";
export type BrandFilter = import("@/types/product").Brand | "all";
