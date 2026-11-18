import { activationSteps, trustContent } from "@/config/customer-trust";
import { TrustIllustration } from "./trust-illustration";
import { SourceLinks, OfficialReferences } from "./source-links";
import { PresentationMode } from "./presentation-mode";
import { OfficialChannels } from "./official-channels";
export function ActivationEducation() {
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Tujuh tahap edukasi · bukan proses aktivasi.
        </p>
        <PresentationMode slides={activationSteps} />
      </div>
      <section
        aria-labelledby="current-rules"
        className="mb-8 rounded-2xl border bg-white p-6 sm:p-8"
      >
        <p className="eyebrow mb-3 text-primary">Konteks aturan saat ini</p>
        <h2 id="current-rules" className="text-2xl font-bold">
          Mengapa NIK dan wajah dibahas?
        </h2>
        <p className="mt-4 text-sm leading-8 text-muted-foreground">
          {trustContent.education.regulatorySummary}
        </p>
        <SourceLinks ids={["regulation"]} />
        <p className="mt-4 text-sm leading-8 text-muted-foreground">
          {trustContent.education.rolloutSummary}
        </p>
        <SourceLinks ids={["rollout"]} />
        <p className="mt-4 text-sm leading-8 text-muted-foreground">
          {trustContent.education.xlSummary}
        </p>
        <SourceLinks ids={["xlGuide"]} />
        <p className="mt-5 border-t pt-4 text-xs leading-6 text-muted-foreground">
          Ditinjau {trustContent.reviewedLabel}. Ringkasan edukasi ini tidak
          menggantikan ketentuan lengkap operator.
        </p>
      </section>
      <ol className="space-y-5">
        {activationSteps.map((step, index) => (
          <li
            key={step.id}
            className="grid gap-5 rounded-2xl border bg-white p-5 sm:p-7 lg:grid-cols-[180px_minmax(0,1fr)]"
          >
            <TrustIllustration kind={step.illustration} />
            <div>
              <p className="eyebrow mb-3 text-primary">Tahap 0{index + 1}</p>
              <h2 className="text-xl font-bold">{step.title}</h2>
              <p className="mt-3 text-sm leading-8 text-muted-foreground">
                {step.body}
              </p>
              <p className="mt-3 text-xs leading-7 text-muted-foreground">
                {step.detail}
              </p>
              {step.references && <SourceLinks ids={step.references} />}
            </div>
          </li>
        ))}
      </ol>
      <section
        aria-labelledby="consent-heading"
        className="mt-8 grid gap-5 md:grid-cols-2"
      >
        <article className="rounded-2xl border border-primary/15 bg-secondary p-6">
          <h2 id="consent-heading" className="text-xl font-bold">
            Pahami sebelum menyetujui
          </h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            {trustContent.education.consent}
          </p>
        </article>
        <article className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">Boleh tidak melanjutkan</h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            {trustContent.education.refusal}
          </p>
          <SourceLinks ids={["regulation"]} />
        </article>
      </section>
      <OfficialChannels />
      <OfficialReferences />
    </div>
  );
}
