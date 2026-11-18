// Public, editorial content only. Never place credentials or customer data here.
export type ReferenceId =
  "regulation" | "rollout" | "xlGuide" | "xlRegistration";
export type IllustrationKind =
  "person" | "review" | "privacy" | "choice" | "channel" | "status" | "package";
export interface PresentationSlide {
  id: string;
  title: string;
  body: string;
  detail?: string;
  illustration: IllustrationKind;
  references?: readonly ReferenceId[];
}
export interface ConversationScript {
  id: string;
  category: string;
  concern: string;
  response: string;
  explanation: string;
  action: string;
  neverPromise: string;
  references?: readonly ReferenceId[];
}
export const trustContent = {
  reviewedAt: "2026-11-18",
  reviewedLabel: "18 November 2026",
  personalDisclaimer:
    "Alat presentasi pribadi promotor. Identitas dan penugasan dapat diperiksa melalui kanal resmi perusahaan.",
  identityDisclaimer:
    "Profil dan area di halaman ini adalah DATA DEMO, bukan identitas pegawai atau bukti penugasan.",
  privacyCommitment:
    "Sales kit ini tidak meminta atau menyimpan NIK, foto KTP, wajah, OTP, ICCID, maupun kredensial akun pelanggan. Tidak ada akses kamera, formulir registrasi, atau pembayaran.",
  profile: {
    displayName: "Promotor Contoh",
    area: "Area presentasi contoh — DATA DEMO",
    role: "Pendamping eksplorasi paket multi-brand",
    introduction:
      "Saya membantu menjelaskan pilihan paket dengan bahasa yang mudah dipahami. Kita bisa membandingkan kebutuhan, melihat batasan, lalu memeriksa informasi sebenarnya melalui kanal resmi. Keputusan untuk melanjutkan tetap milik Anda.",
    brands: ["XL", "Smartfren", "AXIS"],
    supervisorContact: null,
    verificationStatus: "Tidak diverifikasi oleh aplikasi",
  },
  verification: [
    {
      id: "credential",
      title: "Periksa identitas yang diterbitkan perusahaan",
      body: "Minta promotor menunjukkan identitas kerja asli. Cocokkan nama dan foto secara langsung. Tampilan profil, seragam, atau halaman sales kit saja bukan bukti status pegawai.",
    },
    {
      id: "independent",
      title: "Konfirmasi secara mandiri",
      body: "Gunakan kanal perusahaan yang Anda temukan sendiri dari situs atau gerai resmi. Minta diarahkan ke supervisor yang berwenang, lalu konfirmasi nama, area tugas, dan kewenangan layanan. Jangan hanya mengandalkan nomor atau tautan dari orang yang menawarkan.",
    },
    {
      id: "pending",
      title: "Belum mendapat konfirmasi? Beri waktu.",
      body: "Kontak supervisor belum dikonfigurasi di sales kit ini. Jangan menganggap identitas atau penugasan sudah disahkan. Tunda proses sampai Anda memperoleh jawaban dari kanal resmi yang dapat dipercaya.",
    },
  ],
  trustPrinciples: [
    {
      id: "identity",
      title: "Lihat identitas asli",
      body: "Minta identitas kerja yang benar-benar diterbitkan perusahaan dan periksa langsung. Tidak ada badge pengesahan pegawai dalam aplikasi ini.",
    },
    {
      id: "supervisor",
      title: "Konfirmasi melalui kanal independen",
      body: "Cari kontak perusahaan atau gerai resmi secara mandiri. Minta verifikasi melalui supervisor yang berwenang sebelum memberikan kepercayaan.",
    },
    {
      id: "offer",
      title: "Periksa penawaran sebenarnya",
      body: "Cocokkan harga, kuota utama, kuota khusus, masa aktif, syarat, dan ketersediaan di kanal operator. Seluruh paket di katalog ini fiktif.",
    },
    {
      id: "registration",
      title: "Pahami proses registrasi",
      body: "Baca petunjuk, penggunaan data, dan persyaratan pada kanal resmi. Registrasi tidak berlangsung di sales kit ini.",
    },
    {
      id: "requests",
      title: "Kenali permintaan yang mencurigakan",
      body: "Jangan kirim foto dokumen, OTP, atau data akun ke chat pribadi atau sales kit. Jika diminta memasang aplikasi tidak dikenal atau menyerahkan akun, hentikan proses dan cari bantuan resmi.",
    },
    {
      id: "choice",
      title: "Anda boleh berhenti",
      body: "Anda boleh bertanya, menunda, atau tidak melanjutkan penawaran. Penolakan tidak boleh dibalas tekanan atau janji bahwa syarat registrasi bisa dilewati.",
    },
  ],
  education: {
    regulatorySummary:
      "Permen Komdigi Nomor 7 Tahun 2026 mengatur registrasi pelanggan seluler menggunakan NIK dan data biometrik pengenalan wajah untuk WNI, dengan ketentuan khusus bagi kelompok tertentu. Konfirmasikan prosedur yang berlaku pada operator.",
    rolloutSummary:
      "Komdigi mengumumkan penerapan penuh untuk aktivasi nomor baru mulai 1 Juli 2026. Registrasi ulang biometrik pelanggan lama yang sudah memakai NIK dan KK sebelum tanggal tersebut disebut sukarela.",
    xlSummary:
      "Panduan XL meminta NIK dan verifikasi wajah melalui myXL atau registrasi.xl.co.id. Untuk kondisi khusus, termasuk pelanggan anak atau WNA, minta petunjuk gerai resmi; jangan menggunakan identitas orang lain tanpa hak.",
    consent:
      "Baca tujuan penggunaan data dan pemberitahuan privasi operator sebelum memilih melanjutkan. Jangan memberikan persetujuan karena tekanan. Aplikasi ini tidak dapat menjamin pengelolaan data pada sistem pihak lain.",
    refusal:
      "Anda boleh menolak atau menghentikan proses penawaran. Jika persyaratan registrasi yang berlaku tidak dipenuhi, nomor baru tidak dapat dijanjikan aktif. Tanyakan penjelasan atau bantuan pada operator; tidak ada jalan pintas melalui sales kit.",
    failed:
      "Jika proses gagal, periksa pesan pada sistem operator dan hubungi bantuan resminya. Jangan menganggap layanan aktif berdasarkan ucapan promotor atau tampilan sales kit.",
  },
  references: {
    regulation: {
      label: "Permen Komdigi Nomor 7 Tahun 2026",
      publisher: "JDIH Komdigi",
      url: "https://jdih.komdigi.go.id/produk_hukum/view/id/1001/t/peraturan%2Bmenteri%2Bkomunikasi%2Bdan%2Bdigital%2Bnomor%2B7%2Btahun%2B2026",
    },
    rollout: {
      label: "Penerapan registrasi biometrik nomor baru",
      publisher: "Komdigi",
      url: "https://portal.komdigi.go.id/kanal-publik/berita-kini/10288",
    },
    xlGuide: {
      label: "Cara registrasi kartu XL prabayar",
      publisher: "XL",
      url: "https://www.xl.co.id/bantuan/produk/kartu-perdana/cara-registrasi-kartu-xl-prabayar",
    },
    xlRegistration: {
      label: "Registrasi XL — situs eksternal",
      publisher: "XL",
      url: "https://registrasi.xl.co.id/",
    },
  } satisfies Record<
    ReferenceId,
    { label: string; publisher: string; url: string }
  >,
  registrationChannels: [
    { brand: "XL", url: "https://registrasi.xl.co.id/", reference: "xlGuide" },
    { brand: "Smartfren", url: null, reference: null },
    { brand: "AXIS", url: null, reference: null },
  ],
  faq: [
    {
      id: "identity",
      question: "Apakah profil ini membuktikan promotor resmi?",
      answer:
        "Tidak. Nama, foto placeholder, dan area profil merupakan data demo. Periksa identitas asli dari perusahaan dan konfirmasikan penugasan melalui kanal perusahaan yang Anda cari secara mandiri.",
    },
    {
      id: "face",
      question: "Mengapa ada verifikasi wajah saat registrasi?",
      answer:
        "Kerangka registrasi seluler saat ini menggunakan pencocokan identitas berbasis NIK dan wajah. Pelaksanaannya berada pada kanal operator, bukan aplikasi presentasi ini.",
      references: ["regulation"],
    },
    {
      id: "data",
      question: "Apakah data saya aman di sales kit ini?",
      answer:
        "Aplikasi ini tidak mengumpulkan data identitas pelanggan. Jangan masukkan atau kirim data sensitif ke promotor melalui aplikasi ini. Untuk sistem operator, baca kebijakan privasi dan tanyakan perlindungannya; tidak ada jaminan keamanan mutlak dari sales kit.",
    },
    {
      id: "package",
      question: "Apakah harga dan paket di katalog benar-benar tersedia?",
      answer:
        "Tidak dapat disimpulkan dari katalog ini. Semua paket, harga, dan status ketersediaan adalah fiktif. Minta informasi aktual dari kanal resmi sebelum memutuskan.",
    },
    {
      id: "refuse",
      question: "Bolehkah saya menolak verifikasi biometrik?",
      answer:
        "Anda boleh tidak melanjutkan proses penawaran atau registrasi. Namun, ini bukan pembebasan dari syarat aktivasi yang berlaku. Tanyakan pilihan bantuan resmi; promotor tidak boleh menjanjikan aktivasi dengan melewati persyaratan.",
      references: ["regulation"],
    },
    {
      id: "old",
      question: "Bagaimana dengan nomor lama yang sudah terdaftar?",
      answer:
        "Pengumuman Komdigi menyebut registrasi ulang biometrik secara sukarela bagi pelanggan yang telah terdaftar dengan NIK dan KK sebelum 1 Juli 2026. Periksa kondisi nomor Anda langsung pada operator.",
      references: ["rollout"],
    },
    {
      id: "failed",
      question: "Apa yang harus dilakukan jika registrasi gagal?",
      answer:
        "Jangan mengirim dokumen ke chat pribadi untuk mencoba jalan pintas. Catat pesan kegagalan pada perangkat Anda sendiri dan minta bantuan resmi. Keberhasilan hanya dapat diperiksa di sistem operator.",
    },
    {
      id: "channel",
      question: "Di mana saya dapat memulai registrasi XL?",
      answer:
        "Panduan XL mengarahkan ke myXL atau registrasi.xl.co.id. Periksa alamat situs sebelum melanjutkan. Tautan Smartfren dan AXIS belum dikonfigurasi di aplikasi ini.",
      references: ["xlGuide"],
    },
  ],
} as const;

export const activationSteps: readonly PresentationSlide[] = [
  {
    id: "choose",
    title: "Pilih sesuai kebutuhan",
    body: "Mulai dari anggaran, pemakaian internet, dan masa aktif. Paket di sales kit ini hanya contoh fiktif.",
    detail: "Belum ada pemesanan atau transaksi pada tahap ini.",
    illustration: "package",
  },
  {
    id: "review",
    title: "Baca informasi paket",
    body: "Periksa harga, kuota utama, manfaat, batasan, dan ketersediaan pada kanal resmi operator.",
    detail:
      "Jangan mengandalkan harga demo sebagai penawaran yang dapat dibeli.",
    illustration: "review",
  },
  {
    id: "identity",
    title: "Periksa promotor secara mandiri",
    body: "Lihat identitas kerja asli dan konfirmasikan penugasan melalui kanal perusahaan yang Anda temukan sendiri.",
    detail:
      "Halaman profil bukan kartu pegawai dan tidak mengesahkan status siapa pun.",
    illustration: "person",
  },
  {
    id: "requirements",
    title: "Pahami persyaratan dan privasi",
    body: "Untuk WNI, kerangka registrasi menggunakan NIK dan pengenalan wajah. Ikuti ketentuan operator sesuai kondisi pelanggan.",
    detail:
      "Baca penggunaan data dan pemberitahuan privasi. Jangan kirim NIK, foto KTP, wajah, OTP, ICCID, atau kata sandi ke sales kit.",
    illustration: "privacy",
    references: ["regulation", "xlGuide"],
  },
  {
    id: "choice",
    title: "Tentukan pilihan tanpa tekanan",
    body: "Anda boleh bertanya, menunda, atau berhenti. Promotor harus menghormati keputusan tersebut.",
    detail:
      "Tidak melanjutkan bukan berarti syarat aktivasi dapat dilewati. Aktivasi tetap bergantung pada persyaratan operator.",
    illustration: "choice",
    references: ["regulation"],
  },
  {
    id: "external",
    title: "Registrasi di kanal resmi",
    body: "Jika memilih melanjutkan, gunakan kanal operator yang sah. Untuk XL, panduan resminya menunjuk myXL atau registrasi.xl.co.id.",
    detail:
      "Proses terjadi di luar aplikasi ini. Tautan Smartfren dan AXIS belum dikonfigurasi.",
    illustration: "channel",
    references: ["xlGuide"],
  },
  {
    id: "status",
    title: "Periksa status di sistem sebenarnya",
    body: "Lihat hasil pada sistem operator. Bila gagal, gunakan bantuan resmi dan jangan menganggap nomor sudah aktif.",
    detail:
      "Sales kit tidak menampilkan konfirmasi aktivasi atau menjanjikan keberhasilan.",
    illustration: "status",
  },
];
export const conversationScripts: readonly ConversationScript[] = [
  {
    id: "legitimate",
    category: "Identitas promotor",
    concern: "Apakah promotor ini benar-benar berwenang?",
    response:
      "Wajar jika Anda ingin memastikan. Silakan periksa identitas kerja asli dan konfirmasi penugasan lewat kanal perusahaan yang Anda temukan sendiri. Kita bisa menunggu.",
    explanation:
      "Profil demo bukan identitas kerja atau bukti persetujuan perusahaan.",
    action:
      "Tawarkan waktu untuk menghubungi gerai atau supervisor berwenang melalui kontak yang diperoleh secara mandiri.",
    neverPromise:
      "Jangan menyatakan aplikasi ini mengesahkan identitas atau bahwa seragam saja membuktikan kewenangan.",
  },
  {
    id: "face",
    category: "Alasan verifikasi wajah",
    concern: "Mengapa wajah saya perlu diverifikasi?",
    response:
      "Saya mengerti hal ini sensitif. Mari baca persyaratan resmi dan tujuan penggunaan datanya terlebih dahulu. Verifikasi tidak dilakukan di sales kit ini.",
    explanation:
      "Aturan registrasi menggunakan NIK dan biometrik wajah pada sistem yang ditentukan operator.",
    action:
      "Buka penjelasan resmi bersama pelanggan, tanpa mengambil gambar atau meminta izin kamera di sini.",
    neverPromise:
      "Jangan menjanjikan aktivasi tanpa persyaratan yang berlaku atau mengaku dapat mengesahkan wajah sendiri.",
    references: ["regulation", "xlGuide"],
  },
  {
    id: "privacy",
    category: "Privasi data",
    concern: "Apakah data pribadi saya benar-benar aman?",
    response:
      "Anda berhak memahami bagaimana data dipakai. Aplikasi ini tidak meminta data identitas Anda. Untuk proses operator, mari periksa pemberitahuan privasi dan kanal bantuannya.",
    explanation:
      "Pemisahan aplikasi presentasi dan sistem registrasi mencegah pengumpulan data pelanggan di sales kit.",
    action:
      "Arahkan pelanggan membaca penjelasan pengelola data pada kanal resmi dan ajukan pertanyaan bila belum jelas.",
    neverPromise:
      "Jangan menjanjikan keamanan 100%, masa simpan tertentu, atau penghapusan data yang tidak dapat Anda pastikan.",
  },
  {
    id: "availability",
    category: "Ketersediaan paket",
    concern: "Apakah paket ini benar-benar bisa saya gunakan?",
    response:
      "Yang terlihat di sini contoh fiktif. Sebelum memilih, kita perlu memeriksa penawaran nyata, harga, masa aktif, dan ketentuannya di kanal operator.",
    explanation: "Indikator tersedia pada katalog ini hanya status demo.",
    action:
      "Perlihatkan perbedaan data demo dan informasi aktual dari operator sebelum ada keputusan.",
    neverPromise:
      "Jangan menjamin harga demo, bonus, stok, atau keberhasilan pembelian sebagai penawaran resmi.",
  },
  {
    id: "network",
    category: "Kesesuaian jaringan",
    concern: "Apakah jaringannya cocok untuk lokasi saya?",
    response:
      "Kebutuhan dan kondisi setiap lokasi bisa berbeda. Mari periksa informasi cakupan resmi dan kesesuaian perangkat sebelum memutuskan.",
    explanation:
      "Cakupan, kondisi bangunan, perangkat, dan kepadatan pemakaian dapat memengaruhi pengalaman.",
    action:
      "Minta pelanggan memeriksa cakupan lewat kanal operator dan menanyakan pengujian yang memang disediakan.",
    neverPromise:
      "Jangan menjanjikan sinyal penuh, kecepatan tetap, atau layanan tanpa gangguan.",
  },
  {
    id: "failed",
    category: "Registrasi gagal",
    concern: "Bagaimana jika proses registrasi tidak berhasil?",
    response:
      "Kita tidak perlu memaksakan proses. Periksa petunjuk kegagalan di sistem operator dan hubungi bantuan resminya.",
    explanation:
      "Sales kit tidak memiliki akses untuk memeriksa atau memperbaiki data kependudukan maupun status registrasi.",
    action:
      "Arahkan ke gerai atau bantuan resmi; jangan meminta dokumen dikirim ke akun pribadi.",
    neverPromise:
      "Jangan menjanjikan berhasil dalam waktu tertentu, melewati validasi, atau menyebut nomor aktif sebelum ada hasil resmi.",
  },
  {
    id: "refuse",
    category: "Hak untuk tidak melanjutkan",
    concern: "Bolehkah saya menolak registrasi biometrik?",
    response:
      "Tentu, Anda boleh menghentikan atau menunda proses ini. Tidak perlu mengambil keputusan sekarang. Saya akan menghormati pilihan Anda.",
    explanation:
      "Hak untuk tidak melanjutkan penawaran tidak berarti persyaratan aktivasi nomor baru dikecualikan.",
    action:
      "Hentikan penawaran bila diminta. Jika pelanggan ingin penjelasan lebih lanjut, arahkan ke operator tanpa tekanan.",
    neverPromise:
      "Jangan mengancam, menciptakan urgensi palsu, memakai identitas orang lain, atau menawarkan aktivasi di luar ketentuan.",
    references: ["regulation"],
  },
];
export const profileSlides: readonly PresentationSlide[] = [
  {
    id: "profile",
    title: trustContent.profile.displayName + " · DATA DEMO",
    body: trustContent.profile.introduction,
    detail: trustContent.identityDisclaimer,
    illustration: "person",
  },
  ...trustContent.verification.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    illustration: "review" as const,
  })),
  {
    id: "privacy",
    title: "Privasi dan pilihan tetap milik Anda",
    body: trustContent.privacyCommitment,
    detail: "Anda boleh berhenti atau menunda kapan saja.",
    illustration: "privacy",
  },
];
export const trustSlides: readonly PresentationSlide[] =
  trustContent.trustPrinciples.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    illustration: item.id === "choice" ? "choice" : "review",
  }));
export function conversationSlides(
  scripts: readonly ConversationScript[],
): PresentationSlide[] {
  return scripts.map((script) => ({
    id: script.id,
    title: script.concern,
    body: script.response,
    detail:
      script.explanation +
      " Langkah berikutnya: " +
      script.action +
      " Batas layanan: " +
      script.neverPromise,
    illustration: "choice",
    references: script.references,
  }));
}
