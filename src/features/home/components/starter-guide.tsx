import { ArrowUpRight } from "lucide-react";
import { brandStyles } from "@/lib/product-presentation";

const examples = [
  {
    brand: "xl",
    need: "Sering menyisakan kuota?",
    name: "Bebas Puas",
    benefit:
      "Sisa kuota bisa dibawa ke periode berikutnya jika perpanjangan paket berhasil. Berguna saat pemakaian internetmu naik turun.",
    url: "https://www.xl.co.id/bantuan/paket/paket-bebas-puas/cara-hitung-kuota-masa-aktif-bebas-puas",
  },
  {
    brand: "smartfren",
    need: "Ingin tetap online saat kuota habis?",
    name: "Kuota Nonstop",
    benefit:
      "Setelah kuota utama habis, kamu tetap bisa mengakses internet sampai masa aktif paket berakhir. Kecepatannya disesuaikan.",
    url: "https://www.smartfren.com/connect-with-us/support/faq/?categoryId=200&parent=87",
  },
  {
    brand: "axis",
    need: "Jam internetanmu sering berubah?",
    name: "BRONET 24 Jam",
    benefit:
      "Kuota utama bisa dipakai pagi, siang, atau malam. Cocok kalau jadwal belajar atau kerjamu berganti-ganti.",
    url: "https://www.axis.co.id/produk/paket-internet/paket-bronet",
  },
] as const;

export function StarterGuide() {
  return (
    <section aria-labelledby="starter-guide" className="mt-10 border-t pt-8">
      <h2
        id="starter-guide"
        className="font-heading text-2xl font-semibold text-navy"
      >
        Kartu mana yang cocok untukmu?
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Kenali contoh paket tiap merek. Sebelum membeli, cocokkan nama paket dan
        manfaatnya dengan isi kartu yang ditawarkan promotor.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {examples.map(({ brand, need, name, benefit, url }) => (
          <div
            key={brand}
            className={`flex flex-col rounded-2xl p-5 ${brandStyles[brand].surface}`}
          >
            <p className={`text-sm font-semibold ${brandStyles[brand].text}`}>
              {brandStyles[brand].label} · {name}
            </p>
            <h3 className="mt-3 text-lg leading-snug font-bold text-navy">
              {need}
            </h3>
            <p className="mt-2 mb-3 text-sm leading-6 text-slate-700">
              {benefit}
            </p>
            <a
              href={url}
              className="mt-auto inline-flex min-h-11 items-center gap-1 self-start text-sm font-semibold text-navy underline underline-offset-4"
            >
              Cek ketentuan {name}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
