import type { Product, ProductFilters, ProductSort } from "../types/product";

export const defaultFilters: ProductFilters = {
  brand: "all",
  minPrice: 0,
  maxPrice: 250000,
  minQuota: 0,
  minValidity: 0,
  availability: "all",
  keyword: "",
};
export function filterProducts(
  products: readonly Product[],
  filters: ProductFilters,
): Product[] {
  const query = filters.keyword.trim().toLocaleLowerCase("id-ID");
  return products.filter(
    (product) =>
      (filters.brand === "all" || product.brand === filters.brand) &&
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice &&
      product.quotaGb >= filters.minQuota &&
      product.validityDays >= filters.minValidity &&
      (filters.availability === "all" ||
        product.available === (filters.availability === "available")) &&
      [product.name, product.brand, ...product.benefits]
        .join(" ")
        .toLocaleLowerCase("id-ID")
        .includes(query),
  );
}
export function sortProducts(
  products: readonly Product[],
  sort: ProductSort,
): Product[] {
  return [...products].sort((a, b) => {
    const delta =
      sort === "price-asc"
        ? a.price - b.price
        : sort === "price-desc"
          ? b.price - a.price
          : sort === "quota-desc"
            ? b.quotaGb - a.quotaGb
            : b.validityDays - a.validityDays;
    return delta || a.id.localeCompare(b.id);
  });
}
