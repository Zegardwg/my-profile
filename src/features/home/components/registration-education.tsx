import { ExternalLink, LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { TrustInformationCard } from "@/components/shared/trust-information-card";

export function RegistrationEducation() {
  return (
    <section id="edukasi" aria-labelledby="education-title" className="section-space border-t">
      <SectionHeading id="education-title" eyebrow="Kenali sebelum mulai" title="Lebih paham. Lebih tenang." description="Panduan sederhana untuk melanjutkan proses melalui kanal resmi operator." />
      <div className="grid gap-5 md:grid-cols-3">
        <TrustInformationCard icon={MessageCircle} step="01" title="Pahami pilihan paket" description="Diskusikan kebutuhan internet, anggaran, serta perangkat yang digunakan sebelum menentukan pilihan." />
        <TrustInformationCard icon={ShieldCheck} step="02" title="Gunakan kanal resmi" description="Periksa harga, cakupan, ketentuan, dan panduan registrasi terbaru melalui kanal resmi operator pilihanmu." />
        <TrustInformationCard icon={LockKeyhole} step="03" title="Jaga data tetap pribadi" description="Jangan kirim NIK, OTP, atau data biometrik ke sales kit ini. Proses registrasi hanya melalui kanal resmi operator." />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/10 bg-secondary p-5">
        <p className="max-w-xl text-xs leading-6 text-muted-foreground"><strong className="font-semibold text-navy">Di sini cukup eksplorasi.</strong> Sales kit ini tidak memproses registrasi, pembayaran, atau data identitas pelanggan.</p>
        <a href="https://www.xlsmart.co.id/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-primary">Situs resmi XLSMART <ExternalLink className="size-4" aria-hidden="true" /><span className="sr-only"> (tab baru)</span></a>
      </div>
    </section>
  );
}

