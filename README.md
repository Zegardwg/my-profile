This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## XLSMART Personal Sales Kit — Phase 2

Dokumentasi UI dan struktur: [Design System](docs/design-system.md).
Hasil verifikasi dan batas pengujian: [Phase 2 Review](docs/phase-2-review.md).

Jalankan lokal dengan `npm.cmd run dev`. Seluruh data paket adalah demo.


## Phase 3 — Catalog, Finder & Compare

Route `/catalog`, `/finder`, dan `/compare` tersedia. Terdapat 18 paket fiktif,
filter interaktif, rekomendasi berbasis aturan, dan perbandingan maksimal 3 paket.
Seluruh informasi ditandai DATA DEMO - BUKAN PENAWARAN RESMI.

Laporan implementasi, inventaris file, tes, screenshot, dan cara menjalankan QA:
[Phase 3 Review](docs/phase-3-review.md).

Tes logika: `npm.cmd test`. Preview: `npm.cmd run dev`.


## Phase 4 — Customer Trust Experience

Route `/promoter`, `/trust`, `/activation-guide`, dan `/sales-assistant`
menambahkan profil demo, FAQ, edukasi registrasi bersumber resmi, percakapan
layanan, dan mode presentasi pelanggan. Semua fitur Phase 3 dipertahankan.

[Laporan Phase 4: inventaris, sumber resmi, QA, dan batasan](docs/phase-4-review.md).
Konfigurasi konten publik: `src/config/customer-trust.ts`.
Tes browser tambahan: `npm.cmd run test:browser:trust` (setup pada laporan).
## Phase 5 — Offline PWA & Tablet

PWA menggunakan manifest native Next.js dan service worker tanpa paket PWA tambahan.
Jalankan `npm.cmd run build` lalu `npm.cmd run start`; worker hanya didaftarkan
pada build produksi. `next dev` tetap untuk HMR dan tidak menyediakan mode offline.

Buka aplikasi online hingga status **Siap digunakan offline**, lalu gunakan
**Pasang aplikasi** atau menu Chrome Android **Tambahkan ke layar utama**.
Produksi wajib memakai HTTPS. Paket contoh ditandai sebagai demo. Registrasi resmi
memerlukan internet. Pembaruan tersedia melalui tombol **Perbarui sekarang**;
tombol memuat ulang halaman, sehingga selesaikan presentasi terlebih dahulu.

Periksa `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, dan
`npm.cmd run test:browser:pwa` (memerlukan `XLSMART_PLAYWRIGHT_MODULE`, Edge,
dan server produksi pada port 3100). Jalankan tes PWA sendirian karena tes
menulis sementara worker untuk memverifikasi pembaruan, lalu memulihkannya.

[Implementasi, hasil QA dan batas pengujian Phase 5](docs/phase-5-review.md).


## Penjualan kartu perdana

Beranda menjual tiga kartu fisik: XL, Smartfren dan AXIS. Sentuh kartu untuk melihat kemasan, harga, kuota, masa aktif dan cara bayar. Foto kemasan lokal berada di public/images/products/. Finder dan perbandingan menampilkan data lokal dan membedakan paket demo dari rincian yang telah diperiksa promotor. Alamat /catalog lama dialihkan ke /finder.

### Persiapan tablet

1. Pilih **Mode promotor → Pengaturan jual**. Pada setiap merek, isi harga, jumlah kartu fisik, kuota, masa aktif dan manfaat sesuai barang yang tersedia. Isi tanggal pemeriksaan setelah memeriksa penawaran. Harga kosong atau nol, stok kosong, atau rincian yang belum diperiksa menutup checkout berbayar.
2. Pada **Atur promo**, aktifkan bonus untuk pembelian XL/Smartfren atau sesi pembagian AXIS tanpa pembelian. Sesi gratis memerlukan jatah dan stok AXIS. Mengaktifkan kembali sesi setelah menonaktifkannya memulai jatah baru.
3. Kembali ke **Mode pelanggan**. Pilih kartu lalu terapkan kode **XLSMART** untuk memasukkan satu bonus AXIS seharga Rp0 ke invoice yang sama. Pembelian AXIS reguler hanya berisi kartu yang dibeli. Gunakan **Punya kode kartu gratis?** untuk klaim mandiri selama sesi aktif.
4. Pilih **Lanjut bayar** untuk membuat invoice lokal dan melihat instruksi QRIS atau tunai. Klaim gratis memakai **Konfirmasi pengambilan** dan melewati pembayaran. Invoice yang terbuka bisa dimuat ulang atau dibuka kembali melalui **Pengaturan jual**.
5. Promotor memeriksa penerimaan uang, menandai invoice lunas, lalu mengonfirmasi penyerahan kartu. Pembuatan invoice mencadangkan stok. Serah terima mengurangi stok fisik untuk setiap baris termasuk bonus. Batalkan invoice tertunda apabila transaksi batal dan uang belum diterima. Invoice yang belum selesai terus mencadangkan stok sampai ditangani.

QRIS statis memakai gambar lokal public/images/qris-merchant.png. Poster bertuliskan **DEWABLOX.ID ROBLOX** dan nama penerima yang terbaca dari kode adalah **Jawastore.biz.id, Pengiri**. Cocokkan dengan aplikasi pembayaran dan nominal invoice sebelum transfer. Pembayaran berlangsung di aplikasi pembayar. Sales kit tidak menerima notifikasi pelunasan otomatis.

IndexedDB menyimpan data per profil browser dan origin. Pergantian mode hanya mengubah antarmuka. Seluruh invoice lokal dapat dibuka oleh pengguna perangkat yang sama. Tidak ada pengumpulan identitas pelanggan, pembatasan klaim per orang, autentikasi promotor, atau sinkronisasi antarperangkat. Pengelolaan cloud memerlukan backend. Pembaruan skema mempertahankan data produk lama. Harga satu perdana yang telah diperiksa per merek dapat diwariskan. Stok fisik awal harus dihitung oleh promotor.

**Cadangan pengaturan kartu** mengekspor harga, informasi dan stok tiga merek ke JSON versi 1. Impor menampilkan pratinjau, meminta konfirmasi, memeriksa identitas merek dan menolak penggantian stok saat invoice masih terbuka. Cadangan ini tidak memuat invoice atau sesi promo. Membersihkan data situs dapat menghapus seluruh catatan perangkat. Simpan cadangan di tempat aman.

### Menyiapkan rilis

Jalankan npm ci, npm run lint, npm run typecheck, npm test dan npm run build. Jalankan server produksi dan uji dengan npm run test:browser:promo serta npm run test:browser:pwa secara terpisah. Pengujian browser memakai Edge, XLSMART_PLAYWRIGHT_MODULE dan XLSMART_QA_URL. Pertahankan origin HTTPS saat merilis. Buka aplikasi pada tablet hingga status **Siap digunakan offline**, lalu periksa alur kasir dan stok sebelum melayani pelanggan.
