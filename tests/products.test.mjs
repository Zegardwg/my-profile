import test from "node:test";
import assert from "node:assert/strict";
import { demoProducts } from "../src/data/demo-products.ts";
import {
  defaultFilters,
  filterProducts,
  sortProducts,
} from "../src/lib/product-filters.ts";
import {
  recommendProducts,
  monthlyBudgetCost,
} from "../src/lib/recommendation-engine.ts";
import { toggleComparison, MAX_COMPARISON } from "../src/lib/comparison.ts";

const requirements = {
  budget: 100000,
  usage: "gaming",
  preferredValidity: 30,
  preferredBrand: "all",
  minValidity: 0,
  requiredBrand: "all",
};
const base = demoProducts[0];
const fixture = (changes) => ({
  ...base,
  price: 50000,
  validityDays: 30,
  quotaGb: 20,
  available: true,
  usages: ["gaming"],
  ...changes,
});

test("18 unique fictional packages distributed evenly across brands", () => {
  assert.equal(demoProducts.length, 18);
  assert.equal(new Set(demoProducts.map((p) => p.id)).size, 18);
  for (const brand of ["xl", "smartfren", "axis"])
    assert.equal(demoProducts.filter((p) => p.brand === brand).length, 6);
  for (const p of demoProducts)
    assert.ok(
      p.price > 0 &&
        p.quotaGb > 0 &&
        p.validityDays > 0 &&
        p.restrictions.length,
    );
});
test("default filters retain all products", () =>
  assert.equal(filterProducts(demoProducts, defaultFilters).length, 18));
test("brand filter never leaks another brand", () => {
  const result = filterProducts(demoProducts, {
    ...defaultFilters,
    brand: "axis",
  });
  assert.equal(result.length, 6);
  assert.ok(result.every((p) => p.brand === "axis"));
});
test("price endpoints are inclusive", () => {
  const products = [
    fixture({ id: "a", price: 49999 }),
    fixture({ id: "b", price: 50000 }),
    fixture({ id: "c", price: 50001 }),
  ];
  assert.deepEqual(
    filterProducts(products, {
      ...defaultFilters,
      minPrice: 50000,
      maxPrice: 50000,
    }).map((p) => p.id),
    ["b"],
  );
});
test("quota and validity thresholds are inclusive and combined", () => {
  const result = filterProducts(demoProducts, {
    ...defaultFilters,
    minQuota: 40,
    minValidity: 30,
  });
  assert.ok(result.length > 0);
  assert.ok(result.every((p) => p.quotaGb >= 40 && p.validityDays >= 30));
});
test("availability filters available and unavailable products", () => {
  for (const available of [true, false]) {
    const result = filterProducts(demoProducts, {
      ...defaultFilters,
      availability: available ? "available" : "unavailable",
    });
    assert.ok(result.length);
    assert.ok(result.every((p) => p.available === available));
  }
});
test("keyword handles whitespace, casing, brand and benefits", () => {
  assert.equal(
    filterProducts(demoProducts, {
      ...defaultFilters,
      keyword: "  EVERYDAY CONNECT  ",
    })[0].name,
    "Everyday Connect",
  );
  assert.equal(
    filterProducts(demoProducts, { ...defaultFilters, keyword: "SMARTFREN" })
      .length,
    6,
  );
  assert.ok(
    filterProducts(demoProducts, {
      ...defaultFilters,
      keyword: "ilustrasi kuota utama",
    }).length,
  );
});
test("combined filters honor all constraints", () => {
  const result = filterProducts(demoProducts, {
    brand: "xl",
    minPrice: 60000,
    maxPrice: 100000,
    minQuota: 30,
    minValidity: 30,
    availability: "available",
    keyword: "Focus",
  });
  assert.deepEqual(
    result.map((p) => p.name),
    ["Focus Horizon"],
  );
});
test("inverted price range and nonexistent search return no match", () => {
  assert.deepEqual(
    filterProducts(demoProducts, {
      ...defaultFilters,
      minPrice: 90000,
      maxPrice: 50000,
    }),
    [],
  );
  assert.deepEqual(
    filterProducts(demoProducts, {
      ...defaultFilters,
      keyword: "not-a-package",
    }),
    [],
  );
});
test("all sorting modes are correct and do not mutate source", () => {
  const original = [...demoProducts];
  for (const [sort, key, direction] of [
    ["price-asc", "price", 1],
    ["price-desc", "price", -1],
    ["quota-desc", "quotaGb", -1],
    ["validity-desc", "validityDays", -1],
  ]) {
    const result = sortProducts(demoProducts, sort);
    for (let i = 1; i < result.length; i++)
      assert.ok((result[i][key] - result[i - 1][key]) * direction >= 0);
  }
  assert.deepEqual(demoProducts, original);
});
test("recommendations never exceed budget, exclude unavailable, max three", () => {
  for (const budget of [1000, 40000, 65000, 100000, 250000]) {
    const result = recommendProducts(demoProducts, { ...requirements, budget });
    assert.ok(result.length <= 3);
    assert.ok(
      result.every(
        (r) =>
          r.product.available &&
          r.product.price <= budget &&
          r.monthlyCost <= budget,
      ),
    );
  }
});
test("exact budget accepted and one Rupiah above excluded", () => {
  const result = recommendProducts(
    [
      fixture({ id: "exact", price: 100000 }),
      fixture({ id: "over", price: 100001 }),
    ],
    requirements,
  );
  assert.deepEqual(
    result.map((r) => r.product.id),
    ["exact"],
  );
});
test("short validity cost respects 30-day budget with full package rounding", () => {
  const product = fixture({ price: 20000, validityDays: 7 });
  assert.equal(monthlyBudgetCost(product), 100000);
  assert.equal(
    recommendProducts([product], { ...requirements, budget: 99999 }).length,
    0,
  );
  assert.equal(recommendProducts([product], requirements).length, 1);
});
test("required brand and minimum validity are hard constraints", () => {
  const result = recommendProducts(demoProducts, {
    ...requirements,
    budget: 250000,
    requiredBrand: "xl",
    minValidity: 60,
  });
  assert.ok(result.length);
  assert.ok(
    result.every(
      (r) => r.product.brand === "xl" && r.product.validityDays >= 60,
    ),
  );
});
test("usage matching ranks ahead of otherwise identical fixtures", () => {
  const result = recommendProducts(
    [fixture({ id: "other", usages: ["social"] }), fixture({ id: "match" })],
    requirements,
  );
  assert.equal(result[0].product.id, "match");
});
test("preferred validity improves ranking", () => {
  const result = recommendProducts(
    [fixture({ id: "other", validityDays: 60 }), fixture({ id: "match" })],
    requirements,
  );
  assert.equal(result[0].product.id, "match");
});
test("price value suitability improves ranking", () => {
  const result = recommendProducts(
    [
      fixture({ id: "small", quotaGb: 10 }),
      fixture({ id: "large", quotaGb: 30 }),
    ],
    requirements,
  );
  assert.equal(result[0].product.id, "large");
});
test("brand preference is soft unless required", () => {
  const products = [
    fixture({ id: "xl", brand: "xl" }),
    fixture({ id: "axis", brand: "axis" }),
  ];
  const result = recommendProducts(products, {
    ...requirements,
    preferredBrand: "axis",
  });
  assert.equal(result[0].product.brand, "axis");
  assert.equal(result.length, 2);
});
test("no built-in score bonus for any brand, input order independent", () => {
  const products = ["xl", "smartfren", "axis"].map((brand, index) =>
    fixture({ id: "same-" + index, brand }),
  );
  const result = recommendProducts(products, requirements);
  assert.equal(new Set(result.map((r) => r.score)).size, 1);
  assert.deepEqual(
    result,
    recommendProducts([...products].reverse(), requirements),
  );
});
test("honest no-match for unavailable, low budget, and impossible mandatory criteria", () => {
  assert.deepEqual(
    recommendProducts([fixture({ available: false })], requirements),
    [],
  );
  assert.deepEqual(
    recommendProducts(demoProducts, { ...requirements, budget: 1 }),
    [],
  );
  assert.deepEqual(
    recommendProducts(demoProducts, { ...requirements, minValidity: 365 }),
    [],
  );
});
test("invalid budget fails closed", () => {
  for (const budget of [NaN, Infinity, -1, 0])
    assert.deepEqual(
      recommendProducts(demoProducts, { ...requirements, budget }),
      [],
    );
});
test("reasons and scores are deterministic and explain alternatives", () => {
  const result = recommendProducts(
    [fixture({ brand: "xl", validityDays: 60, usages: ["social"] })],
    { ...requirements, preferredBrand: "axis" },
  );
  assert.equal(result.length, 1);
  assert.ok(result[0].reasons.some((s) => s.includes("Alternatif merek")));
  assert.ok(result[0].reasons.some((s) => s.includes("berbeda")));
  assert.deepEqual(
    result,
    recommendProducts(
      [fixture({ brand: "xl", validityDays: 60, usages: ["social"] })],
      { ...requirements, preferredBrand: "axis" },
    ),
  );
});
const validIds = demoProducts.map((p) => p.id);
test("comparison never exceeds three; fourth addition is ignored", () => {
  let ids = [];
  for (const id of validIds) ids = toggleComparison(ids, id, validIds);
  assert.equal(ids.length, MAX_COMPARISON);
  assert.equal(ids.length, 3);
});
test("comparison removes a selected product and can replace it", () => {
  let ids = validIds.slice(0, 3);
  ids = toggleComparison(ids, ids[0], validIds);
  assert.equal(ids.length, 2);
  ids = toggleComparison(ids, validIds[3], validIds);
  assert.equal(ids.length, 3);
  assert.ok(ids.includes(validIds[3]));
});
test("comparison sanitizes duplicate, unknown IDs and overlong input", () => {
  assert.deepEqual(toggleComparison([], "unknown", validIds), []);
  assert.deepEqual(
    toggleComparison(
      [validIds[0], validIds[0], "unknown"],
      validIds[1],
      validIds,
    ),
    validIds.slice(0, 2),
  );
  assert.equal(toggleComparison(validIds, "unknown", validIds).length, 3);
});
