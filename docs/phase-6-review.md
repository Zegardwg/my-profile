# Penjualan tiga kartu perdana

Beranda menjual XL, Smartfren dan AXIS. Foto tampil setelah kartu dipilih. Pengaturan jual menggantikan editor katalog umum di /management. Panduan pengoperasian, batas cadangan dan langkah rilis tersedia di README.md.

## Berkas implementasi penjualan

| Bagian | Berkas utama |
| --- | --- |
| Beranda dan detail | src/app/page.tsx, src/features/catalog/components/featured-packages.tsx, src/features/home/components/promo-checkout.tsx, src/components/catalog/product-details.tsx |
| Promotor | src/app/management/page.tsx, src/components/management/sales-settings.tsx, src/components/management/sales-backup.tsx, src/components/mode/mode-provider.tsx |
| Stok, promo dan invoice | src/lib/counter-model.ts, src/lib/counter-repository.ts, src/lib/db.ts, src/hooks/use-counter.ts |
| Finder dan perbandingan | src/lib/product-repository.ts |
| Pengujian | tests/counter.test.mjs, tests/browser/promo-checkout.mjs, tests/browser/phase6-management.mjs, tests/browser/phase5-pwa.mjs |
| Pratinjau dengan data uji | docs/qa/perdana-pelanggan.png, docs/qa/promo-tablet.png |
| Operasional dan PWA | README.md, public/sw.js yang dihasilkan saat build |

Implementasi memakai dependensi Dexie, dexie-react-hooks dan Zod yang sudah terpasang.

## Hasil verifikasi

Lint, pemeriksaan TypeScript, 61 tes unit, dan build produksi lulus. Uji Edge meliputi migrasi produk yang sudah diperiksa, penawaran kosong, pengaturan tiga merek, ekspor dan impor JSON, penolakan berkas rusak dan merek ganda, konfirmasi penggantian, serta pembelian dari mode pelanggan. Dua kali menekan checkout atau serah terima menghasilkan satu transaksi dan satu pengurangan stok. Pengujian memeriksa jumlah stok akhir.

Pengujian browser juga mencakup pemuatan ulang invoice tanpa jaringan, stok bersama di dua tab, pelepasan reservasi, pembayaran tunai dan kembalian, QRIS, klaim Rp0, serta sinkronisasi Finder dan perbandingan. Uji PWA mencakup delapan halaman yang tersimpan offline, fallback, dan penerapan pembaruan dengan data lokal tetap tersimpan. Uji Trust Center, navigasi, aksesibilitas tombol dan tata letak tablet lulus. Pengujian tidak melakukan transfer uang atau memverifikasi kepemilikan akun merchant.

---

# Catatan implementasi sebelumnya — Katalog produk lokal

## Alur data

Komponen klien membaca katalog melalui `CatalogProvider` dan kueri reaktif Dexie. Transaksi pembuatan database mengisi 18 contoh saat pertama kali dibuka. Migrasi dari skema 1 ke 2 menambahkan nilai awal pada kolom baru dan mempertahankan catatan lama. Simpan dan arsip memeriksa revisi di dalam transaksi tulis. Dua editor yang membuka produk yang sama akan mendapat pemberitahuan jika salah satunya mencoba menyimpan revisi lama.

Arsip menyembunyikan paket di layar penjualan. Memulihkan paket mempertahankan identitas produk dan status ketersediaannya. Salinan mendapat ID baru dan dimulai sebagai demo. Pencari paket memperhitungkan biaya paket untuk 30 hari, stok, kebutuhan, masa aktif, merek, dan status informasi pilihan pelanggan.

## Cadangan dan batas penggunaan

Ekspor memakai format `xlsmart-catalog` versi 1 dengan waktu ekspor UTC. Impor memeriksa skema seluruh berkas sebelum menampilkan daftar produk dan konflik. Konfirmasi menulis perubahan dalam satu transaksi. Jika katalog berubah setelah pratinjau, buka kembali berkas untuk meninjau perubahan terbaru.

Batas katalog adalah 2.000 produk termasuk arsip. Browser membaca berkas JSON ke memori saat impor. Kapasitas penyimpanan dan memori tablet memengaruhi ukuran yang dapat diproses. Penolakan akses IndexedDB menampilkan pemberitahuan dan katalog contoh baca-saja. Foto menggunakan ilustrasi bawaan.

## Inventaris berkas

Berkas Phase 6 dibandingkan dengan revisi Git dasar, termasuk pekerjaan yang sudah ada saat pemeriksaan dimulai. Daftar gambar mencakup hasil pengujian ulang fase sebelumnya.

### Berkas baru

- `docs/` — `phase-6-review.md`
- `docs/qa/` — `phase6-editor-portrait.png`, `phase6-management-landscape.png`
- `src/app/management/` — `loading.tsx`, `page.tsx`
- `src/components/catalog/` — `product-metadata.tsx`
- `src/components/management/` — `product-editor.tsx`, `product-management.tsx`
- `src/components/mode/` — `mode-provider.tsx`
- `src/components/products/` — `catalog-provider.tsx`
- `src/config/` — `product-placeholders.ts`
- `src/lib/` — `catalog-errors.ts`, `db.ts`, `product-information.ts`, `product-repository.ts`, `product-schema.ts`
- `tests/browser/` — `phase6-management.mjs`
- `tests/` — `product-management.test.mjs`

### Berkas diperbarui

- `./` — `README.md`, `package-lock.json`, `package.json`
- `docs/qa/` — `cards-refresh-desktop.png`, `cards-refresh-mobile.png`, `phase3-catalog-tablet.png`, `phase3-compare-tablet.png`, `phase3-finder-mobile.png`, `phase4-presentation-mobile.png`, `phase4-presentation-tablet.png`, `phase4-promoter-tablet.png`, `phase4-trust-tablet.png`, `phase5-compare-offline-landscape.png`, `phase5-finder-offline-portrait.png`
- `public/` — `offline.html`
- `scripts/` — `pwa-settings.mjs`
- `src/app/catalog/` — `page.tsx`
- `src/app/compare/` — `page.tsx`
- `src/app/finder/` — `page.tsx`
- `src/app/` — `layout.tsx`, `page.tsx`
- `src/components/catalog/` — `catalog-browser.tsx`, `catalog-filters.tsx`, `catalog-freshness.tsx`, `catalog-product-card.tsx`, `product-details.tsx`, `product-visual.tsx`
- `src/components/compare/` — `comparison-provider.tsx`, `comparison-table.tsx`
- `src/components/finder/` — `finder-wizard.tsx`
- `src/components/layout/` — `app-footer.tsx`, `app-header.tsx`, `mobile-navigation.tsx`
- `src/components/pwa/` — `pwa-status.tsx`
- `src/components/shared/` — `demo-notice.tsx`, `image-placeholder.tsx`
- `src/components/trust/` — `trust-illustration.tsx`
- `src/config/` — `customer-trust.ts`, `pwa.ts`
- `src/data/` — `demo-products.ts`
- `src/features/catalog/components/` — `brand-selector.tsx`, `featured-packages.tsx`, `smart-package-finder.tsx`
- `src/features/home/components/` — `hero-section.tsx`
- `src/lib/` — `product-filters.ts`, `recommendation-engine.ts`
- `src/types/` — `product.ts`
- `tests/browser/` — `phase3-smoke.mjs`, `phase5-pwa.mjs`

## Hasil verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run lint` dan `npx tsc --noEmit` | Keduanya selesai dengan kode keluar 0 |
| `npm test` | 55 lulus, 0 gagal, 0 dilewati |
| `npm run build` | 9 halaman aplikasi dan 34 aset dalam daftar cache PWA |
| `test:browser`, `test:browser:cards`, `test:browser:trust` | Lulus untuk katalog, pencari, perbandingan, kartu, profil, pusat kepercayaan, panduan dan percakapan |
| `test:browser:pwa` | Lulus untuk pemasangan, navigasi luring pertama, dan pembaruan worker dengan data lokal tetap tersimpan |
| `test:browser:management` | Lulus untuk tambah, edit, duplikasi, arsip, pemulihan, filter, validasi, ekspor dan impor, konflik antartab, migrasi, penolakan penyimpanan, serta edit dan muat ulang luring |

Pengujian browser menggunakan Edge di Windows dengan ukuran layar ponsel dan tablet. Pengujian langsung pada perangkat iPadOS dan Android masih menjadi langkah persiapan rilis. Panduan menjalankan build dan memeriksa tablet target tersedia pada bagian Phase 6 di [README](../README.md).

