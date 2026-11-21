import test from "node:test";
import assert from "node:assert/strict";
import { canBuyStarter, includesAxisBonus } from "../src/lib/starter-cards.ts";
import { demoProducts } from "../src/data/demo-products.ts";

const starter = { ...demoProducts[0], category: "  Kartu Perdana  ", informationStatus: "verified" };

test("customer checkout is enabled only for verified, available physical starter cards with a sale price", () => {
  assert.ok(canBuyStarter(starter));
  for (const change of [{ category: "Paket data" }, { price: 0 }, { informationStatus: "demo" }, { available: false }, { archived: true }]) {
    assert.equal(canBuyStarter({ ...starter, ...change }), false);
  }
});

test("paid AXIS is a standalone card, XL and Smartfren each include one AXIS bonus", () => {
  for (const brand of ["xl", "smartfren", "axis"]) {
    assert.ok(canBuyStarter({ ...starter, brand }));
    assert.equal(includesAxisBonus({ ...starter, brand }), brand !== "axis");
  }
});
