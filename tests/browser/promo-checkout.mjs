import { demoProducts } from "../../src/data/demo-products.ts";
import { showRecommendations } from "./finder-steps.mjs";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const { chromium } = await import(
  pathToFileURL(process.env.XLSMART_PLAYWRIGHT_MODULE + "/index.mjs").href
);
const origin = process.env.XLSMART_QA_URL || "http://localhost:3100";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1024, height: 768 },
  hasTouch: true,
});
const page = await ctx.newPage();
page.setDefaultTimeout(8000);
const errors = [];
ctx.on("page", (p) => p.on("pageerror", (e) => errors.push(e.message)));
page.on("pageerror", (e) => errors.push(e.message));
const btn = (name, p = page) => p.getByRole("button", { name, exact: true });
const dlg = (p = page) => p.getByRole("dialog").last();
const card = (brand, p = page) =>
  p.getByRole("article", { name: "Kartu perdana " + brand, exact: true });
async function mode(which, p = page) {
  await btn("Pilih mode tampilan", p).first().click();
  await btn("Gunakan mode " + which, p).click();
}
async function close(p = page) {
  await btn("Tutup", dlg(p)).click();
  await p.getByRole("dialog").waitFor({ state: "hidden" });
}
async function sale(brand, p = page) {
  await btn("Pilih & bayar", card(brand, p)).click();
  await dlg(p)
    .getByRole("img", { name: "Kemasan kartu perdana " + brand })
    .waitFor();
}
const waitText = (txt, p = page) =>
  p.getByText(txt, { exact: true }).first().waitFor();
try {
  const legacyContext = await browser.newContext();
  const legacy = await legacyContext.newPage();
  await legacy.goto(origin + "/offline.html");
  const previous = {
    ...demoProducts[0],
    id: "legacy-xl",
    brand: "xl",
    name: "Perdana sebelumnya",
    category: "Kartu perdana",
    price: 31000,
    available: true,
    informationStatus: "verified",
    lastVerifiedAt: "2026-01-05",
  };
  await legacy.evaluate(
    (product) =>
      new Promise((resolve, reject) => {
        const request = indexedDB.open("xlsmart-local-catalog", 20);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = () => {
          const store = request.result.createObjectStore("products", {
            keyPath: "id",
          });
          for (const key of ["brand", "name", "informationStatus", "updatedAt"])
            store.createIndex(key, key);
          store.add(product);
        };
        request.onsuccess = () => {
          request.result.close();
          resolve();
        };
      }),
    previous,
  );
  await legacy.goto(origin);
  await card("XL", legacy)
    .getByText(/31\.000/)
    .waitFor();
  await btn("Lihat kartu", card("XL", legacy)).click();
  await dlg(legacy)
    .getByText("Stok belum tersedia.", { exact: true })
    .waitFor();
  assert.ok(await btn("Lanjut bayar", legacy).isDisabled());
  const original = await legacy.evaluate(
    () =>
      new Promise((resolve) => {
        const db = indexedDB.open("xlsmart-local-catalog");
        db.onsuccess = () => {
          const result = db.result
            .transaction("products")
            .objectStore("products")
            .get("legacy-xl");
          result.onsuccess = () => {
            resolve(result.result);
            db.result.close();
          };
        };
      }),
  );
  assert.deepEqual(original, previous);
  await legacyContext.close();
  console.log(
    "PASS migrasi database lama mempertahankan produk dan tidak mengarang stok",
  );
  await page.goto(origin + "/management");
  await mode("promotor");
  for (const [brand, stock] of [
    ["XL", 3],
    ["Smartfren", 1],
    ["AXIS", 3],
  ]) {
    await btn("Atur kartu " + brand).click();
    for (const [label, val] of [
      ["Harga jual (Rp)", 42000],
      ["Stok fisik (kartu)", stock],
      ["Kuota utama (GB)", 5],
      ["Masa aktif (hari)", 30],
      ["Tanggal pemeriksaan promotor", "2026-01-01"],
    ])
      await dlg().getByLabel(label, { exact: true }).fill(String(val));
    await btn("Simpan pengaturan").click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
  }
  await btn("Atur promo").click();
  await dlg()
    .getByLabel(/Bonus AXIS untuk/)
    .check();
  await dlg()
    .getByLabel(/Sesi AXIS gratis/)
    .check();
  await dlg().getByLabel("Jatah kartu gratis per sesi").fill("1");
  await btn("Simpan pengaturan").click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByText("Cadangan pengaturan kartu", { exact: true }).click();
  const d = page.waitForEvent("download");
  await btn("Ekspor JSON").click();
  const backup = JSON.parse(await readFile(await (await d).path(), "utf8"));
  assert.equal(backup.offers.length, 3);
  async function upload(contents) {
    await page.getByLabel("Impor JSON").setInputFiles({
      name: "uji.json",
      mimeType: "application/json",
      buffer: Buffer.from(contents),
    });
  }
  await upload("{");
  await page.getByText(/Berkas ditolak/).waitFor();
  await upload(
    JSON.stringify({
      ...backup,
      offers: [backup.offers[0], backup.offers[0], backup.offers[2]],
    }),
  );
  await page.getByText(/Berkas ditolak/).waitFor();
  await upload(JSON.stringify(backup));
  await waitText("Pratinjau penggantian");
  await btn("Ganti pengaturan tiga kartu").click();
  await waitText("Pengaturan tiga kartu dipulihkan.");
  console.log(
    "PASS pengaturan tiga merek, validasi cadangan, ekspor dan konfirmasi impor",
  );
  await mode("pelanggan");
  await page.goto(origin);
  await page
    .getByRole("status")
    .filter({ hasText: "Siap digunakan offline" })
    .waitFor();
  assert.equal(await card("AXIS").locator("img").count(), 0);
  await card("XL").waitFor();
  await page.screenshot({
    path: "docs/qa/perdana-pelanggan.png",
    fullPage: true,
  });
  await sale("XL");
  await dlg().getByLabel("Kode promo").fill("salah");
  await btn("Terapkan").click();
  await dlg().getByRole("alert").waitFor();
  await dlg().getByLabel("Kode promo").fill(" xlsmart ");
  await btn("Terapkan").click();
  await waitText("1 kartu bonus AXIS");
  await dlg().screenshot({ path: "docs/qa/promo-tablet.png" });
  await btn("Lanjut bayar").evaluate((b) => {
    b.click();
    b.click();
  });
  await dlg().getByRole("img", { name: "Kode QRIS promotor" }).waitFor();
  assert.equal(await btn("Konfirmasi pembayaran diterima").count(), 0);
  const ref = page.url();
  assert.match(ref, /#invoice=/);
  await ctx.setOffline(true);
  await page.reload();
  await dlg().getByRole("img", { name: "Kode QRIS promotor" }).waitFor();
  assert.equal(page.url(), ref);
  assert.equal(
    await dlg().getByText("1 kartu bonus AXIS", { exact: true }).count(),
    1,
  );
  await btn("Pilih mode tampilan", dlg()).click();
  await btn("Gunakan mode promotor").click();
  await btn("Konfirmasi pembayaran diterima").click();
  await waitText("Lunas");
  await btn("Konfirmasi kartu diserahkan").evaluate((b) => {
    b.click();
    b.click();
  });
  await waitText("Sudah diambil");
  await close();
  console.log(
    "PASS pembayaran pelanggan, satu bonus dan invoice QRIS, refresh offline, konfirmasi dan serah terima",
  );
  await sale("Smartfren");
  await btn("Pakai kode XLSMART").click();
  await btn("Tunai").click();
  await btn("Lanjut bayar").click();
  await dlg().getByLabel("Uang diterima (Rp)").fill("50000");
  await btn("Konfirmasi pembayaran diterima").click();
  await dlg()
    .getByText(/Kembalian.*8\.000/)
    .waitFor();
  await btn("Konfirmasi kartu diserahkan").click();
  await waitText("Sudah diambil");
  await close();
  await sale("AXIS");
  assert.equal(await btn("Terapkan").count(), 0);
  await close();
  const peer = await ctx.newPage();
  await peer.goto(origin);
  await sale("AXIS", peer);
  await btn("Punya kode kartu gratis?").click();
  await dlg().getByLabel("Kode promo").fill("XLSMART");
  await btn("Terapkan").click();
  assert.equal(await btn("QRIS", dlg()).count(), 0);
  await btn("Konfirmasi pengambilan").click();
  await waitText("Menunggu pengambilan");
  await peer.getByText("Stok belum tersedia.", { exact: true }).waitFor();
  assert.equal(await btn("Lanjut bayar", peer).isDisabled(), true);
  await btn("Batalkan invoice").click();
  await btn("Ya, batalkan").click();
  await waitText("Dibatalkan");
  await close();
  await peer.waitForFunction(() =>
    Array.from(document.querySelectorAll("button")).some(
      (b) => b.textContent === "Lanjut bayar" && !b.disabled,
    ),
  );
  await peer.close();
  await btn("Punya kode kartu gratis?").click();
  await dlg().getByLabel("Kode promo").fill("XLSMART");
  await btn("Terapkan").click();
  await btn("Konfirmasi pengambilan").click();
  await btn("Konfirmasi kartu diserahkan").click();
  await waitText("Sudah diambil");
  await close();
  assert.equal(await btn("Punya kode kartu gratis?").count(), 0);
  await page.goto(origin + "/management");
  await page
    .getByText(/0 siap dijual · 0 fisik/)
    .first()
    .waitFor();
  assert.equal(await page.getByText(/0 siap dijual · 0 fisik/).count(), 2);
  await page.getByText(/2 siap dijual · 2 fisik/).waitFor();
  await page.getByText(/Jatah sesi tersisa 0/).waitFor();
  console.log(
    "PASS tunai dan kembalian, promo sekali per invoice, klaim Rp0, reservasi lintas tab dan pelepasan stok",
  );
  await page.goto(origin + "/finder");
  await showRecommendations(page, { status: "verified" });
  const results = page.locator("main article:visible");
  await results.first().waitFor();
  assert.equal(await results.count(), 1);
  await results
    .first()
    .getByRole("heading", { name: "Kartu perdana XL" })
    .waitFor();
  await results
    .first()
    .getByRole("button", { name: /^Bandingkan / })
    .click();
  await page.goto(origin + "/compare");
  await page.getByText("Kartu perdana XL", { exact: true }).first().waitFor();
  console.log(
    "PASS finder dan perbandingan mengikuti stok dan penawaran lokal",
  );
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
