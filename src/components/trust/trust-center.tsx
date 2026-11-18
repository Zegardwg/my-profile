import { trustContent, trustSlides } from "@/config/customer-trust";
import { PresentationMode } from "./presentation-mode";
import { TrustFaq } from "./trust-faq";
import { OfficialReferences } from "./source-links";
export function TrustCenter() {
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Enam hal yang dapat Anda periksa sendiri.
        </p>
        <PresentationMode slides={trustSlides} />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {trustContent.trustPrinciples.map((item, index) => (
          <article key={item.id} className="rounded-2xl border bg-white p-6">
            <span className="mb-5 inline-flex size-10 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-primary">
              0{index + 1}
            </span>
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>
      <TrustFaq />
      <OfficialReferences />
    </div>
  );
}
