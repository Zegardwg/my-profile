import Link from "next/link";
import { ArrowDown, ArrowUpRight, Layers3 } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="overflow-hidden rounded-3xl bg-navy text-white"
    >
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:p-10 xl:p-12">
        <div className="flex flex-col items-start justify-center py-2">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-[11px] font-medium tracking-wide">
            <span className="size-1.5 rounded-full bg-mint" />
            PERSONAL SALES KIT <span className="text-white/50">/</span> V1.0
            DEMO
          </p>
          <h1
            id="hero-title"
            className="max-w-xl text-4xl leading-[1.15] font-bold tracking-[-0.04em] sm:text-5xl lg:text-[3rem] xl:text-[3.5rem]"
          >
            Koneksi yang pas.
            <br />
            <span className="text-[#8fbcff]">Untuk setiap cerita.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-blue-100/85 sm:text-base">
            Dari rutinitas harian sampai rencana besar. Kenali pilihan XL,
            Smartfren, dan AXIS dalam satu presentasi yang lebih sederhana.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="action-link bg-white text-navy hover:bg-blue-100"
            >
              Jelajahi paket demo{" "}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <a
              href="#edukasi"
              className="action-link border border-white/30 text-white hover:bg-white/10"
            >
              Kenali panduannya{" "}
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
          <p className="mt-8 flex items-center gap-2 text-xs text-blue-100/75">
            <Layers3 className="size-4 shrink-0" aria-hidden="true" />3 merek.
            Beragam kebutuhan. Satu tempat eksplorasi.
          </p>
        </div>
        <ImagePlaceholder className="min-h-80 bg-linear-to-br from-[#17488e] to-[#0b2b63] lg:min-h-100" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-4 text-[11px] text-blue-100/75 sm:px-10 xl:px-12">
        <span>EXPLORE. UNDERSTAND. CONNECT.</span>
        <span>Alat presentasi personal · bukan situs resmi operator</span>
      </div>
    </section>
  );
}
