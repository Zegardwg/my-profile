import { HandHeart, Layers3, MapPin } from "lucide-react";
import { trustContent, profileSlides } from "@/config/customer-trust";
import Image from "next/image";
import { PresentationMode } from "./presentation-mode";
export function PromoterProfile() {
  const profile = trustContent.profile;
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold text-primary">
          DATA DEMO · PROFIL CONTOH
        </p>
        <PresentationMode slides={profileSlides} />
      </div>
      <div className="grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="min-w-0">
          <Image
            src="/images/promotor.webp"
            alt="Potret promotor mengenakan seragam biru XLSMART"
            width={640}
            height={800}
            unoptimized
            className="mx-auto h-auto w-full max-w-xs rounded-2xl"
          />
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            {trustContent.identityDisclaimer}
          </p>
        </div>
        <section
          aria-labelledby="profile-name"
          className="rounded-2xl border bg-white p-6 sm:p-8"
        >
          <p className="eyebrow mb-3 text-primary">
            Kenali pendamping presentasimu
          </p>
          <h2 id="profile-name" className="text-3xl font-bold">
            {profile.displayName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile.role} · DATA DEMO
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm">
            <MapPin
              className="size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            {profile.area}
          </p>
          <p className="mt-6 text-sm leading-8 text-muted-foreground">
            {profile.introduction}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {profile.brands.map((brand) => (
              <span
                key={brand}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-navy"
              >
                {brand}
              </span>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-muted-foreground">
            Contoh lingkup layanan multi-brand; bukan bukti hubungan kerja,
            penugasan, atau dukungan resmi dari merek.
          </p>
        </section>
      </div>
      <section aria-labelledby="verification-heading" className="mt-10">
        <h2 id="verification-heading" className="mb-5 text-2xl font-bold">
          Periksa identitas, bukan tampilan.
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {trustContent.verification.map((item, index) => (
            <article key={item.id} className="rounded-2xl border bg-white p-6">
              <p className="mb-4 text-sm font-semibold text-primary">
                0{index + 1}
              </p>
              <h3 className="text-base font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          Status pada aplikasi: {profile.verificationStatus}. Kontak supervisor
          belum tersedia; tidak ada nomor identitas atau kredensial contoh.
        </p>
      </section>
      <section
        aria-labelledby="privacy-heading"
        className="mt-8 grid gap-5 md:grid-cols-2"
      >
        <div className="rounded-2xl border border-primary/15 bg-secondary p-6">
          <HandHeart aria-hidden="true" className="mb-4 size-6 text-primary" />
          <h2 id="privacy-heading" className="text-xl font-bold">
            Komitmen privasi dan pilihan
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {trustContent.privacyCommitment}
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <Layers3 aria-hidden="true" className="mb-4 size-6 text-primary" />
          <h2 className="text-xl font-bold">Pelayanan tanpa tekanan</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Penjelasan diberikan agar Anda memahami pilihan. Anda dapat meminta
            waktu, mencari pendapat lain, atau tidak melanjutkan. Tidak ada
            janji harga demo berlaku atau aktivasi pasti berhasil.
          </p>
        </div>
      </section>
    </div>
  );
}
