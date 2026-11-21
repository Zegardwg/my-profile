"use client";
import { useSyncExternalStore } from "react";
import { catalogMetadata } from "@/config/catalog-metadata";
import { catalogFreshness } from "@/lib/catalog-freshness";
import { useCatalog } from "@/components/products/catalog-provider";
function today() {
  return new Date().toISOString().slice(0, 10);
}
function subscribe(callback: () => void) {
  const interval = window.setInterval(callback, 60000);
  window.addEventListener("focus", callback);
  return () => {
    window.clearInterval(interval);
    window.removeEventListener("focus", callback);
  };
}
function serverDay() {
  return catalogMetadata.updatedAt;
}
export function CatalogFreshness() {
  const day = useSyncExternalStore(subscribe, today, serverDay);
  const { activeProducts: products, loading } = useCatalog();
  if (loading) return null;
  const updated = products.reduce(
    (date, product) => (product.updatedAt > date ? product.updatedAt : date),
    "",
  );
  const stale = products.some(
    (product) =>
      catalogFreshness(
        product.lastVerifiedAt || product.updatedAt.slice(0, 10),
        day,
        catalogMetadata.staleAfterDays,
      ).stale,
  );
  return (
    <aside
      aria-label="Tanggal informasi katalog"
      className="mb-5 rounded-xl border bg-white px-4 py-3 text-xs leading-6 text-muted-foreground"
    >
      <p>
        Katalog lokal diperbarui:{" "}
        {updated ? (
          <time dateTime={updated} className="font-semibold text-navy">
            {updated.slice(0, 10)}
          </time>
        ) : (
          "Belum ada produk aktif"
        )}{" "}
        · bukan pemeriksaan penawaran operator secara langsung.
      </p>
      {stale && (
        <p role="status" className="mt-1 font-medium text-[#934b0c]">
          Informasi katalog lebih dari 30 hari atau tanggal perangkat perlu
          diperiksa; sebagian data mungkin sudah tidak mutakhir. Periksa sumber
          saat online dan perbarui catatan secara manual. Data demo tetap
          ilustrasi.
        </p>
      )}
    </aside>
  );
}
