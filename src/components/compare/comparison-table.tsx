"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { CatalogProductCard } from "@/components/catalog/catalog-product-card";
import { demoProducts, DEMO_LABEL, brandNames } from "@/data/demo-products";
import { formatPrice } from "@/lib/product-presentation";
import type { Product } from "@/types/product";
import { useComparison } from "./comparison-provider";

export function ComparisonTable() {
  const { ids, toggle, clear } = useComparison();
  const products = ids.flatMap((id) => {
    const product = demoProducts.find((item) => item.id === id);
    return product ? [product] : [];
  });
  const rows: { label: string; content: (product: Product) => ReactNode }[] = [
    { label: "Merek", content: (product) => brandNames[product.brand] },
    {
      label: "Harga demo / paket",
      content: (product) => formatPrice(product.price),
    },
    { label: "Kuota utama", content: (product) => product.quotaGb + " GB" },
    {
      label: "Masa aktif",
      content: (product) => product.validityDays + " hari",
    },
    {
      label: "Manfaat ilustrasi",
      content: (product) => (
        <ul className="space-y-2">
          {product.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      ),
    },
    {
      label: "Batasan",
      content: (product) => (
        <ul className="space-y-2">
          {product.restrictions.map((restriction) => (
            <li key={restriction}>{restriction}</li>
          ))}
        </ul>
      ),
    },
    {
      label: "Ketersediaan demo",
      content: (product) =>
        product.available ? "Tersedia (demo)" : "Tidak tersedia (demo)",
    },
  ];
  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/catalog"
          className="action-link border bg-white text-primary"
        >
          Kembali ke katalog
        </Link>
        <p role="status" className="text-sm text-muted-foreground">
          {ids.length}/3 paket dipilih
        </p>
        <Button
          variant="outline"
          disabled={!ids.length}
          className="min-h-12 rounded-xl"
          onClick={clear}
        >
          Bersihkan perbandingan
        </Button>
      </div>
      <p className="mb-5 text-xs leading-6 text-muted-foreground">
        Hanya ID paket disimpan di perangkat hingga kamu menghapusnya. Tanpa data pelanggan. Pada layar kecil, geser tabel secara
        horizontal.
      </p>
      {!products.length ? (
        <EmptyState
          title="Belum ada paket untuk dibandingkan"
          description="Pilih tombol Bandingkan pada katalog atau hasil finder. Maksimal tiga paket dapat dipilih, termasuk paket yang tidak tersedia untuk kebutuhan presentasi."
          action={
            <Link href="/catalog" className="action-link bg-primary text-white">
              Pilih paket demo
            </Link>
          }
        />
      ) : (
        <>
          <div
            role="region"
            aria-label="Tabel perbandingan paket, dapat digeser horizontal"
            tabIndex={0}
            className="max-w-full overflow-x-auto rounded-2xl border bg-white"
          >
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Perbandingan maksimal tiga paket fiktif, bukan penawaran resmi.
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="min-w-40 border-b bg-secondary p-5 align-top"
                  >
                    Atribut demo
                  </th>
                  {products.map((product) => (
                    <th
                      key={product.id}
                      scope="col"
                      className="min-w-60 max-w-80 border-b p-5 align-top"
                    >
                      <p className="mb-3 text-[10px] leading-5 font-semibold text-primary">
                        {DEMO_LABEL}
                      </p>
                      <p className="font-heading text-lg font-bold">
                        {product.name}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 min-h-11 rounded-xl"
                        aria-label={
                          "Hapus " + product.name + " dari perbandingan"
                        }
                        onClick={() => toggle(product.id)}
                      >
                        Hapus paket
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="even:bg-background/70">
                    <th
                      scope="row"
                      className="border-b p-5 align-top font-semibold"
                    >
                      {row.label}
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className="border-b p-5 align-top text-sm leading-7 text-muted-foreground"
                      >
                        {row.content(product)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className="mt-7 rounded-xl border bg-white p-5">
            <summary className="min-h-11 cursor-pointer font-semibold">
              Lihat kartu dan detail paket terpilih
            </summary>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          </details>
        </>
      )}
    </div>
  );
}
