"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ComparisonSummary } from "@/components/compare/comparison-summary";
import { demoProducts, brandNames } from "@/data/demo-products";
import {
  defaultFilters,
  filterProducts,
  sortProducts,
} from "@/lib/product-filters";
import { CatalogProductCard } from "./catalog-product-card";
import { CatalogFilters } from "./catalog-filters";
import type { ProductFilters, ProductSort } from "@/types/product";

const brands: ProductFilters["brand"][] = ["all", "xl", "smartfren", "axis"];
export function CatalogBrowser() {
  const [filters, setFilters] = useState<ProductFilters>({ ...defaultFilters });
  const [sort, setSort] = useState<ProductSort>("price-asc");
  const result = sortProducts(filterProducts(demoProducts, filters), sort);
  const clear = () => {
    setFilters({ ...defaultFilters });
    setSort("price-asc");
  };
  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1 basis-64">
          <label
            htmlFor="catalog-search"
            className="mb-2 block text-sm font-semibold"
          >
            Cari contoh paket
          </label>
          <input
            id="catalog-search"
            type="search"
            value={filters.keyword}
            onChange={(event) =>
              setFilters({ ...filters, keyword: event.target.value })
            }
            placeholder="Nama paket, merek, atau manfaat…"
            className="min-h-12 w-full rounded-xl border bg-white px-4 text-sm"
          />
        </div>
        <ComparisonSummary />
      </div>
      <div className="grid min-w-0 gap-7 xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside
          aria-label="Filter katalog"
          className="hidden self-start rounded-2xl border bg-white p-5 xl:block"
        >
          <h2 className="mb-5 font-heading text-lg font-bold">
            Sesuaikan pilihan
          </h2>
          <CatalogFilters
            value={filters}
            onChange={setFilters}
            onClear={clear}
            prefix="desktop"
          />
        </aside>
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    className="min-h-12 rounded-xl bg-white xl:hidden"
                  />
                }
              >
                <SlidersHorizontal aria-hidden="true" />
                Filter paket
              </SheetTrigger>
              <SheetContent className="w-[min(90vw,24rem)]! overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter paket demo</SheetTitle>
                  <SheetDescription>
                    Perubahan langsung diterapkan pada hasil katalog.
                  </SheetDescription>
                </SheetHeader>
                <div className="px-6 pb-6">
                  <CatalogFilters
                    value={filters}
                    onChange={setFilters}
                    onClear={clear}
                    prefix="drawer"
                  />
                  <SheetClose
                    render={
                      <Button className="mt-4 min-h-12 w-full rounded-xl" />
                    }
                  >
                    Lihat {result.length} hasil
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
            <p role="status" className="py-3 text-sm text-muted-foreground">
              {result.length} dari {demoProducts.length} paket demo
            </p>
            <div>
              <label htmlFor="catalog-sort" className="sr-only">
                Urutkan paket
              </label>
              <select
                id="catalog-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as ProductSort)}
                className="min-h-12 max-w-full rounded-xl border bg-white px-3 text-sm"
              >
                <option value="price-asc">Harga terendah</option>
                <option value="price-desc">Harga tertinggi</option>
                <option value="quota-desc">Kuota terbesar</option>
                <option value="validity-desc">Masa aktif terlama</option>
              </select>
            </div>
          </div>
          <Tabs
            value={filters.brand}
            onValueChange={(brand) =>
              setFilters({
                ...filters,
                brand: brand as ProductFilters["brand"],
              })
            }
            className="gap-6"
          >
            <TabsList
              aria-label="Merek paket"
              className="grid h-auto! w-full! grid-cols-2 gap-2 rounded-2xl border bg-white p-2 sm:grid-cols-4"
            >
              {brands.map((brand) => (
                <TabsTrigger
                  key={brand}
                  value={brand}
                  className="min-h-12 rounded-xl px-2 data-active:bg-primary data-active:text-white"
                >
                  {brand === "all" ? "Semua" : brandNames[brand]}
                </TabsTrigger>
              ))}
            </TabsList>
            {brands.map((brand) => (
              <TabsContent key={brand} value={brand}>
                {result.length ? (
                  <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                    {result.map((product, index) => (
                      <CatalogProductCard
                        key={product.id}
                        product={product}
                        order={index}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Belum ada paket yang sesuai"
                    description="Tidak ada contoh yang memenuhi seluruh filter. Hapus pencarian atau sesuaikan harga, kuota, masa aktif, dan ketersediaan."
                    action={
                      <Button className="min-h-12 rounded-xl" onClick={clear}>
                        Bersihkan filter
                      </Button>
                    }
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
