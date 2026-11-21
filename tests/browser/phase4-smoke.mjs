import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
if (!process.env.XLSMART_PLAYWRIGHT_MODULE) throw new Error("Set XLSMART_PLAYWRIGHT_MODULE to the temporary Playwright directory.");
const { chromium } = await import(pathToFileURL(process.env.XLSMART_PLAYWRIGHT_MODULE + "/index.mjs").href);
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
const origin = process.env.XLSMART_QA_URL || "http://localhost:3100";
const errors = [];
const foreignRequests = new Set();
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => { const url = new URL(request.url()); if (url.origin !== origin && url.protocol.startsWith("http")) foreignRequests.add(url.origin); });
await page.addInitScript(() => {
  window.__cameraCalls = 0;
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia = async () => { window.__cameraCalls++; throw new Error("Camera access must not occur in customer trust experience"); };
  }
});
await mkdir("docs/qa", { recursive: true });
const routes = ["/promoter", "/trust", "/activation-guide", "/sales-assistant"];
async function goto(route) {
  const response = await page.goto(origin + route);
  assert.equal(response.status(), 200);
  await page.waitForLoadState("networkidle");
}
async function noOverflow(label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), label + ": page overflow");
}
async function shot(name) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "docs/qa/" + name + ".png", fullPage: false });
}
async function assertNoCollection() {
  assert.equal(await page.locator("main:visible input, main:visible textarea, main:visible iframe, main:visible video").count(), 0);
  assert.equal(await page.evaluate(() => window.__cameraCalls), 0);
}
try {
  for (const [width, height] of [[375, 812], [768, 1024], [1024, 768], [1280, 800]]) {
    await page.setViewportSize({ width, height });
    for (const route of routes) {
      await goto(route); await noOverflow(route + " at " + width); await assertNoCollection();
      assert.equal(await page.locator("main:visible h1").count(), 1);
      assert.ok(await page.getByRole("complementary", { name: "Status aplikasi personal" }).isVisible());
      const targets = await page.locator("main:visible a:visible, main:visible button:visible, main:visible summary:visible").evaluateAll((nodes) => nodes.filter((node) => node.getBoundingClientRect().height < 43.5).map((node) => node.textContent));
      assert.deepEqual(targets, [], "touch targets >= 44px");
    }
    console.log("PASS trust routes, no overflow, 44px targets and no sensitive fields/camera at " + width + "x" + height);
  }
  await page.setViewportSize({ width: 1024, height: 768 });
  await goto("/");
  await page.getByRole("button", { name: "Buka navigasi" }).click();
  const hub = page.getByRole("navigation", { name: "Navigasi mobile" });
  for (const route of routes) assert.equal(await hub.locator('a[href="' + route + '"]').count(), 1);
  await hub.getByRole("link", { name: /Profil promotor/ }).click();
  await page.waitForURL("**/promoter");
  assert.ok(await page.getByRole("heading", { name: "Promotor Contoh", exact: true }).isVisible());
  assert.ok(await page.getByText("DATA DEMO · PROFIL CONTOH", { exact: true }).isVisible());
  assert.ok(await page.getByRole("img", { name: /Placeholder foto profil/ }).isVisible());
  assert.ok((await page.locator("main:visible").innerText()).includes("Tidak diverifikasi oleh aplikasi"));
  await shot("phase4-promoter-tablet");
  console.log("PASS homepage trust links, explicit demo profile and no official ID claim");
  const nav = page.getByRole("navigation", { name: "Navigasi kepercayaan pelanggan" });
  await nav.getByRole("link", { name: "Pusat kepercayaan", exact: true }).click();
  await page.waitForURL("**/trust");
  let faq = page.locator('main:visible details[name="customer-trust-faq"]');
  await faq.nth(1).locator("summary").click();
  assert.equal(await faq.nth(1).getAttribute("open"), "");
  await faq.nth(4).locator("summary").focus(); await page.keyboard.press("Enter");
  assert.equal(await faq.nth(4).getAttribute("open"), "");
  assert.equal(await faq.nth(1).getAttribute("open"), null);
  console.log("PASS FAQ mouse/keyboard accordion interactions");
  await shot("phase4-trust-tablet");
  await page.getByRole("navigation", { name: "Navigasi kepercayaan pelanggan" }).getByRole("link", { name: "Panduan registrasi", exact: true }).click();
  await page.waitForURL("**/activation-guide");
  const xlLink = page.getByRole("link", { name: /Buka kanal XL/ });
  assert.equal(await xlLink.getAttribute("href"), "https://registrasi.xl.co.id/");
  assert.equal(await xlLink.getAttribute("target"), "_blank");
  assert.match(await xlLink.getAttribute("rel"), /noopener/);
  assert.equal(await page.getByText("Tautan belum dikonfigurasi.", { exact: false }).count(), 2);
  for (const link of await page.locator("main:visible a[target='_blank']").all()) {
    const url = new URL(await link.getAttribute("href"));
    assert.equal(url.protocol, "https:");
    assert.ok(["jdih.komdigi.go.id", "portal.komdigi.go.id", "www.xl.co.id", "registrasi.xl.co.id"].includes(url.hostname));
  }
  console.log("PASS official XL URL, sourced HTTPS reference allowlist, other registration URLs unconfigured");
  await page.getByRole("button", { name: "Mode presentasi pelanggan", exact: true }).click();
  let dialog = page.getByRole("dialog", { name: "Mode presentasi pelanggan", exact: true });
  assert.ok(await dialog.getByRole("heading", { name: "Pilih sesuai kebutuhan", exact: true }).isVisible());
  assert.ok(await dialog.getByRole("button", { name: "Sebelumnya", exact: true }).isDisabled());
  await page.keyboard.press("ArrowRight");
  assert.ok(await dialog.getByRole("heading", { name: "Baca informasi paket", exact: true }).isVisible());
  for (let i = 0; i < 5; i++) await dialog.getByRole("button", { name: "Berikutnya", exact: true }).click();
  assert.ok(await dialog.getByRole("heading", { name: "Periksa status di sistem sebenarnya", exact: true }).isVisible());
  assert.ok(await dialog.getByRole("button", { name: "Berikutnya", exact: true }).isDisabled());
  await page.keyboard.press("ArrowLeft");
  assert.ok(await dialog.getByRole("heading", { name: "Registrasi di kanal resmi", exact: true }).isVisible());
  assert.equal(await dialog.locator("input, textarea, iframe, video").count(), 0);
  await page.screenshot({ path: "docs/qa/phase4-presentation-tablet.png" });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.ok(await page.getByRole("button", { name: "Mode presentasi pelanggan", exact: true }).evaluate((element) => element === document.activeElement));
  console.log("PASS presentation boundaries, keyboard navigation, Escape and focus restoration");
  await page.getByRole("navigation", { name: "Navigasi kepercayaan pelanggan" }).getByRole("link", { name: "Percakapan layanan", exact: true }).click();
  await page.waitForURL("**/sales-assistant");
  const categories = page.getByRole("group", { name: "Topik kekhawatiran pelanggan" });
  assert.equal(await categories.getByRole("button").count(), 7);
  for (const button of await categories.getByRole("button").all()) {
    await button.click(); assert.equal(await button.getAttribute("aria-pressed"), "true");
    for (const text of ["Tanggapan yang disarankan", "Penjelasan yang relevan", "Langkah yang tepat", "Yang tidak boleh dijanjikan"]) assert.ok(await page.locator("main:visible").getByText(text, { exact: true }).isVisible());
  }
  await categories.getByRole("button", { name: "Hak untuk tidak melanjutkan", exact: true }).click();
  await page.getByRole("button", { name: "Presentasi cepat", exact: true }).click();
  dialog = page.getByRole("dialog", { name: "Mode presentasi pelanggan", exact: true });
  assert.ok(await dialog.getByRole("heading", { name: "Bolehkah saya menolak registrasi biometrik?", exact: true }).isVisible());
  assert.ok((await dialog.innerText()).includes("Saya akan menghormati pilihan Anda"));
  await dialog.getByRole("button", { name: "Keluar presentasi", exact: true }).click();
  console.log("PASS all seven conversation categories and quick presentation starts with selected concern");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Buka navigasi", exact: true }).click();
  await page.getByRole("navigation", { name: "Navigasi mobile" }).getByRole("link", { name: "Panduan registrasi", exact: true }).click();
  await page.waitForURL("**/activation-guide");
  await page.getByRole("button", { name: "Mode presentasi pelanggan", exact: true }).click();
  dialog = page.getByRole("dialog", { name: "Mode presentasi pelanggan", exact: true });
  for (const [width, height] of [[375, 812], [768, 1024], [1024, 768]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const fits = await dialog.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width <= innerWidth + 1 && rect.height <= innerHeight + 1 && element.scrollWidth <= element.clientWidth + 1;
    });
    assert.ok(fits, "presentation fits viewport " + width);
    const controls = await dialog.getByRole("button").evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
    assert.ok(controls.every((height) => height >= 44));
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "docs/qa/phase4-presentation-mobile.png" });
  await dialog.getByRole("button", { name: "Keluar presentasi", exact: true }).click();
  await assertNoCollection();
  assert.equal(await page.evaluate(() => window.__cameraCalls), 0);
  assert.deepEqual([...foreignRequests], []);
  assert.deepEqual(errors, []);
  console.log("PASS mobile navigation, responsive presentation, no external form loads or camera calls, no runtime errors");
} finally { await browser.close(); }
