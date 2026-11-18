# XLSMART Personal Sales Kit V1.0

Fondasi katalog penjualan untuk tablet. Tahap ini hanya menyiapkan struktur;
halaman starter tetap tersedia dan belum ada fitur bisnis yang diimplementasikan.

## Struktur dan batas tanggung jawab

```text
src/
  app/                 Routing, layout, metadata, dan komposisi halaman
  components/
    ui/                Primitif UI bersama; lokasi shadcn/ui saat diadopsi
    layout/            Shell tablet, navigasi, dan tata letak bersama
  features/
    catalog/           Domain katalog: komponen, model, dan akses data katalog
  hooks/               Hook React yang digunakan lintas fitur
  lib/                 Utilitas dan integrasi infrastruktur lintas fitur
    offline/           Batas adapter penyimpanan dan sinkronisasi mendatang
  types/               Tipe yang benar-benar digunakan lintas fitur
  config/              Konfigurasi aplikasi nonrahasia
public/                Aset statis yang boleh diakses publik
docs/                  Keputusan arsitektur dan hasil verifikasi
```

Gunakan alias `@/*` untuk impor dari `src`. Simpan kode khusus katalog di
`features/catalog`; tambahkan subfolder components, hooks, types, dan services
ketika ada implementasi nyata. Hindari memindahkan model domain ke `types`
sebelum ada kebutuhan lintas fitur.

`app` mengomposisikan fitur dan komponen bersama. Fitur boleh memakai
`components`, `lib`, `types`, dan `config`; lapisan bersama tidak mengimpor
fitur maupun `app`. Hindari ketergantungan langsung antarf fitur dan barrel
export global yang mencampur modul server dan client.

## Rendering dan tablet

Pertahankan Server Components sebagai default. Tambahkan `use client` hanya
pada batas interaksi yang memerlukan state, event, atau API browser. Akses
localStorage, IndexedDB, dan service worker hanya dari lingkungan browser.
Pisahkan modul akses rahasia/server dari modul yang diimpor Client Components.

Saat UI dibuat, verifikasi portrait dan landscape, setidaknya pada viewport
768x1024 dan 1024x768, tanpa scroll horizontal. Gunakan layout responsif,
target sentuh minimal 44x44 CSS px, fokus keyboard yang jelas, serta label
aksesibel. Jangan mengunci orientasi atau membuat navigasi bergantung hover.

## Tahap lanjutan

- shadcn/ui: tambahkan setelah verifikasi fondasi, tempatkan primitif di
  `components/ui`; sesuaikan token CSS melalui `globals.css`.
- Lucide React: gunakan pada komponen yang membutuhkan ikon setelah instalasi
  disepakati; ikon dekoratif tidak menggantikan label tombol.
- PWA: rancang manifest, ikon, service worker, versi cache, pembaruan aplikasi,
  dan fallback offline. Rendering cache Next.js tidak menyediakan offline PWA.
- Katalog offline: tentukan sumber data, skema/versioning, kebijakan kedaluwarsa,
  dan sinkronisasi sebelum memilih penyimpanan. `lib/offline` hanya slot adapter,
  belum berisi cache atau registrasi service worker.

## Pemeriksaan lokal

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Di PowerShell pada mesin ini gunakan `npm.cmd` karena eksekusi `npm.ps1`
dibatasi. Build mencakup pemeriksaan TypeScript dan menghasilkan tipe route.
Lint dijalankan terpisah karena build Next.js tidak menggantikannya.

Konfigurasi Turbopack/Tailwind, Cache Components, Partial Prefetching,
TypeScript strict, dan ESLint bawaan dipertahankan setelah build berhasil.
Jangan menambahkan konfigurasi PostCSS/Tailwind lain tanpa mengevaluasi loader
yang sudah ada.
