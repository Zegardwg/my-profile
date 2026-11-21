"use client";
import { useState, useSyncExternalStore } from "react";
import { Check, Gift, ArrowUpRight, ArrowRight } from "lucide-react";
import { useCounter } from "@/hooks/use-counter";
import { brandNames } from "@/data/demo-products";
import {
  remainingStock,
  remainingClaims,
  offerHighlights,
} from "@/lib/counter-model";
import { SalePrice } from "@/components/shared/sale-price";
import Image from "next/image";
import Link from "next/link";
import {
  SaleDialog,
  ReceiptDialog,
} from "@/features/home/components/promo-checkout";
import type { Brand } from "@/types/product";

function subscribeReceipt(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
function receiptId() {
  return /^#invoice=([0-9a-f-]{36})$/i.exec(window.location.hash)?.[1] ?? "";
}
function setReceipt(id: string) {
  const url = new URL(window.location.href);
  url.hash = id ? "invoice=" + id : "";
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event("hashchange"));
}
export function FeaturedPackages() {
  const counter = useCounter(),
    [selection, select] = useState<{ brand: Brand; free: boolean } | null>(
      null,
    );
  const receipt = useSyncExternalStore(subscribeReceipt, receiptId, () => "");
  const data = counter?.data;
  const highlights = data && offerHighlights(data.offers, data.invoices);
  const latest = data?.recent[0];
  const axisStock = data
    ? remainingStock(
        data.offers.find((o) => o.brand === "axis")!,
        data.invoices,
      )
    : 0;
  return (
    <section aria-labelledby="starter-title" id="perdana">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4 sm:mb-9">
        <div>
          <h1
            id="starter-title"
            className="font-heading text-4xl font-semibold tracking-tight text-navy sm:text-5xl"
          >
            Pilih kartu perdana.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Lihat isi kartu, lalu pilih pembayaran QRIS atau tunai.
          </p>
        </div>
        <Link
          href="/promoter"
          className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/60 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-navy hover:bg-blue-100"
        >
          <Image
            src="/images/promotor.webp"
            alt=""
            width={48}
            height={48}
            unoptimized
            className="size-12 rounded-full object-cover object-top"
          />
          Profil promotor <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </header>
      {!counter && (
        <div
          aria-label="Memuat penawaran"
          className="grid gap-4 min-[720px]:grid-cols-3"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 animate-pulse rounded-3xl bg-secondary"
            />
          ))}
        </div>
      )}
      {counter?.error && <p role="alert">{counter.error}</p>}
      {data && (
        <>
          <div className="starter-grid grid gap-5 min-[720px]:grid-cols-3 lg:gap-6">
            {data.offers.map((stored) => {
              const o = stored.verifiedAt
                ? stored
                : { ...stored, price: 0, quota: 0, days: 0, benefits: "" };
              const stock = remainingStock(o, data.invoices);
              const bonus =
                o.brand !== "axis" &&
                data.campaign.bonus &&
                axisStock > 0 &&
                stock > 0 &&
                o.price > 0;
              const benefits = o.benefits
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .slice(0, 2);
              return (
                <article
                  key={o.brand}
                  aria-label={"Kartu perdana " + brandNames[o.brand]}
                  className="starter-card"
                  data-brand={o.brand}
                >
                  <div className="starter-face">
                    <div aria-hidden="true" className="starter-engraving">
                      {Array.from({ length: 8 }, (_, i) => (
                        <i key={i} />
                      ))}
                    </div>
                    <span className="relative text-[11px] font-semibold tracking-[.12em] uppercase">
                      Kartu perdana
                    </span>
                    <h2 className="starter-wordmark">{brandNames[o.brand]}</h2>
                    <span aria-hidden="true" className="starter-chip" />
                  </div>
                  <div className="starter-body">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <p className="text-xs font-medium text-slate-600">
                        Harga per kartu
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <span
                          aria-hidden="true"
                          className={
                            stock > 0
                              ? "size-1.5 rounded-full bg-emerald-600"
                              : "size-1.5 rounded-full bg-slate-400"
                          }
                        />
                        {stock > 0 ? "Tersedia" : "Stok belum tersedia"}
                      </p>
                    </div>
                    <div className="starter-price-block mt-1.5">
                      {o.price ? (
                        <p className="starter-price">
                          <SalePrice
                            price={o.price}
                            originalPrice={o.originalPrice}
                          />
                        </p>
                      ) : (
                        <p className="text-lg font-semibold text-slate-700">
                          Harga belum diatur
                        </p>
                      )}
                    </div>
                    {(o.quota > 0 || o.days > 0) && (
                      <dl className="starter-specs">
                        {o.quota > 0 && (
                          <div>
                            <dt>Kuota utama</dt>
                            <dd>
                              {o.quota.toLocaleString("id-ID")} <span>GB</span>
                            </dd>
                          </div>
                        )}
                        {o.days > 0 && (
                          <div>
                            <dt>Masa aktif</dt>
                            <dd>
                              {o.days} <span>hari</span>
                            </dd>
                          </div>
                        )}
                      </dl>
                    )}
                    {!!highlights?.[o.brand].length && (
                      <p className="starter-highlight">
                        <strong>{highlights[o.brand].join(" · ")}</strong> di
                        antara kartu yang tersedia.
                      </p>
                    )}
                    {(benefits.length > 0 || bonus) && (
                      <ul className="mt-4 grid gap-2 text-sm leading-5 text-slate-700">
                        {benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check
                              size={15}
                              className="mt-0.5 shrink-0"
                              aria-hidden="true"
                            />
                            {benefit}
                          </li>
                        ))}
                        {bonus && (
                          <li className="flex items-start gap-2 font-semibold">
                            <Gift
                              size={16}
                              className="mt-0.5 shrink-0"
                              aria-hidden="true"
                            />
                            Bonus 1 kartu AXIS dengan XLSMART
                          </li>
                        )}
                      </ul>
                    )}
                    <div className="mt-auto pt-5">
                      <button
                        className="starter-action"
                        onClick={() => select({ brand: o.brand, free: false })}
                      >
                        {stock > 0 && o.price ? "Pilih & bayar" : "Lihat kartu"}
                        <ArrowRight size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-6">
            {data.campaign.free &&
              axisStock > 0 &&
              remainingClaims(data.campaign, data.invoices) > 0 && (
                <button
                  className="inline-flex min-h-12 items-center gap-2 font-semibold text-axis underline underline-offset-4"
                  onClick={() => select({ brand: "axis", free: true })}
                >
                  <Gift size={18} />
                  Punya kode kartu gratis?
                </button>
              )}
            {latest && (
              <button
                className="min-h-12 text-sm font-semibold text-primary"
                onClick={() => setReceipt(latest.id)}
              >
                Buka invoice terakhir
              </button>
            )}
          </div>
          {selection && (
            <SaleDialog
              key={selection.brand + selection.free}
              {...selection}
              data={data}
              onClose={() => select(null)}
              onInvoice={(id) => {
                select(null);
                setReceipt(id);
              }}
            />
          )}
          {receipt && (
            <ReceiptDialog id={receipt} onClose={() => setReceipt("")} />
          )}
        </>
      )}
    </section>
  );
}
