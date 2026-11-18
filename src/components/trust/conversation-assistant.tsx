"use client";
import { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  conversationScripts,
  conversationSlides,
} from "@/config/customer-trust";
import { PresentationMode } from "./presentation-mode";
import { SourceLinks } from "./source-links";
export function ConversationAssistant() {
  const [selected, setSelected] = useState(conversationScripts[0].id);
  const script =
    conversationScripts.find((item) => item.id === selected) ??
    conversationScripts[0];
  const slides = conversationSlides(conversationScripts);
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          Pilih topik tanpa mengetik. Semua penjelasan dapat ditampilkan
          langsung kepada pelanggan; tidak ada catatan pribadi atau data
          pelanggan.
        </p>
        <PresentationMode
          slides={slides}
          initialIndex={conversationScripts.indexOf(script)}
          label="Presentasi cepat"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div
          role="group"
          aria-label="Topik kekhawatiran pelanggan"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1"
        >
          {conversationScripts.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              aria-pressed={script.id === item.id}
              aria-controls="conversation-content"
              className={
                "min-h-20 w-full justify-start gap-3 rounded-xl px-4 py-4 text-left whitespace-normal " +
                (script.id === item.id
                  ? "border-primary bg-secondary text-primary"
                  : "bg-white")
              }
              onClick={() => setSelected(item.id)}
            >
              <MessageCircle aria-hidden="true" className="size-5 shrink-0" />
              <span className="flex-1 leading-6">{item.category}</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          ))}
        </div>
        <section
          id="conversation-content"
          aria-labelledby="conversation-title"
          className="min-w-0 rounded-2xl border bg-white p-6 sm:p-8"
        >
          <p className="eyebrow mb-3 text-primary">
            Yang pelanggan khawatirkan
          </p>
          <h2
            id="conversation-title"
            className="text-2xl leading-tight font-bold"
          >
            {script.concern}
          </h2>
          <div aria-live="polite">
            <section className="mt-6 rounded-xl border border-primary/10 bg-secondary p-5">
              <h3 className="mb-3 text-xs font-semibold tracking-wider uppercase">
                Tanggapan yang disarankan
              </h3>
              <p className="text-lg leading-9 text-navy">{script.response}</p>
            </section>
            <dl className="mt-7 space-y-6">
              <div>
                <dt className="text-sm font-bold">Penjelasan yang relevan</dt>
                <dd className="mt-2 text-sm leading-8 text-muted-foreground">
                  {script.explanation}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold">Langkah yang tepat</dt>
                <dd className="mt-2 text-sm leading-8 text-muted-foreground">
                  {script.action}
                </dd>
              </div>
              <div className="border-t pt-5">
                <dt className="text-sm font-bold">
                  Yang tidak boleh dijanjikan
                </dt>
                <dd className="mt-2 text-sm leading-8 text-muted-foreground">
                  {script.neverPromise}
                </dd>
              </div>
            </dl>
            {script.references && <SourceLinks ids={script.references} />}
          </div>
        </section>
      </div>
    </div>
  );
}
