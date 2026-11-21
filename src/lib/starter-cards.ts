import type { Product } from "../types/product";

export const starterBrands = ["xl", "smartfren", "axis"] as const;
export const starterCategory = "Kartu perdana";

export function isStarterCard(product: Product) {
  return (
    product.category.trim().toLocaleLowerCase("id-ID") ===
    starterCategory.toLocaleLowerCase("id-ID")
  );
}

export function canBuyStarter(product: Product) {
  return (
    isStarterCard(product) &&
    !product.archived &&
    product.available &&
    product.price > 0 &&
    product.informationStatus === "verified"
  );
}

export function includesAxisBonus(product: Product) {
  return (
    canBuyStarter(product) &&
    (product.brand === "xl" || product.brand === "smartfren")
  );
}
