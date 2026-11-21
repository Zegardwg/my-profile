import test from "node:test";
import assert from "node:assert/strict";
import {
  productSchema,
  backupSchema,
  checkBackupSize,
  localVerificationDay,
  parseBackup,
  catalogSignature,
} from "../src/lib/product-schema.ts";
import { productInformationLabel } from "../src/lib/product-information.ts";
import { demoProducts } from "../src/data/demo-products.ts";
import { filterProducts, defaultFilters } from "../src/lib/product-filters.ts";
import { recommendProducts } from "../src/lib/recommendation-engine.ts";
const base = demoProducts[1];
const verified = {
  ...base,
  informationStatus: "verified",
  sourceUrl: "https://www.xl.co.id/",
  lastVerifiedAt: "2026-01-01",
};
const backup = (products) => ({
  format: "xlsmart-catalog",
  version: 1,
  exportedAt: "2026-11-18T00:00:00.000Z",
  products,
});
const requirements = {
  budget: 100000,
  usage: "general",
  preferredValidity: 30,
  preferredBrand: "all",
  minValidity: 0,
  requiredBrand: "all",
};
test("all initial products validate, have explicit demo status and are unverified", () => {
  for (const product of demoProducts) {
    assert.equal(productSchema.safeParse(product).success, true);
    assert.equal(product.informationStatus, "demo");
    assert.equal(product.lastVerifiedAt, "");
  }
});
test("nonnegative integer Rupiah, positive integer validity and finite quota are enforced", () => {
  for (const patch of [
    { price: -1 },
    { price: 0.5 },
    { price: NaN },
    { price: Infinity },
    { quotaGb: -1 },
    { quotaGb: NaN },
    { validityDays: 0 },
    { validityDays: 1.2 },
    { validityDays: -1 },
  ])
    assert.equal(
      productSchema.safeParse({ ...base, ...patch }).success,
      false,
      JSON.stringify(patch),
    );
  assert.equal(
    productSchema.safeParse({ ...base, price: 0, quotaGb: 0, validityDays: 1 })
      .success,
    true,
  );
});
test("blank names, empty benefits/conditions, unknown placeholders and extra fields rejected", () => {
  for (const patch of [
    { name: " " },
    { category: "" },
    { benefits: [] },
    { restrictions: [""] },
    { placeholderId: "remote-image" },
    { imageUrl: "https://example.org/p.png" },
    { nik: "123" },
  ])
    assert.equal(productSchema.safeParse({ ...base, ...patch }).success, false);
});
test("manual verification requires explicit status and a nonfuture date, validates an optional source", () => {
  assert.equal(productSchema.safeParse(verified).success, true);
  assert.equal(productSchema.safeParse({ ...verified, sourceUrl: "" }).success, true);
  for (const patch of [

    { sourceUrl: "javascript:alert(1)" },
    { sourceUrl: "http://example.org" },
    { lastVerifiedAt: "" },
    { lastVerifiedAt: "2099-01-01" },
    { lastVerifiedAt: "2026-02-30" },
  ])
    assert.equal(
      productSchema.safeParse({ ...verified, ...patch }).success,
      false,
    );
  assert.equal(productSchema.parse(base).informationStatus, "demo");
  assert.match(productInformationLabel(base), /DATA DEMO/);
  assert.match(productInformationLabel(verified), /BUKAN VERIFIKASI OPERATOR/);
});
test("verification uses the calendar day on the promoter device", () => {
  assert.equal(localVerificationDay(new Date(2026, 10, 20, 0, 5)), "2026-11-20");
  assert.equal(localVerificationDay(new Date(2026, 0, 1, 23, 55)), "2026-01-01");
});
test("backup preserves records, archived entries and timestamp through JSON roundtrip", () => {
  const input = backup([
    base,
    { ...verified, id: "custom-verified", archived: true },
  ]);
  assert.deepEqual(parseBackup(JSON.stringify(input)), input);
});
test("invalid JSON, unsupported format versions, duplicate IDs and unknown personal fields fail closed", () => {
  for (const raw of [
    "{",
    "null",
    JSON.stringify({ ...backup([base]), version: 2 }),
    JSON.stringify(backup([base, base])),
    JSON.stringify({ ...backup([base]), customer: { nik: "123" } }),
    JSON.stringify(backup([{ ...base, price: -1 }])),
  ])
    assert.throws(() => parseBackup(raw));
  assert.equal(backupSchema.safeParse(backup([])).success, true);
  assert.throws(() => checkBackupSize(192 * 1024 * 1024 + 1), /192 MB/);
});
test("restores a valid catalog above the former 5 MB import limit", () => {
  const benefits = Array(20).fill("a".repeat(300));
  const products = Array.from({ length: 900 }, (_, i) => ({
    ...base, id: "large-" + i, benefits,
  }));
  const raw = JSON.stringify(backup(products));
  assert.ok(Buffer.byteLength(raw) > 5 * 1024 * 1024);
  checkBackupSize(Buffer.byteLength(raw));
  assert.equal(parseBackup(raw).products.length, products.length);
});
test("products above the seed price range are visible by default", () => {
  const product = { ...base, price: 300000 };
  assert.deepEqual(filterProducts([product], defaultFilters), [product]);
  assert.deepEqual(filterProducts([product], { ...defaultFilters, maxPrice: 250000 }), []);
});
test("catalog signatures ignore order, detect edits, additions and revisions", () => {
  const products = [base, demoProducts[2]];
  assert.equal(
    catalogSignature(products),
    catalogSignature([...products].reverse()),
  );
  assert.notEqual(
    catalogSignature(products),
    catalogSignature([{ ...base, revision: 2 }, products[1]]),
  );
  assert.notEqual(catalogSignature(products), catalogSignature([base]));
});
test("sales filtering and recommendations respect archive and information status", () => {
  const products = [
    base,
    { ...verified, id: "verified" },
    { ...base, id: "archived", archived: true },
    { ...verified, id: "unavailable", available: false },
  ];
  assert.deepEqual(
    filterProducts(products, {
      ...defaultFilters,
      informationStatus: "demo",
    }).map((p) => p.id),
    [base.id],
  );
  assert.deepEqual(
    filterProducts(products, {
      ...defaultFilters,
      informationStatus: "verified",
      availability: "available",
    }).map((p) => p.id),
    ["verified"],
  );
  assert.deepEqual(
    recommendProducts(products, {
      ...requirements,
      informationStatus: "verified",
    }).map((r) => r.product.id),
    ["verified"],
  );
  assert.deepEqual(
    recommendProducts(products, {
      ...requirements,
      informationStatus: "demo",
    }).map((r) => r.product.id),
    [base.id],
  );
});
test("free packages never produce NaN scores and archived products never enter rankings", () => {
  const result = recommendProducts(
    [
      { ...base, price: 0, quotaGb: 0 },
      { ...base, id: "archived", archived: true },
    ],
    requirements,
  );
  assert.equal(result.length, 1);
  assert.ok(Number.isFinite(result[0].score));
  assert.equal(result[0].monthlyCost, 0);
});
