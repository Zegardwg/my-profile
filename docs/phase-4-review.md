# Phase 4 — Customer Trust Experience

## Hasil pemeriksaan awal
Route homepage, /catalog, /finder, /compare, provider perbandingan, dan
komponen Phase 3 tersedia. npm ls --depth=0 tidak menemukan dependensi hilang.
Seluruh 25 tes Phase 3 lulus sebelum implementasi; smoke test browser Phase 3
juga dijalankan ulang setelah implementasi dan lulus.

Tidak ada dependency aplikasi tambahan. Token warna, font Inter/Plus Jakarta
Sans, globals.css, layout root, konfigurasi Next.js/Turbopack, TypeScript,
ESLint, dan package-lock dipertahankan.

## Fitur yang selesai

| Route | Fitur |
| --- | --- |
| /promoter | Foto placeholder, Promotor Contoh, area DATA DEMO, lingkup multi-brand, panduan memeriksa identitas asli dan penugasan secara independen, komitmen privasi |
| /trust | Enam prinsip pemeriksaan pelanggan, FAQ accordion native yang bisa dipakai dengan keyboard, rujukan resmi |
| /activation-guide | Tujuh tahap ilustrasi placeholder, konteks aturan, penjelasan NIK/wajah, persetujuan, hak berhenti, kanal eksternal, pemeriksaan status di operator |
| /sales-assistant | Tujuh kategori kekhawatiran, respons empatik, penjelasan, tindakan tepat, batas janji, dan presentasi cepat tanpa mengetik |

PresentationMode reusable tersedia pada seluruh halaman baru. Dialog memenuhi
viewport, memakai teks besar, kontrol minimal 44px, navigasi tombol/panah,
penghitung langkah, Escape, dan pengembalian fokus ke pemicu. Isi panjang dapat
digulir dalam region dialog, sementara kontrol tetap terlihat. Tidak memakai
Fullscreen API, izin kamera, atau animasi zoom. Tidak ada KPI maupun catatan
internal promotor.

Homepage mendapat satu section tautan keempat halaman baru. Navigasi utama
mendapat pintu masuk Kepercayaan; menu mobile memuat seluruh route baru tanpa
duplikasi. Header memakai menu sampai lebar 1280px agar tambahan navigasi tidak
menyebabkan overflow tablet. Halaman baru memiliki subnavigasi dengan
aria-current dan loading skeleton dari komponen yang sudah ada.

## Sumber, konteks dan status informasi
Materi lokal ditinjau 18 November 2026 berdasarkan:
- [JDIH — Permen Komdigi Nomor 7 Tahun 2026](https://jdih.komdigi.go.id/produk_hukum/view/id/1001/t/peraturan%2Bmenteri%2Bkomunikasi%2Bdan%2Bdigital%2Bnomor%2B7%2Btahun%2B2026).
- [Naskah regulasi](https://jdih.komdigi.go.id/produk_hukum/unduh/id/1001/t/peraturan%2Bmenteri%2Bkomunikasi%2Bdan%2Bdigital%2Bnomor%2B7%2Btahun%2B2026).
- [Komdigi — pengumuman penerapan registrasi biometrik](https://portal.komdigi.go.id/kanal-publik/berita-kini/10288).
- [XL — cara registrasi kartu prabayar](https://www.xl.co.id/bantuan/produk/kartu-perdana/cara-registrasi-kartu-xl-prabayar).
- [Kanal registrasi XL](https://registrasi.xl.co.id/), dicocokkan dengan tautan
  pada panduan XL, bukan ditebak dari nama domain.

Ringkasan membedakan syarat registrasi dari pilihan pelanggan untuk tidak
melanjutkan penawaran. Tidak menjanjikan aktivasi dengan melewati validasi.
Ketentuan khusus pelanggan diarahkan ke operator. Ringkasan dan tanggal
peninjauan terlihat di UI; tautan sumber ditempatkan dekat penjelasan terkait.

Registrasi XL hanya berupa tautan eksternal beralamat persis yang ditentukan,
dibuka di tab baru dengan noopener/noreferrer. Smartfren dan AXIS tetap null,
dengan informasi bahwa tautan belum dikonfigurasi. Tidak memuat iframe/form
operator. Isi ringkasan tersedia sebagai TypeScript lokal tanpa runtime fetch;
rujukan eksternal tetap memerlukan internet. PWA belum diimplementasikan.

Panduan pemeriksaan identitas merupakan panduan umum, bukan pernyataan
pengesahan perusahaan. Kontak supervisor belum dikonfigurasi; tidak ada nomor
pegawai, badge verifikasi, sertifikat, atau identitas resmi buatan.

## Pengelolaan konten
src/config/customer-trust.ts menjadi sumber tunggal untuk:
- Profil demo dan status tidak diverifikasi.
- Panduan pemeriksaan identitas serta supervisor.
- Prinsip kepercayaan, komitmen privasi, dan ringkasan edukasi.
- FAQ, skrip percakapan, slide presentasi, dan ID rujukan.
- URL resmi, kanal registrasi nullable, dan tanggal peninjauan editorial.

Komponen menggunakan teks biasa, tanpa HTML mentah atau input cerita pelanggan.
State hanya untuk pilihan kategori dan langkah presentasi; tidak ada penyimpanan
customer, backend, pemanggilan AI, atau akses perangkat. ComparisonProvider Phase
3 tetap utuh.

## File dibuat

| Kelompok | File |
| --- | --- |
| Konfigurasi | src/config/customer-trust.ts |
| Route + loading | src/app/promoter/page.tsx dan loading.tsx; src/app/trust/page.tsx dan loading.tsx; src/app/activation-guide/page.tsx dan loading.tsx; src/app/sales-assistant/page.tsx dan loading.tsx |
| Shell dan navigasi | src/components/trust/customer-page.tsx; customer-navigation.tsx |
| Profil | src/components/trust/promoter-profile.tsx |
| Pusat kepercayaan | src/components/trust/trust-center.tsx; trust-faq.tsx |
| Edukasi | src/components/trust/activation-education.tsx; official-channels.tsx; source-links.tsx |
| Presentasi dan visual | src/components/trust/presentation-mode.tsx; trust-illustration.tsx |
| Percakapan | src/components/trust/conversation-assistant.tsx |
| Homepage hub | src/features/home/components/customer-trust-hub.tsx |
| Tes | tests/customer-trust.test.mjs; tests/browser/phase4-smoke.mjs |
| Dokumentasi | docs/phase-4-review.md |
| Screenshot | docs/qa/phase4-promoter-tablet.png; phase4-trust-tablet.png; phase4-guide-tablet.png; phase4-assistant-tablet.png; phase4-presentation-tablet.png; phase4-presentation-mobile.png |

## File dimodifikasi
- src/app/page.tsx: menambahkan CustomerTrustHub, mempertahankan section lama.
- src/config/navigation.ts: menambah route kepercayaan dan daftar subnavigasi.
- src/components/layout/app-header.tsx: breakpoint navigasi desktop 1280px.
- src/components/layout/mobile-navigation.tsx: route baru, deduplikasi, overflow
  menu vertikal dan breakpoint yang sama dengan header.
- package.json: menambah script test:browser:trust saja.
- README.md: indeks dokumentasi Phase 4.

Tidak mengubah komponen katalog, filter, mesin rekomendasi, tabel/provider
perbandingan, root layout, maupun konfigurasi desain/fondasi.

## Hasil pengujian
- npm.cmd test: 35 lulus, 0 gagal (25 Phase 3 + 10 Phase 4).
- npm.cmd run lint: lulus tanpa error atau warning ESLint.
- npx.cmd --no-install tsc --noEmit: lulus.
- npm.cmd run build: lulus; seluruh route lama dan baru diprerender.
- npm.cmd run test:browser:trust: lulus di Microsoft Edge headless.
- npm.cmd run test:browser: regresi Phase 3 lulus.

Tes konten memeriksa profil demo/tanpa kredensial buatan, disclaimer yang
diminta, URL registrasi XL persis, kanal lain null, host HTTPS sumber,
urutan tujuh tahap, referensi yang valid, kelengkapan tujuh skrip, pesan
penolakan tanpa bypass, dan ketiadaan field/form/iframe/kamera dalam komponen.

Smoke test Phase 4 memeriksa:
- Route HTTP 200, satu h1, disclaimer personal, dan tanpa page overflow pada
  375x812, 768x1024, 1024x768, 1280x800.
- Kontrol utama minimal 44px pada keempat viewport.
- Navigasi homepage dan antarhalaman, menu mobile, penanda profil DATA DEMO.
- FAQ klik/Enter dan perilaku accordion satu item terbuka.
- URL eksternal HTTPS sesuai allowlist, atribut tab baru, dan dua kanal null.
- Navigasi presentasi sampai batas awal/akhir, tombol panah keyboard, Escape,
  pengembalian fokus, kesesuaian portrait/landscape, dan presentasi cepat sesuai
  kategori yang dipilih.
- Semua kategori skrip dapat dipilih tanpa mengetik.
- Tidak ada input/textarea/iframe/video pada halaman baru; tidak ada pemanggilan
  getUserMedia, request eksternal otomatis, atau pageerror selama alur uji.
- Screenshot ditinjau secara visual.

Regresi Phase 3 tetap mencakup filter, pencarian, detail, batas tiga produk,
perbandingan antarrute, wizard, syarat wajib, no-match, dan empat viewport.

## Menjalankan QA kembali
Gunakan Node 24 pada lingkungan ini:

~~~powershell
npm.cmd test
npm.cmd run lint
npx.cmd --no-install tsc --noEmit
npm.cmd run build
npm.cmd run start -- --port 3100
~~~

Pada terminal kedua, gunakan setup Playwright sementara yang dijelaskan pada
[laporan Phase 3](phase-3-review.md#menjalankan-kembali), lalu:

~~~powershell
npm.cmd run test:browser:trust
npm.cmd run test:browser
~~~

Script memerlukan XLSMART_PLAYWRIGHT_MODULE dan Edge terpasang.
XLSMART_QA_URL opsional untuk mengganti http://localhost:3100.
Screenshot presentasi/profil/FAQ ditulis ulang oleh script; screenshot guide
dan assistant merupakan capture visual tambahan dari build yang sama.

## Batasan
- Tidak ada verifikasi pegawai nyata atau kontak supervisor yang disahkan.
  URL atau nomor untuk verifikasi internal harus diberikan organisasi melalui
  proses yang sah; tidak diisi dengan data fiktif.
- Materi merupakan snapshot tanggal peninjauan. Perubahan aturan atau petunjuk
  operator memerlukan pembaruan editorial; bukan verifikasi regulasi real-time.
- Tautan Smartfren dan AXIS sengaja tetap belum dikonfigurasi.
- Uji browser memakai Edge desktop/emulasi viewport; belum tablet fisik,
  Safari/WebKit, pembaca layar, atau audit aksesibilitas menyeluruh.
- Proses registrasi eksternal tidak dijalankan dalam QA; tidak ada data
  pelanggan yang dimasukkan atau dikirim.
- Belum PWA/offline cache. Teks lokal siap dipakai saat caching diimplementasikan.
- Warning MODULE_TYPELESS_PACKAGE_JSON pada runner tes Node tetap nonfatal;
  mode modul aplikasi dipertahankan. Temuan audit dependency Phase 2 belum
  ditangani di luar lingkup fitur ini.

## Rekomendasi fase berikutnya
Phase 5: PWA offline dengan versi katalog/konten edukasi, tanggal peninjauan
yang terlihat, pembaruan cache dan fallback saat sumber eksternal tidak dapat
dibuka. Lanjutkan pengujian di tablet fisik/Safari dan tinjau dependensi tooling.
Informasi organisasi nyata hanya menggantikan demo setelah tersedia dari
sumber berwenang; hal itu tetap tidak membuat sales kit menjadi kartu pegawai.
