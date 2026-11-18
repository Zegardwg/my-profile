import { ChevronDown } from "lucide-react";
import { trustContent } from "@/config/customer-trust";
import { SourceLinks } from "./source-links";
export function TrustFaq() {
  return (
    <section aria-labelledby="faq-heading" className="mt-10">
      <p className="eyebrow mb-3 text-primary">Pertanyaan yang wajar</p>
      <h2 id="faq-heading" className="mb-6 text-2xl font-bold">
        Tanya dulu, baru putuskan.
      </h2>
      <div className="space-y-3">
        {trustContent.faq.map((item) => (
          <details
            key={item.id}
            name="customer-trust-faq"
            className="group rounded-xl border bg-white"
          >
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="border-t px-5 py-5">
              <p className="max-w-3xl text-sm leading-8 text-muted-foreground">
                {item.answer}
              </p>
              {"references" in item && <SourceLinks ids={item.references} />}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
