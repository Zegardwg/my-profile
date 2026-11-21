import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyOffer,
  offerHighlights,
  initialCampaign,
  remainingStock,
  remainingClaims,
  validCode,
  quote,
  offerSchema,
} from "../src/lib/counter-model.ts";
test("only XL and Smartfren purchases can add one free AXIS", () => {
  for (const brand of ["xl", "smartfren", "axis"]) {
    const lines = quote(brand, 25000, false, true);
    assert.equal(lines.length, brand === "axis" ? 1 : 2);
    assert.equal(
      lines.reduce((n, l) => n + l.price, 0),
      25000,
    );
    assert.equal(quote(brand, 25000, false, false).length, 1);
  }
  assert.deepEqual(quote("axis", 25000, true, true), [
    { brand: "axis", price: 0, kind: "free" },
  ]);
  assert.ok(validCode(" xlSmart "));
  assert.ok(!validCode("XLSMART2"));
});
test("sale keeps the normal price on the invoice line and charges the selling price", () => {
  const offer = { ...emptyOffer("xl"), price: 40000, originalPrice: 50000 };
  assert.ok(offerSchema.safeParse(offer).success);
  for (const originalPrice of [0, 39999, 40000, 50000.5])
    assert.ok(!offerSchema.safeParse({ ...offer, originalPrice }).success);
  const lines = quote("xl", offer.price, false, true, offer.originalPrice);
  assert.deepEqual(lines, [
    { brand: "xl", price: 40000, originalPrice: 50000, kind: "sale" },
    { brand: "axis", price: 0, kind: "bonus" },
  ]);
});

test("highlights compare verified stock, allow ties and skip missing measurements", () => {
  const a = {
    ...emptyOffer("xl"),
    stock: 1,
    verifiedAt: "2026-01-01",
    price: 20000,
    days: 30,
    quota: 5,
  };
  const b = { ...a, brand: "axis", price: 10000, days: 10, quota: 8 };
  const c = { ...b, brand: "smartfren", quota: 0 };
  assert.deepEqual(offerHighlights([a, b, c], []), {
    xl: ["Masa aktif terpanjang"],
    axis: ["Harga terendah"],
    smartfren: ["Harga terendah"],
  });
  const pending = { stage: "pending", lines: [{ brand: "axis" }] };
  assert.deepEqual(
    offerHighlights([a, b, { ...c, verifiedAt: "" }], [pending]),
    { xl: [], axis: [], smartfren: [] },
  );
});

test("paid and pending invoices reserve physical cards including bonuses", () => {
  const axis = { ...emptyOffer("axis"), stock: 4 };
  const lines = quote("xl", 25000, false, true);
  assert.equal(
    remainingStock(
      axis,
      ["paid", "pending", "cancelled", "handed"].map((stage) => ({
        stage,
        lines,
      })),
    ),
    2,
  );
});
test("free quota includes fulfilled and reserved free cards only in its session", () => {
  const c = { ...initialCampaign, session: "current", limit: 5, used: 1 };
  const row = { method: "free", stage: "pending", session: "current" };
  assert.equal(
    remainingClaims(c, [
      row,
      { ...row, stage: "cancelled" },
      { ...row, session: "old" },
      { ...row, stage: "handed" },
      { ...row, method: "cash" },
    ]),
    3,
  );
});
test("new offers do not prefill sellable price, stock or verification; invalid stock and dates fail", () => {
  const o = emptyOffer("xl");
  assert.equal(o.price, 0);
  assert.equal(o.stock, 0);
  assert.ok(!o.verifiedAt);
  for (const patch of [
    { stock: -1 },
    { stock: 1.5 },
    { price: -1 },
    { price: NaN },
    { days: -1 },
    { verifiedAt: "tomorrow" },
  ])
    assert.ok(!offerSchema.safeParse({ ...o, ...patch }).success);
});
