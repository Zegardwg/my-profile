"use client";
import { useSyncExternalStore } from "react";
import { catalogMetadata } from "@/config/catalog-metadata";
import { catalogFreshness } from "@/lib/catalog-freshness";
function today() { return new Date().toISOString().slice(0, 10); }
function subscribe(callback: () => void) {
  const interval = window.setInterval(callback, 60000);
  window.addEventListener("focus", callback);
  return () => { window.clearInterval(interval); window.removeEventListener("focus", callback); };
}
function serverDay() { return catalogMetadata.updatedAt; }
export function CatalogFreshness() {
  const day = useSyncExternalStore(subscribe, today, serverDay);
  const freshness = catalogFreshness(catalogMetadata.updatedAt, day, catalogMetadata.staleAfterDays);
  return <aside aria-label="Tanggal informasi katalog" className="mb-5 rounded-xl border bg-white px-4 py-3 text-xs leading-6 text-muted-foreground"><p>Data demo diperbarui: <time dateTime={catalogMetadata.updatedAt} className="font-semibold text-navy">{catalogMetadata.updatedLabel}</time> · bukan pemeriksaan penawaran operator secara langsung.</p>{freshness.stale && <p role="status" className="mt-1 font-medium text-[#934b0c]">{freshness.ageDays === null ? "Tanggal perangkat perlu diperiksa." : "Informasi katalog lebih dari 30 hari; mungkin sudah tidak mutakhir."} Sambungkan internet untuk memeriksa pembaruan. Semua harga tetap ilustrasi.</p>}</aside>;
}
