"use client";
import { useState, useSyncExternalStore } from "react";
import { BadgeCheck, Gift, CardSim, ArrowUpRight, Wallet } from "lucide-react";
import { useCounter } from "@/hooks/use-counter";
import { brandNames } from "@/data/demo-products";
import { remainingStock, remainingClaims } from "@/lib/counter-model";
import { formatPrice } from "@/lib/product-presentation";
import {
  SaleDialog,
  ReceiptDialog,
} from "@/features/home/components/promo-checkout";
import type { Brand } from "@/types/product";

const surfaces = {
  xl: "from-[#184bea] to-[#08248a]",
  smartfren: "from-[#ba1958] to-[#79113c]",
  axis: "from-[#7e3bc6] to-[#45217e]",
};
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
  const latest = data?.recent[0];
  const axisStock = data
    ? remainingStock(
        data.offers.find((o) => o.brand === "axis")!,
        data.invoices,
      )
    : 0;
  return (
    <section aria-labelledby="starter-title" id="perdana">
      <header className="mb-7 sm:mb-9">
        <h1
          id="starter-title"
          className="font-heading text-4xl font-semibold tracking-tight text-navy sm:text-5xl"
        >
          Pilih kartu perdana.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Lihat isi kartu, lalu pilih pembayaran QRIS atau tunai.
        </p>
      </header>
      {!counter && (
        <div
          aria-label="Memuat penawaran"
          className="grid gap-4 sm:grid-cols-3"
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
          <div className="grid gap-4 sm:grid-cols-3 lg:gap-6">
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
              return (
                <article
                  key={o.brand}
                  aria-label={"Kartu perdana " + brandNames[o.brand]}
                  className={
                    "relative flex min-w-0 flex-col rounded-[1.6rem] bg-linear-to-br p-5 text-white lg:p-7 " +
                    surfaces[o.brand]
                  }
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">
                      {brandNames[o.brand]}
                    </h2>
                    {o.days > 0 && (
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                        {o.days} hari
                      </span>
                    )}
                  </div>
                  <div className="mt-4 min-h-24">
                    {o.quota > 0 ? (
                      <>
                        <p className="text-5xl font-bold tracking-tight">
                          {o.quota.toLocaleString("id-ID")}
                          <span className="ml-1 text-2xl">GB</span>
                        </p>
                        <p className="mt-2 text-xl font-bold">
                          {o.price
                            ? formatPrice(o.price)
                            : "Harga belum diatur"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="break-words text-3xl font-bold tracking-tight lg:text-4xl">
                          {o.price ? formatPrice(o.price) : "Kartu perdana"}
                        </p>
                        <p className="mt-2 text-sm">
                          {o.price ? "Harga per kartu" : "Harga belum diatur"}
                        </p>
                      </>
                    )}
                  </div>
                  <ul className="mb-6 grid gap-3 border-t border-white/30 pt-4 text-sm">
                    <li className="flex gap-2">
                      <CardSim size={18} aria-hidden="true" />1 kartu SIM fisik
                    </li>
                    <li className="flex gap-2">
                      <Wallet size={18} aria-hidden="true" />
                      QRIS atau tunai
                    </li>
                    {o.benefits
                      .split("\n")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((b, i) => (
                        <li key={i} className="flex gap-2 break-words">
                          <BadgeCheck
                            size={18}
                            className="shrink-0"
                            aria-hidden="true"
                          />
                          {b}
                        </li>
                      ))}
                    {bonus && (
                      <li className="flex gap-2">
                        <Gift size={18} aria-hidden="true" />
                        Bonus 1 kartu AXIS dengan XLSMART
                      </li>
                    )}
                  </ul>
                  <div className="mt-auto">
                    <p className="mb-3 text-sm text-white/90">
                      {stock > 0 ? "Tersedia" : "Stok belum tersedia"}
                    </p>
                    <button
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-3 font-semibold text-navy after:absolute after:inset-0 after:rounded-[1.6rem] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2"
                      onClick={() => select({ brand: o.brand, free: false })}
                    >
                      {stock > 0 && o.price ? "Pilih & bayar" : "Lihat kartu"}
                      <ArrowUpRight size={17} />
                    </button>
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
