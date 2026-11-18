import { ExternalLink } from "lucide-react";
import { trustContent, type ReferenceId } from "@/config/customer-trust";
export function SourceLinks({ ids }: { ids: readonly ReferenceId[] }) {
  if (!ids.length) return null;
  return (
    <ul
      aria-label="Rujukan penjelasan"
      className="mt-4 flex flex-wrap gap-x-5 gap-y-1"
    >
      {ids.map((id) => (
        <li key={id}>
          <a
            href={trustContent.references[id].url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-md text-xs leading-5 font-semibold text-primary underline-offset-4 hover:underline"
          >
            {trustContent.references[id].label}
            <ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="sr-only"> (sumber resmi, tab baru)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
export function OfficialReferences() {
  return (
    <section
      aria-labelledby="trust-sources"
      className="mt-10 rounded-2xl border bg-white p-5 sm:p-7"
    >
      <p className="eyebrow mb-3 text-primary">Baca dari sumbernya</p>
      <h2 id="trust-sources" className="text-xl font-bold">
        Rujukan resmi, bukan pengesahan aplikasi
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        Materi ditinjau pada {trustContent.reviewedLabel}. Ringkasan ini untuk
        edukasi; perubahan ketentuan perlu diperiksa langsung pada sumber.
        Tautan resmi tidak membuktikan status promotor.
      </p>
      <SourceLinks ids={["regulation", "rollout", "xlGuide"]} />
    </section>
  );
}
