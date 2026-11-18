"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Presentation, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { trustContent, type PresentationSlide } from "@/config/customer-trust";
import { TrustIllustration } from "./trust-illustration";
import { SourceLinks } from "./source-links";

export function PresentationMode({
  slides,
  label = "Mode presentasi pelanggan",
  initialIndex = 0,
}: {
  slides: readonly PresentationSlide[];
  label?: string;
  initialIndex?: number;
}) {
  const [index, setIndex] = useState(
    Math.max(0, Math.min(initialIndex, slides.length - 1)),
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  if (!slides.length) return null;
  const slide = slides[index] ?? slides[0];
  function go(next: number) {
    setIndex(Math.max(0, Math.min(next, slides.length - 1)));
    requestAnimationFrame(() => {
      viewport.current?.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    });
  }
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open)
          setIndex(Math.max(0, Math.min(initialIndex, slides.length - 1)));
      }}
    >
      <DialogTrigger
        render={
          <Button className="min-h-12 max-w-full gap-2 rounded-xl px-5 whitespace-normal" />
        }
      >
        <Presentation aria-hidden="true" />
        {label}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col gap-0 overflow-hidden bg-background animate-none! transition-none!"
        style={{
          top: 0,
          left: 0,
          transform: "none",
          translate: "none",
          width: "100%",
          maxWidth: "none",
          height: "100dvh",
          borderRadius: 0,
          padding: 0,
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            go(index + 1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(index - 1);
          }
        }}
      >
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-4 sm:px-8">
          <div>
            <DialogTitle className="font-heading text-sm font-bold sm:text-base">
              Mode presentasi pelanggan
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs leading-5">
              Sales kit pribadi · bukan layanan resmi operator
            </DialogDescription>
          </div>
          <DialogClose
            render={
              <Button variant="outline" className="min-h-12 rounded-xl" />
            }
          >
            <X aria-hidden="true" />
            Keluar presentasi
          </DialogClose>
        </header>
        <div
          ref={viewport}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="mx-auto grid w-full max-w-6xl items-start gap-7 px-5 py-7 sm:p-10 lg:grid-cols-[1fr_260px] lg:gap-12 lg:p-12">
            <article>
              <p className="eyebrow mb-4 text-primary">
                Penjelasan {index + 1} dari {slides.length}
              </p>
              <h2
                ref={heading}
                tabIndex={-1}
                className="text-2xl leading-tight font-bold sm:text-4xl"
              >
                {slide.title}
              </h2>
              <p className="mt-6 text-lg leading-8 sm:text-2xl sm:leading-10">
                {slide.body}
              </p>
              {slide.detail && (
                <p className="mt-6 border-l-3 border-primary pl-5 text-base leading-8 text-muted-foreground sm:text-lg">
                  {slide.detail}
                </p>
              )}
              {slide.references && <SourceLinks ids={slide.references} />}
            </article>
            <TrustIllustration kind={slide.illustration} />
            <p className="border-t pt-4 text-xs leading-6 text-muted-foreground lg:col-span-2">
              {trustContent.personalDisclaimer} Tidak ada pengambilan data
              pelanggan di sini.
            </p>
          </div>
        </div>
        <footer
          className="flex shrink-0 items-center justify-between gap-2 border-t bg-white px-4 py-4 sm:px-8"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <Button
            variant="outline"
            className="min-h-12 rounded-xl px-3 sm:px-5"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            <ArrowLeft aria-hidden="true" />
            Sebelumnya
          </Button>
          <span
            role="status"
            aria-live="polite"
            className="text-sm font-semibold"
          >
            {index + 1} / {slides.length}
          </span>
          <Button
            className="min-h-12 rounded-xl px-3 sm:px-5"
            disabled={index === slides.length - 1}
            onClick={() => go(index + 1)}
          >
            Berikutnya
            <ArrowRight aria-hidden="true" />
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
