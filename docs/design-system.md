# Phase 2 — Design System & UI Foundation

## Identitas visual
Sales kit personal berbahasa Indonesia, dengan identitas aplikasi tersendiri.
Referensi arah komunikasi: https://www.xl.co.id/. Tidak menggunakan logo resmi,
foto karyawan, klaim jaringan, paket komersial, atau aset kampanye operator.

| Token | Nilai | Peran |
| --- | --- | --- |
| Primary | #093BCB | CTA, fokus, link |
| Deep Navy | #07235C | Teks utama, hero |
| Smartfren | #E51878 | Aksen batas kartu; teks memakai #B80B5A untuk keterbacaan |
| Mint | #06C7A3 | Aksen ilustrasi; tidak digunakan untuk teks kecil di putih |
| Canvas | #F5F8FF | Latar halaman |
| AXIS | #7134A7 | Aksen pendamping merek |
| Muted text | #52617A | Deskripsi di latar terang |

Token berada di src/app/globals.css dan dipetakan ke semantic tokens shadcn.
Tema Phase 2 adalah light; tidak ada toggle dark mode.

- Heading: Plus Jakarta Sans, body: Inter; keduanya melalui next/font/google.
- Spacing: skala Tailwind 4px, padding halaman 20/32/48px, maksimum 1280px.
- Radius: kontrol 12px, kartu 16px, hero 32px; bayangan kartu ringan.
- Target sentuh utama 48px, tab merek 56px, tombol tutup modal 44px.
- Fokus terlihat, skip link, judul berjenjang, label form, dukungan reduced motion.
- Grid paket: 1 kolom mobile, 2 mulai 768px, 3 mulai 1024px.
- Hero: bertumpuk di portrait; 2 kolom mulai 1024px. Tanpa penguncian orientasi.

## Komponen dan arsitektur

| Komponen | Lokasi |
| --- | --- |
| AppHeader, MobileNavigation, AppFooter | src/components/layout/ |
| ImagePlaceholder, SectionHeading, TrustInformationCard, BrandMark | src/components/shared/ |
| HeroSection, RegistrationEducation | src/features/home/components/ |
| BrandSelector, ProductCard, FeaturedPackages, SmartPackageFinder | src/features/catalog/components/ |
| DemoPackage, Brand, Usage | src/features/catalog/types/package.ts |
| Paket fiktif dan gaya merek | src/features/catalog/data/demo-packages.ts |
| Navigasi anchor | src/config/navigation.ts |

app/page.tsx tetap sebagai Server Component yang menyusun homepage.
State interaksi dibatasi pada navigasi mobile, katalog bertab, pencari,
serta detail paket. Tidak ada state global, API route, atau penyimpanan data.

shadcn memakai style base-maia dan primitive Base UI yang sudah terpasang.
Button, Card, Tabs, Dialog, dan Sheet digunakan pada homepage. Trigger memakai
API render Base UI; tidak memakai pola asChild Radix. Utilitas cn yang sudah
terpasang dipertahankan. components.json diselaraskan ke Lucide; tombol tutup
Dialog/Sheet memakai Lucide dan label Indonesia. Paket Hugeicons yang sudah
ada tetap dipertahankan karena komponen shadcn lain masih menggunakannya.

## Perilaku demo
- Filter tab menampilkan paket berdasarkan merek, termasuk pilihan semua merek.
- Detail membuka dialog berisi kuota, masa aktif, manfaat, dan harga ilustrasi.
- Finder mencocokkan kategori penggunaan dan batas anggaran secara lokal.
  Hasil kosong ditangani. Tidak ada rekomendasi produk komersial.
- Menu mobile membuka Sheet dan menutup saat anchor dipilih.
- Semua navigasi internal tetap pada homepage. Link resmi membuka tab baru.
- Seluruh paket fiktif ditandai DATA DEMO; tidak ada registrasi atau pembayaran.
- Tidak ada input identitas, OTP, biometrik, atau data pribadi.
- Placeholder visual dibuat dengan HTML/CSS, bukan foto orang atau aset operator.

## Fondasi yang dipertahankan
Next.js/Turbopack, Cache Components, Partial Prefetching, Tailwind loader,
TypeScript strict, alias @/*, ESLint, package.json, dan lockfile dipertahankan.
Tidak memasang dependensi tambahan. PWA/backend belum diimplementasikan.

