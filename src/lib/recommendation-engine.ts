import type {
  FinderRequirements,
  Product,
  Recommendation,
} from "../types/product";

// Conservative estimate: enough full packages to cover 30 days, no rollover assumed.
export function monthlyBudgetCost(product: Product): number {
  return Math.ceil(30 / product.validityDays) * product.price;
}
export function recommendProducts(
  products: readonly Product[],
  requirements: FinderRequirements,
): Recommendation[] {
  if (!Number.isFinite(requirements.budget) || requirements.budget <= 0)
    return [];
  return products
    .filter(
      (product) =>
        product.available &&
        product.price <= requirements.budget &&
        product.validityDays > 0 &&
        monthlyBudgetCost(product) <= requirements.budget &&
        product.validityDays >= requirements.minValidity &&
        (requirements.requiredBrand === "all" ||
          product.brand === requirements.requiredBrand),
    )
    .map((product) => {
      const usageMatch = product.usages.includes(requirements.usage);
      const validityMatch =
        requirements.preferredValidity === 0 ||
        product.validityDays === requirements.preferredValidity;
      const brandMatch =
        requirements.preferredBrand !== "all" &&
        product.brand === requirements.preferredBrand;
      const valuePoints = Math.min(
        20,
        Math.round((product.quotaGb / product.price) * 30000),
      );
      const score =
        (usageMatch ? 40 : 0) +
        (validityMatch ? 20 : 0) +
        (brandMatch ? 10 : 0) +
        valuePoints;
      const reasons = [
        "Tersedia dalam simulasi.",
        "Harga paket dan estimasi kebutuhan 30 hari berada dalam anggaran.",
        usageMatch
          ? "Kategori penggunaan sesuai pilihanmu."
          : "Alternatif kategori; penggunaan pilihanmu bukan fokus contoh ini.",
        validityMatch
          ? "Masa aktif sesuai preferensi."
          : "Masa aktif berbeda dari preferensi; tetap memenuhi batas wajib.",
        "Nilai kuota/harga: " + valuePoints + "/20 poin.",
      ];
      if (requirements.preferredBrand !== "all")
        reasons.push(
          brandMatch
            ? "Merek sesuai preferensi."
            : "Alternatif merek; preferensi merek tidak diwajibkan.",
        );
      return {
        product,
        score,
        reasons,
        monthlyCost: monthlyBudgetCost(product),
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.product.price - b.product.price ||
        a.product.id.localeCompare(b.product.id),
    )
    .slice(0, 3);
}
