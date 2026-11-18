# Phase 3 — Product Catalog & Smart Package Finder

## Hasil
Fondasi Phase 2 dipertahankan: warna, font next/font, header/footer,
primitive shadcn/Base UI, Tailwind/Turbopack, Cache Components, Partial
Prefetching, dan TypeScript strict. Tidak ada dependensi aplikasi tambahan.

- /catalog: 18 paket fiktif (6 XL, 6 Smartfren, 6 AXIS), placeholder visual,
  harga Rupiah, kuota, masa aktif, manfaat, ketersediaan, dialog detail,
  batasan, dan tombol bandingkan.
- Filter gabungan: merek, minimum/maksimum harga, kuota minimum, masa aktif
  minimum, status tersedia/tidak tersedia, dan kata kunci tanpa membedakan
  huruf besar/kecil. Empat urutan, reset, serta empty state tersedia.
- Sidebar filter pada desktop; Sheet/drawer responsif pada tablet/mobile.
- /finder: 5 langkah, state lokal, preferensi yang bisa diubah dan reset,
  hasil maksimal 3, alasan/skor transparan dan penanganan tanpa hasil.
- /compare: hingga 3 paket, atribut lengkap, hapus satu, bersihkan semua,
  kembali ke katalog, dan tabel dalam region scroll horizontal tersendiri.
- Homepage memakai sumber data dan kartu yang sama; CTA dan navigasi memakai
  Next Link agar state perbandingan bertahan saat berpindah route.
- Setiap kartu dan detail diberi label persis:
  DATA DEMO - BUKAN PENAWARAN RESMI.
- Disclaimer personal terlihat pada setiap halaman alat. Tidak ada formulir
  identitas, OTP, biometrik, pembayaran, login, atau aktivasi.

## Aturan rekomendasi
Penyaringan wajib terjadi SEBELUM pemeringkatan:
1. Paket tersedia.
2. Harga paket <= anggaran.
3. Estimasi kebutuhan 30 hari <= anggaran.
4. Minimum masa aktif wajib dan merek wajib dipenuhi jika dipilih.

Estimasi konservatif = ceil(30 / masa aktif) × harga paket. Contoh paket 7
hari Rp20.000 memerlukan estimasi 5 paket, Rp100.000 per 30 hari. Ini model
simulasi, bukan klaim pembaruan/rollover atau harga operator.

Preferensi masa aktif dan merek bersifat lunak sampai checkbox syarat wajib
dipilih. Aktivitas adalah faktor peringkat, bukan janji kemampuan jaringan.

Skor: kategori sesuai +40, preferensi masa aktif tepat/tanpa preferensi +20,
nilai kuota/harga min(20, round(GB / Rupiah × 30000)), merek preferensi +10.
Tidak ada bonus merek jika tidak memilih preferensi. Urutan seri: harga
lebih rendah, lalu ID produk, sehingga stabil terhadap urutan input.
Alasan menerangkan kategori/merek/masa aktif alternatif secara eksplisit.
Batas anggaran dan ketersediaan tidak pernah dilonggarkan otomatis.

## State dan batas arsitektur
- Data terstruktur dan bertipe ada di src/data/demo-products.ts.
- Filter, rekomendasi, dan aturan perbandingan merupakan fungsi murni.
- Page App Router adalah Server Components; kontrol interaktif memakai client.
- ComparisonProvider pada root layout menyimpan hanya ID produk dalam memori.
  Navigasi Next Link mempertahankannya; reload/tab baru mengosongkannya.
- Tidak menggunakan localStorage, database, API eksternal, atau backend.
- Tidak ada service worker/PWA. Data lokal dan fungsi murni siap dipakai adapter
  offline di fase berikutnya tanpa mengubah aturan rekomendasi.
- Modul katalog Phase 2 menjadi adapter ke sumber data/komponen yang sama,
  sehingga tidak ada dua daftar paket aktif yang berbeda.

## File dibuat

| Kelompok | File |
| --- | --- |
| Routes | src/app/catalog/page.tsx, loading.tsx; src/app/finder/page.tsx, loading.tsx; src/app/compare/page.tsx, loading.tsx |
| Data dan tipe | src/data/demo-products.ts; src/types/product.ts |
| Logika/presentasi | src/lib/product-filters.ts; recommendation-engine.ts; comparison.ts; product-presentation.ts |
| Katalog | src/components/catalog/catalog-browser.tsx; catalog-filters.tsx; catalog-product-card.tsx; product-details.tsx; product-visual.tsx |
| Finder | src/components/finder/finder-wizard.tsx |
| Perbandingan | src/components/compare/comparison-provider.tsx; comparison-summary.tsx; comparison-table.tsx |
| Bersama | src/components/shared/demo-notice.tsx; empty-state.tsx; tool-page.tsx; tool-loading.tsx |
| Tes | tests/products.test.mjs; tests/browser/phase3-smoke.mjs |
| Dokumentasi | docs/phase-3-review.md; docs/qa/phase3-catalog-tablet.png; phase3-compare-tablet.png; phase3-finder-mobile.png |

## File dimodifikasi
- src/app/layout.tsx: membungkus children dengan provider perbandingan.
- src/config/navigation.ts: route katalog, finder, compare, dan anchor panduan.
- src/components/layout/app-header.tsx dan mobile-navigation.tsx:
  Next Link untuk navigasi dan target sentuh logo minimal 44px.
- src/features/home/components/hero-section.tsx: CTA ke katalog.
- src/features/catalog/components/featured-packages.tsx: kartu dan data bersama.
- src/features/catalog/components/smart-package-finder.tsx: CTA ke wizard.
- src/features/catalog/components/product-card.tsx: adapter kartu bersama.
- src/features/catalog/components/brand-selector.tsx: format kode diselaraskan.
- src/features/catalog/data/demo-packages.ts dan types/package.ts:
  compatibility exports menuju modul Phase 3.
- package.json: menambah script test dan test:browser saja.
- README.md: tautan dokumentasi fase ini.
- next.config.ts, tsconfig.json, ESLint, globals.css, font, dan lockfile tidak
  diubah. Cache .next/cache dan .next/build sempat dibersihkan untuk menghapus
  galat BOM yang sudah diperbaiki; tidak menghapus source aplikasi.

## Pengujian
- npm.cmd test: 25 tes lulus, 0 gagal.
- npm.cmd run lint: lulus tanpa error/warning ESLint.
- npx.cmd --no-install tsc --noEmit: lulus.
- npm.cmd run build: lulus; /, /catalog, /finder, /compare, dan /icon.svg
  berhasil diprerender.
- Browser smoke memakai Playwright sementara dan Microsoft Edge headless.
  Paket Playwright serta formatter hanya berada di cache npm sementara;
  package.json/lockfile tidak mendapat dependency tambahan.

Unit tests mencakup setiap filter, batas harga inklusif, semua sorting tanpa
mutasi, pencarian, filter gabungan, ranking aktivitas/masa aktif/nilai/merek,
ketersediaan, syarat wajib, anggaran 30 hari, no-match, budget tidak valid,
determinisme dan netralitas skor merek, serta maksimum tiga pilihan/duplikasi.

Browser smoke mencakup:
- Semua route HTTP 200 dan satu h1 pada 375x812, 768x1024, 1024x768, 1280x800.
- Tidak ada overflow horizontal halaman pada keempat ukuran.
- Homepage menuju katalog; setiap kartu memiliki demo label dan placeholder.
- Pencarian, brand tabs, filter drawer harga+ketersediaan, kuota/no-match,
  reset, dan sorting kuota.
- Dialog detail dibuka dan ditutup dengan Escape.
- Pilihan keempat dinonaktifkan; state terbawa antarrute; hapus dan clear.
- Tabel berisi tujuh atribut dan horizontal scroll khusus tabel di mobile.
- Menu mobile menuju finder; wizard dengan merek/minimum masa aktif wajib.
- Finder no-match tidak menampilkan kartu; pengguna dapat mengubah anggaran.
- Tidak ada pageerror JavaScript browser.

Screenshot telah ditinjau:
[katalog tablet](qa/phase3-catalog-tablet.png),
[perbandingan tablet](qa/phase3-compare-tablet.png),
[finder mobile](qa/phase3-finder-mobile.png).

## Menjalankan kembali
Terminal utama:

~~~powershell
npm.cmd test
npm.cmd run lint
npx.cmd --no-install tsc --noEmit
npm.cmd run build
npm.cmd run start -- --port 3100
~~~

Terminal kedua untuk QA browser pada Windows dengan Edge terpasang:

~~~powershell
$env:npm_config_cache = Join-Path $env:TEMP "codex-profilxlsmart-npm-cache"
npx.cmd --yes --package=@playwright/test playwright --version
$qaPackage = Get-ChildItem (Join-Path $env:npm_config_cache "_npx") -Directory |
  Where-Object { Test-Path (Join-Path $_.FullName "node_modules/playwright/index.mjs") } |
  Select-Object -First 1 -ExpandProperty FullName
$env:XLSMART_PLAYWRIGHT_MODULE = Join-Path $qaPackage "node_modules/playwright"
npm.cmd run test:browser
~~~

XLSMART_QA_URL opsional untuk mengganti http://localhost:3100.
Browser script menulis ulang screenshot di docs/qa.

## Batasan yang diketahui
- Uji browser memakai emulasi viewport di Edge desktop, belum perangkat iPad/
  Android fisik, Safari/WebKit, pembaca layar, atau audit aksesibilitas lengkap.
- State perbandingan hilang saat reload, sesuai informasi yang terlihat di UI.
- Rekomendasi hanya menggambarkan 18 paket fiktif; tidak mengevaluasi cakupan,
  kecepatan, kompatibilitas perangkat, ataupun promo operator nyata.
- Node 24 dapat mengeluarkan MODULE_TYPELESS_PACKAGE_JSON ketika runner tes
  memuat TypeScript native. Tes tetap lulus; mode module proyek dipertahankan
  untuk menghindari perubahan konfigurasi runtime yang tidak diperlukan.
- Temuan audit dependency tree Phase 2 belum ditangani pada lingkup fase ini.
- Belum ada backend atau PWA. Font next/font Google masih memerlukan akses
  jaringan pada build bersih.

## Fase berikutnya
Phase 4 yang disarankan: PWA offline dengan manifest/ikon, katalog berversi,
strategi pembaruan cache dan fallback, serta uji pada tablet fisik. Sebelum
mengganti fixture dengan penawaran nyata, tentukan alur peninjauan konten,
sumber resmi, tanggal berlaku, dan kebijakan pembaruan. Tinjau temuan dependency
tooling secara terpisah tanpa upgrade mayor otomatis.
