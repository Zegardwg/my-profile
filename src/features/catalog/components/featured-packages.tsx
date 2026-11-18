"use client";

import Link from "next/link";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SectionHeading } from "@/components/shared/section-heading";
import { BrandSelector } from "./brand-selector";
import { CatalogProductCard } from "@/components/catalog/catalog-product-card";
import { ComparisonSummary } from "@/components/compare/comparison-summary";
import { demoProducts } from "@/data/demo-products";
import type { ProductFilters } from "@/types/product";

const filters: ProductFilters["brand"][] = ["all", "xl", "smartfren", "axis"];
const featured = ["xl", "smartfren", "axis"].flatMap((brand) => {
  const product = demoProducts.find(
    (item) => item.brand === brand && item.validityDays >= 28 && item.available,
  );
  return product ? [product] : [];
});
export function FeaturedPackages() {
  return (
    <section
      id="paket"
      aria-labelledby="packages-title"
      className="section-space"
    >
      <SectionHeading
        id="packages-title"
        eyebrow="Satu tempat, banyak pilihan"
        title="Beda kebutuhan. Ada pilihannya."
        description="Mulai dari merek favoritmu, lalu kenali contoh paket yang sesuai."
        action={
          <Link
            href="/catalog"
            className="action-link border bg-white text-primary"
          >
            Lihat 18 paket demo
          </Link>
        }
      />
      <Tabs defaultValue="all" className="gap-6">
        <BrandSelector />
        {filters.map((filter) => (
          <TabsContent key={filter} value={filter}>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featured
                .filter(
                  (product) => filter === "all" || product.brand === filter,
                )
                .map((product, index) => (
                  <CatalogProductCard
                    key={product.id}
                    product={product}
                    order={index}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs leading-6 text-muted-foreground">
          * Seluruh informasi paket bersifat fiktif untuk demonstrasi.
        </p>
        <ComparisonSummary />
      </div>
    </section>
  );
}
