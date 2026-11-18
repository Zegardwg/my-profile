import assert from "node:assert/strict";
import { mkdir, readFile, writeFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { offlineRoutes, localAssets } from "../../scripts/pwa-settings.mjs";
if (!process.env.XLSMART_PLAYWRIGHT_MODULE) throw Error("Set XLSMART_PLAYWRIGHT_MODULE to the Playwright package directory.");
const { chromium } = await import(pathToFileURL(process.env.XLSMART_PLAYWRIGHT_MODULE + "/index.mjs").href);
const profile = await mkdtemp(join(tmpdir(), "xlsmart-pwa-qa-"));
const origin = process.env.XLSMART_QA_URL || "http://localhost:3100";
const context = await chromium.launchPersistentContext(profile, { channel: "msedge", headless: true, viewport: { width: 1024, height: 768 }, hasTouch: true });
const page = await context.newPage();
const errors = [], foreign = new Set();
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => { if (new URL(request.url()).origin !== origin) foreign.add(request.url()); });
const originalWorker = await readFile("public/sw.js", "utf8");
const ready = async () => {
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), { timeout: 30000 });
  await page.getByRole("status").filter({ hasText: "Siap digunakan offline" }).waitFor({ timeout: 30000 });
};
const activeVersion = () => page.evaluate(() => new Promise((resolve) => {
  const channel = new MessageChannel();
  channel.port1.onmessage = (event) => { channel.port1.close(); resolve(event.data.version); };
  navigator.serviceWorker.controller.postMessage({ type: "GET_STATUS" }, [channel.port2]);
}));
const noOverflow = async (label) => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), label);
const goto = async (route) => { const r = await page.goto(origin + route); assert.equal(r.status(), 200, route); await ready(); await page.locator("main h1").waitFor(); };
try {
  await mkdir("docs/qa", { recursive: true });
  await goto("/");
  const manifest = await (await context.request.get(origin + "/manifest.webmanifest")).json();
  assert.equal(manifest.display, "standalone"); assert.equal(manifest.start_url, "/");
  const cdp = await context.newCDPSession(page);
  const installability = await cdp.send("Page.getInstallabilityErrors");
  assert.deepEqual(installability.installabilityErrors, []);
  for (const icon of manifest.icons) {
    const size = await page.evaluate(async (src) => { const image = new Image(); image.src = src; await image.decode(); return [image.naturalWidth, image.naturalHeight]; }, icon.src);
    assert.equal(size.join("x"), icon.sizes);
  }
  const swResponse = await context.request.get(origin + "/sw.js");
  assert.match(swResponse.headers()["cache-control"], /no-store/);
  assert.match(swResponse.headers()["permissions-policy"], /camera=\(\)/);
  const cachedUrls = await page.evaluate(async () => (await Promise.all((await caches.keys()).map(async (key) => (await (await caches.open(key)).keys()).map((r) => r.url)))).flat());
  for (const path of [...offlineRoutes, ...localAssets]) assert.ok(cachedUrls.includes(origin + path), path);
  assert.ok(cachedUrls.every((url) => new URL(url).origin === origin && !new URL(url).search));
  console.log("PASS fresh installation, Chromium installability, local icons, headers and complete precache");

  // Only Home has been visited. Clear the HTTP cache so offline tests prove SW precaching.
  await cdp.send("Network.clearBrowserCache");
  await context.setOffline(true);
  // CDP also sets navigator.onLine for persistent Edge profiles.
  await cdp.send("Network.emulateNetworkConditions", { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
  for (const [width, height] of [[768, 1024], [1024, 768], [800, 1280], [1280, 800], [375, 812]]) {
    await page.setViewportSize({ width, height });
    for (const route of offlineRoutes) {
      await goto(route); await noOverflow(route + " " + width);
      await page.getByRole("status").filter({ hasText: /Offline/ }).waitFor();
    }
    console.log("PASS cold offline routes + no page overflow at " + width + "x" + height);
  }
  await page.setViewportSize({ width: 1024, height: 768 });
  await goto("/catalog");
  await page.getByLabel("Cari contoh paket").fill("FOCUS");
  await page.getByText("2 dari 18 paket demo", { exact: true }).waitFor();
  await page.getByLabel("Cari contoh paket").fill("");
  await page.getByRole("tab", { name: "XL", exact: true }).click();
  await page.getByText("6 dari 18 paket demo", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Filter paket", exact: true }).click();
  const drawer = page.getByRole("dialog");
  await drawer.getByLabel("Maksimum", { exact: true }).fill("50000");
  await drawer.getByLabel("Ketersediaan demo", { exact: true }).selectOption("available");
  await drawer.getByRole("button", { name: "Lihat 1 hasil", exact: true }).click();
  assert.equal(await page.locator("main article:visible").count(), 1);
  await goto("/catalog");
  await page.getByLabel("Urutkan paket").selectOption("quota-desc");
  for (let i=0;i<3;i++) await page.locator("main article:visible").nth(i).getByRole("button", { name: /^Bandingkan / }).click();
  await page.getByRole("link", { name: /Bandingkan \(3\/3\)/ }).click();
  await page.waitForURL("**/compare"); await ready();
  await page.locator("thead th").nth(3).waitFor();
  assert.equal(await page.locator("tbody tr").count(), 7);
  await noOverflow("filled comparison landscape");
  await page.reload(); await ready(); await page.locator("thead th").nth(3).waitFor();
  await page.screenshot({ path: "docs/qa/phase5-compare-offline-landscape.png" });
  console.log("PASS offline filters, sort, document-link navigation, comparison and reload persistence");
  await page.getByRole("button", { name: "Buka navigasi" }).click();
  await page.getByRole("navigation", { name: "Navigasi mobile" }).getByRole("link", { name: "Cari paket", exact: true }).click();
  await page.waitForURL("**/finder"); await ready();
  await page.getByLabel("Anggaran maksimum (Rupiah)").fill("100000");
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  await page.getByLabel("Gaming", { exact: true }).check();
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  await page.getByLabel("Preferensi masa aktif", { exact: true }).selectOption("30");
  await page.getByLabel("Wajib minimal masa aktif yang dipilih").check();
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  await page.getByLabel("Preferensi merek", { exact: true }).selectOption("axis");
  await page.getByLabel("Hanya merek pilihan (syarat wajib)").check();
  await page.getByRole("button", { name: "Lihat rekomendasi", exact: true }).click();
  const cards = page.locator("main article:visible");
  assert.ok(await cards.count() > 0 && await cards.count() <= 3);
  for (const card of await cards.all()) assert.ok(await card.getByText("AXIS", { exact: true }).isVisible());
  await page.setViewportSize({ width: 768, height: 1024 }); await noOverflow("finder portrait results");
  await page.getByRole("heading", { name: "Langkah 5: Rekomendasi", exact: true }).evaluate((node) => node.scrollIntoView({ block: "start", behavior: "instant" }));
  assert.ok(await page.getByRole("heading", { name: "Langkah 5: Rekomendasi", exact: true }).evaluate((node) => node.getBoundingClientRect().top >= document.querySelector("header").getBoundingClientRect().bottom), "finder heading is below sticky navigation");
  await page.screenshot({ path: "docs/qa/phase5-finder-offline-portrait.png" });
  console.log("PASS offline tablet menu and finder with mandatory brand/validity constraints");

  const fallback = await page.goto(origin + "/page-not-cached");
  assert.ok(fallback.fromServiceWorker());
  await page.getByRole("heading", { name: "Halaman ini belum tersedia offline." }).waitFor();
  assert.ok(await page.locator("img").evaluate((img) => img.complete && img.naturalWidth > 0));
  await goto("/activation-guide");
  await page.getByRole("link", { name: /Buka kanal XL/ }).click();
  await page.getByRole("alert").filter({ hasText: /Tautan resmi memerlukan internet/ }).waitFor();
  assert.equal(context.pages().length, 2); // Persistent context also has its initial blank tab.
  assert.equal(await page.locator("main input, main textarea, main iframe, main video").count(), 0);
  assert.deepEqual([...foreign], []);
  console.log("PASS cached fallback/image, no external requests and no offline registration");

  await context.setOffline(false);
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await page.clock.install({ time: new Date("2027-01-01T12:00:00Z") });
  await goto("/catalog");
  await page.getByRole("status").filter({ hasText: /Informasi katalog lebih dari 30 hari/ }).waitFor();
  await page.clock.setSystemTime(new Date());
  const repeat = await context.newPage(); await repeat.goto(origin + "/finder");
  await repeat.waitForFunction(() => Boolean(navigator.serviceWorker.controller)); await repeat.close();
  console.log("PASS expired catalog warning and repeat visit");

  // A second release must wait, preserve active work, then reload only on explicit apply.
  const oldVersion = /"version":"([^"]+)"/.exec(originalWorker)[1];
  const newVersion = oldVersion + "-qa";
  await writeFile("public/sw.js", originalWorker.replace('"version":"' + oldVersion + '"', '"version":"' + newVersion + '"'));
  await page.evaluate(async () => { const reg = await navigator.serviceWorker.getRegistration(); await reg.update(); });
  await page.getByRole("complementary", { name: "Pembaruan aplikasi" }).waitFor({ timeout: 30000 });
  assert.equal(await activeVersion(), oldVersion, "old release stays active until explicit apply");
  const beforeUpdateIds = await page.evaluate(() => localStorage.getItem("xlsmart-comparison-ids-v1"));
  await page.getByRole("button", { name: "Perbarui sekarang", exact: true }).click();
  await page.waitForEvent("load"); await ready();
  assert.equal(await activeVersion(), newVersion);
  assert.equal(await page.evaluate(() => localStorage.getItem("xlsmart-comparison-ids-v1")), beforeUpdateIds);
  assert.ok(await page.evaluate(async (version) => (await caches.keys()).includes("xlsmart-public-" + version), newVersion));
  await context.setOffline(true); await goto("/compare"); await page.locator("thead th").nth(3).waitFor();
  console.log("PASS waiting update, explicit apply, preserved product selection and updated offline release");
  assert.deepEqual(errors, [], "no runtime errors");
  console.log("PASS Phase 5 browser acceptance");
} finally {
  await writeFile("public/sw.js", originalWorker);
  await context.close();
}
