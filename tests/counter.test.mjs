import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyOffer,
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
