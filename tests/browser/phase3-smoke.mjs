import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

if (!process.env.XLSMART_PLAYWRIGHT_MODULE)
  throw new Error(
    "Set XLSMART_PLAYWRIGHT_MODULE to a temporary Playwright package directory.",
  );
const { chromium } = await import(
  pathToFileURL(process.env.XLSMART_PLAYWRIGHT_MODULE + "/index.mjs").href
);
const browser = await chromium.launch({ channel: "msedge", headless: true });
const origin = process.env.XLSMART_QA_URL || "http://localhost:3100";
const screenshotDir = "docs/qa";
await mkdir(screenshotDir, { recursive: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
async function goto(path) {
  const response = await page.goto(origin + path);
  assert.equal(response.status(), 200, path + " HTTP status");
  await page.waitForLoadState("networkidle");
}
async function noOverflow(context) {
  const width = await page.evaluate(() => ({
    actual: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  assert.ok(
    width.actual <= width.viewport + 1,
    context + " overflows: " + JSON.stringify(width),
  );
}
async function check(condition, label) {
  assert.ok(await condition(), label);
  console.log("PASS " + label);
}
try {
  for (const [width, height] of [
    [375, 812],
    [768, 1024],
    [1024, 768],
    [1280, 800],
  ]) {
    await page.setViewportSize({ width, height });
    for (const route of ["/", "/catalog", "/finder", "/compare"]) {
      await goto(route);
      await noOverflow(route + " " + width);
      assert.equal(await page.locator("h1").count(), 1);
    }
    console.log(
      "PASS all routes + no page overflow at " + width + "x" + height,
    );
  }
  await page.setViewportSize({ width: 1024, height: 768 });
  await goto("/");
  await page
    .getByRole("link", { name: "Jelajahi paket demo", exact: true })
    .click();
  await page.waitForURL("**/catalog");
  await check(
    () => page.getByText("18 dari 18 paket demo", { exact: true }).isVisible(),
    "homepage links to catalog",
  );
  assert.equal(await page.locator("main:visible article:visible").count(), 18);
  for (const card of await page.locator("main:visible article:visible").all()) {
    assert.ok(
      await card
        .getByText("DATA DEMO - BUKAN PENAWARAN RESMI", { exact: true })
        .isVisible(),
    );
    assert.equal(await card.getByRole("img").count(), 1);
  }
  console.log("PASS every catalog card has demo label and placeholder");
  await page.getByLabel("Cari contoh paket").fill("FOCUS");
  await check(
    () => page.getByText("2 dari 18 paket demo", { exact: true }).isVisible(),
    "keyword search",
  );
  await page.getByLabel("Cari contoh paket").fill("");
  await page.getByRole("tab", { name: "XL", exact: true }).click();
  await check(
    () => page.getByText("6 dari 18 paket demo", { exact: true }).isVisible(),
    "brand tabs",
  );
  await page.getByRole("button", { name: "Filter paket", exact: true }).click();
  let drawer = page.getByRole("dialog");
  await drawer.getByLabel("Maksimum", { exact: true }).fill("50000");
  await drawer
    .getByLabel("Ketersediaan demo", { exact: true })
    .selectOption("available");
  await drawer
    .getByRole("button", { name: "Lihat 1 hasil", exact: true })
    .click();
  assert.equal(await page.locator("main:visible article:visible").count(), 1);
  console.log("PASS tablet drawer combined price + availability filters");
  await page.getByRole("button", { name: "Filter paket", exact: true }).click();
  drawer = page.getByRole("dialog");
  await drawer.getByLabel("Kuota utama minimum").selectOption("30");
  await drawer
    .getByRole("button", { name: "Lihat 0 hasil", exact: true })
    .click();
  await check(
    () =>
      page
        .getByRole("heading", { name: "Belum ada paket yang sesuai" })
        .isVisible(),
    "catalog empty state",
  );
  await page
    .getByRole("button", { name: "Bersihkan filter", exact: true })
    .click();
  await page.getByLabel("Urutkan paket").selectOption("quota-desc");
  await check(
    () =>
      page
        .locator("main:visible article:visible")
        .first()
        .getByRole("heading", { name: "Long Stories" })
        .isVisible(),
    "largest quota sorting",
  );
  await page
    .locator("main:visible article:visible")
    .first()
    .getByRole("button", { name: "Detail Long Stories", exact: true })
    .click();
  await check(
    () =>
      page
        .getByRole("dialog")
        .getByRole("heading", { name: "Long Stories", exact: true })
        .isVisible(),
    "product detail dialog",
  );
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: screenshotDir + "/phase3-catalog-tablet.png",
    fullPage: false,
  });
  for (let i = 0; i < 3; i++)
    await page
      .locator("main:visible article:visible")
      .nth(i)
      .getByRole("button", { name: /^Bandingkan / })
      .click();
  assert.ok(
    await page
      .locator("main:visible article:visible")
      .nth(3)
      .getByRole("button", { name: /^Bandingkan / })
      .isDisabled(),
  );
  console.log("PASS compare selection capped at three");
  await page.getByRole("link", { name: /Bandingkan \(3\/3\)/ }).click();
  await page.waitForURL("**/compare");
  assert.equal(await page.locator("thead th").count(), 4);
  assert.equal(await page.locator("tbody tr").count(), 7);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: screenshotDir + "/phase3-compare-tablet.png",
    fullPage: false,
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await noOverflow("populated compare mobile");
  const scrollable = await page
    .getByRole("region", {
      name: "Tabel perbandingan paket, dapat digeser horizontal",
    })
    .evaluate((element) => element.scrollWidth > element.clientWidth);
  assert.ok(scrollable);
  await page
    .getByRole("button", { name: /^Hapus .* dari perbandingan$/ })
    .first()
    .click();
  assert.equal(await page.locator("thead th").count(), 3);
  await page.getByRole("button", { name: "Bersihkan perbandingan" }).click();
  await check(
    () =>
      page
        .getByRole("heading", { name: "Belum ada paket untuk dibandingkan" })
        .isVisible(),
    "compare persistence across navigation, remove + clear",
  );
  await page.getByRole("button", { name: "Buka navigasi" }).click();
  await page
    .getByRole("navigation", { name: "Navigasi mobile" })
    .getByRole("link", { name: "Cari paket" })
    .click();
  await page.waitForURL("**/finder");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  console.log("PASS mobile menu navigation");
  await page.getByLabel("Anggaran maksimum (Rupiah)").fill("100000");
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  await page.getByLabel("Gaming", { exact: true }).check();
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  await page
    .getByLabel("Preferensi masa aktif", { exact: true })
    .selectOption("30");
  await page.getByLabel("Wajib minimal masa aktif yang dipilih").check();
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  await page
    .getByLabel("Preferensi merek", { exact: true })
    .selectOption("axis");
  await page.getByLabel("Hanya merek pilihan (syarat wajib)").check();
  await page
    .getByRole("button", { name: "Lihat rekomendasi", exact: true })
    .click();
  const results = await page.locator("main:visible article:visible").count();
  assert.ok(results > 0 && results <= 3);
  for (const card of await page.locator("main:visible article:visible").all()) {
    assert.ok(await card.getByText("AXIS", { exact: true }).isVisible());
    assert.ok(
      await card.getByText("Tersedia · demo", { exact: true }).isVisible(),
    );
  }
  await noOverflow("finder mobile results");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: screenshotDir + "/phase3-finder-mobile.png",
    fullPage: true,
  });
  console.log(
    "PASS five-step finder with hard brand and validity requirements",
  );
  await page.getByRole("button", { name: "Mulai ulang", exact: true }).click();
  await page.getByLabel("Anggaran maksimum (Rupiah)").fill("1");
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  await page
    .getByRole("button", { name: "Lihat rekomendasi", exact: true })
    .click();
  await check(
    () =>
      page
        .getByRole("heading", {
          name: "Belum ada paket yang memenuhi kebutuhan",
        })
        .isVisible(),
    "finder honest no-match",
  );
  assert.equal(await page.locator("main:visible article:visible").count(), 0);
  await page
    .getByRole("button", { name: "Ubah anggaran", exact: true })
    .click();
  await check(
    () => page.getByLabel("Anggaran maksimum (Rupiah)").isVisible(),
    "no-match can relax budget explicitly",
  );
  assert.deepEqual(errors, [], "no runtime browser errors");
  console.log("PASS no runtime errors");
} finally {
  await browser.close();
}
