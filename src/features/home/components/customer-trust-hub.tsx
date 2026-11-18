import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { customerNavigation } from "@/config/navigation";
const descriptions = [
  "Kenali profil contoh dan cara memeriksa penugasan secara mandiri.",
  "Periksa informasi, ajukan pertanyaan, dan tentukan pilihan tanpa tekanan.",
  "Pahami privasi dan langkah registrasi pada kanal resmi operator.",
  "Penjelasan singkat untuk kekhawatiran pelanggan, tanpa perlu mengetik.",
];
export function CustomerTrustHub() {
  return (
    <section
      aria-labelledby="customer-hub-title"
      className="section-space border-t"
    >
      <SectionHeading
        id="customer-hub-title"
        eyebrow="Percaya setelah memahami"
        title="Ruang untuk bertanya. Hak untuk memilih."
        description="Kenali batas aplikasi personal ini dan periksa informasi melalui sumber yang tepat."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {customerNavigation.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-44 flex-col rounded-2xl border bg-white p-6 transition-colors hover:border-primary/40"
          >
            <span className="mb-4 flex items-center justify-between text-xs font-semibold text-primary">
              0{index + 1}
              <ArrowUpRight aria-hidden="true" className="size-5" />
            </span>
            <h3 className="text-base font-bold group-hover:text-primary">
              {item.label}
            </h3>
            <p className="mt-3 text-xs leading-7 text-muted-foreground">
              {descriptions[index]}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
