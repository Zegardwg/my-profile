# Penyempurnaan kartu dan tipografi

Mengikuti arah visual screenshot referensi pengguna: permukaan warna penuh,
kuota sebagai fokus, harga mudah dipindai, manfaat terkelompok, dan tombol
berurutan. Konten dan harga tetap fiktif, dengan label DATA DEMO yang terlihat.

## Perubahan
- CatalogProductCard: kartu XL biru, Smartfren magenta, AXIS ungu. Kuota besar,
  judul lebih ringan, tiga baris informasi, status demo, detail dan perbandingan.
- ProductVisual: varian placeholder ringkas; varian besar tetap tersedia.
- ProductDetails: varian tombol untuk latar berwarna, tanpa mengubah isi dialog.
- globals.css: skala angka, bobot dan tracking font, ritme teks, surface kartu,
  kontras, fokus putih pada tombol, dan animasi.
- Plus Jakarta Sans untuk angka/headings dan Inter untuk teks tetap melalui
  next/font. Tidak menambah keluarga font, library animasi, atau dependency.
- use-reveal.ts: IntersectionObserver dengan progressive enhancement.
  Konten terlihat tanpa JavaScript; reduced-motion menonaktifkan efek.
- Homepage, katalog, dan finder meneruskan urutan kartu untuk stagger.
  Komponen bersama otomatis memperbarui kartu pada perbandingan juga.

## Gerakan
Reveal 520ms dengan jeda 45ms antarkartu, maksimal lima langkah jeda.
Hover mengangkat kartu 6px hanya pada perangkat pointer halus.
Tombol merespons sentuhan dan ikon pilihan muncul saat paket dibandingkan.
Tidak ada animasi berulang atau parallax. Reduced motion menonaktifkan efek
tersebut dan mempertahankan visibilitas konten.

## Pemeriksaan
- 35 tes logika/konten lulus.
- Lint, TypeScript dan build produksi lulus.
- Browser smoke kartu: font terpasang, tiga surface berbeda, reveal, hover,
  label demo, kontrol >=44px, mobile tanpa overflow, dan reduced-motion lulus.
- Regresi browser Phase 3 dan Phase 4 lulus pada empat viewport.
- Screenshot desktop dan smartphone ditinjau.
- Pemeriksaan ini memakai Edge desktop/emulasi; tablet fisik belum diuji.

[Desktop](qa/cards-refresh-desktop.png) · [Smartphone](qa/cards-refresh-mobile.png)

Script tambahan: npm.cmd run test:browser:cards. Memerlukan setup Playwright
sementara dan server port 3100 seperti laporan Phase 3; tidak menambahkan
Playwright ke dependency aplikasi.
