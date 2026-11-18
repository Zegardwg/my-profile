import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import { offlineRoutes, localAssets } from "../scripts/pwa-settings.mjs";
import { catalogFreshness } from "../src/lib/catalog-freshness.ts";
import { readComparisonIds } from "../src/lib/comparison-storage.ts";
const origin = "https://sales.example";
const template = await readFile("scripts/service-worker.template.js", "utf8");
function worker({ version = "test", fail = "", online = true } = {}) {
  const listeners = {}, stores = new Map(), calls = [];
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async (name) => stores.delete(name),
    open: async (name) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      const key = (request) => typeof request === "string" ? request : request.url;
      return { put: async (request, response) => entries.set(key(request), response), match: async (request) => entries.get(key(request))?.clone() };
    },
  };
  const self = { location: { origin }, addEventListener: (name, handler) => { listeners[name] = handler; }, clients: { claim: async () => {} }, skipWaiting: async () => calls.push("skipWaiting") };
  vm.runInNewContext(template.replace("/*__PWA_CONFIG__*/ null", JSON.stringify({ version, routes: offlineRoutes, urls: [...offlineRoutes, ...localAssets, "/_next/static/demo.js"] })), {
    self, caches, URL, Request, Response, Set,
    fetch: async (request) => {
      const url = typeof request === "string" ? request : request.url;
      calls.push(url);
      if (!online || new URL(url).pathname === fail) throw Error("network unavailable");
      return new Response("public release", { headers: { "Content-Type": offlineRoutes.includes(new URL(url).pathname) ? "text/html" : "text/plain" } });
    },
  });
  return { stores, calls, caches, async dispatch(name, event = {}) { let result; listeners[name]({ ...event, waitUntil: (p) => { result = p; }, respondWith: (p) => { result = p; } }); return await result; }, offline() { online = false; } };
}
test("freshness boundary, invalid clock, future date and expired demo data", () => {
  assert.equal(catalogFreshness("2026-11-18", "2026-12-18", 30).stale, false);
  assert.equal(catalogFreshness("2026-11-18", "2026-12-19", 30).stale, true);
  assert.equal(catalogFreshness("invalid", "2026-12-19", 30).stale, true);
  assert.equal(catalogFreshness("2026-11-18", "2026-11-17", 30).stale, true);
});
test("persisted comparison accepts only known product IDs, maximum three", () => {
  assert.deepEqual(readComparisonIds('["a","a","NIK","b","c","d"]', ["a","b","c","d"]), ["a","b","c"]);
  for (const raw of ["{", "null", '"otp"', '{"nik":"123"}']) assert.deepEqual(readComparisonIds(raw, ["a"]), []);
});
test("installation precaches all public routes and local assets, never skips waiting", async () => {
  const w = worker(); await w.dispatch("install");
  const entries = w.stores.get("xlsmart-public-test");
  for (const path of [...offlineRoutes, ...localAssets]) assert.ok(entries.has(origin + path), path);
  assert.ok(entries.has(origin + "/__xlsmart_offline_ready__"));
  assert.ok(!w.calls.includes("skipWaiting"));
});
test("failed installation deletes partial cache and preserves existing release", async () => {
  const w = worker({ fail: "/finder" });
  await w.caches.open("xlsmart-public-old");
  await assert.rejects(w.dispatch("install"));
  assert.equal(w.stores.has("xlsmart-public-test"), false);
  assert.equal(w.stores.has("xlsmart-public-old"), true);
});
test("offline documents, Flight failures, local assets and unknown-page fallback", async () => {
  const w = worker(); await w.dispatch("install"); w.offline();
  for (const path of offlineRoutes) {
    const response = await w.dispatch("fetch", { request: { url: origin + path, method: "GET", headers: new Headers(), mode: "navigate" } });
    assert.equal(response.headers.get("content-type"), "text/html");
  }
  const flight = await w.dispatch("fetch", { request: new Request(origin + "/catalog?_rsc=abc", { headers: { rsc: "1" } }) });
  assert.equal(flight.headers.get("content-type"), "text/html");
  const fallback = await w.dispatch("fetch", { request: { url: origin + "/missing", method: "GET", headers: new Headers(), mode: "navigate" } });
  assert.equal(await fallback.text(), "public release");
  const asset = await w.dispatch("fetch", { request: new Request(origin + "/images/package-placeholder.svg") });
  assert.equal(await asset.text(), "public release");
});
test("external, authentication, API, authorized and non-GET requests bypass worker", async () => {
  const w = worker(); await w.dispatch("install"); const count = w.calls.length;
  for (const request of [
    new Request("https://registrasi.xl.co.id/"), new Request(origin + "/api/customer"),
    new Request(origin + "/registration?nik=123"), new Request(origin + "/activation"),
    new Request(origin + "/auth"), new Request(origin + "/catalog", { headers: { authorization: "Bearer example" } }),
    new Request(origin + "/catalog", { method: "POST", body: "otp=123" }),
  ]) assert.equal(await w.dispatch("fetch", { request }), undefined);
  assert.equal(w.calls.length, count);
});
test("activation preserves foreign caches and one preceding public release", async () => {
  const w = worker();
  for (const name of ["unrelated", "xlsmart-public-oldest", "xlsmart-public-previous", "xlsmart-public-test"]) await w.caches.open(name);
  await w.dispatch("activate");
  assert.deepEqual(await w.caches.keys(), ["unrelated", "xlsmart-public-previous", "xlsmart-public-test"]);
});
test("only a same-origin client can request application of waiting update", async () => {
  const w = worker();
  await w.dispatch("message", { source: { url: "https://foreign.example/" }, data: { type: "SKIP_WAITING" } });
  assert.deepEqual(w.calls, []);
  await w.dispatch("message", { source: { url: origin + "/" }, data: { type: "SKIP_WAITING" } });
  assert.deepEqual(w.calls, ["skipWaiting"]);
});
