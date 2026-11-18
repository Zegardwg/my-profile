import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
export function SmartPackageFinder() {
  return (
    <section
      id="finder"
      aria-labelledby="finder-title"
      className="mt-6 flex flex-wrap items-center gap-5 rounded-2xl border bg-white p-6 shadow-card sm:p-7"
    >
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
        <SlidersHorizontal className="size-6" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 basis-56">
        <p className="eyebrow mb-2 text-primary">Smart Package Finder</p>
        <h2 id="finder-title" className="text-xl font-bold">
          Mulai dari kebutuhanmu.
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Empat langkah sederhana untuk menemukan contoh paket yang sesuai.
        </p>
      </div>
      <Link
        href="/finder"
        className="action-link w-full bg-primary text-white hover:bg-navy sm:w-auto"
      >
        Coba pencari paket <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </section>
  );
}
