"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import {
  CalendarDays,
  Check,
  Gamepad2,
  GitCompareArrows,
  Globe2,
  MessagesSquare,
  Play,
  BriefcaseBusiness,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/components/compare/comparison-provider";
import { MAX_COMPARISON } from "@/lib/comparison";
import { productInformationLabel } from "@/lib/product-information";
import { ProductMetadata } from "./product-metadata";
import { brandNames } from "@/data/demo-products";
import { SalePrice } from "@/components/shared/sale-price";
import { useReveal } from "@/hooks/use-reveal";
import { ProductVisual } from "./product-visual";
import { ProductDetails } from "./product-details";
import type { Product, Usage } from "@/types/product";

const usageIcons = {
  social: MessagesSquare,
  streaming: Play,
  gaming: Gamepad2,
  work: BriefcaseBusiness,
  general: Globe2,
};
const usageTitles: Record<Usage, string> = {
  social: "Tetap terhubung",
  streaming: "Waktu untuk hiburan",
  gaming: "Teman sesi bermain",
  work: "Ruang untuk produktif",
  general: "Untuk keseharian",
};

export function CatalogProductCard({
  product,
  order = 0,
}: {
  product: Product;
  order?: number;
}) {
  const { ids, toggle } = useComparison();
  const selected = ids.includes(product.id);
  const full = ids.length >= MAX_COMPARISON && !selected;
  const ref = useReveal();
  const usage = product.usages[0] ?? "general";
  const UsageIcon = usageIcons[usage];
  return (
    <article
      ref={ref}
      aria-label={
        product.name +
        (product.informationStatus === "demo"
          ? ", paket demo"
          : ", diperiksa manual")
      }
      className="product-card-entry h-full min-w-0"
      style={{ "--card-order": Math.min(order, 5) } as CSSProperties}
    >
      <Card
        data-brand={product.brand}
        data-selected={selected}
        data-available={product.available}
        className="package-card h-full gap-0 border-0 py-0 text-white ring-0"
      >
        <CardContent className="flex h-full flex-col p-6">
          <p className="package-demo-label">
            {productInformationLabel(product)}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="package-brand">{brandNames[product.brand]}</span>
            <span className="package-validity">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {product.validityDays} hari
            </span>
          </div>
          <div className="relative mt-3">
            <h3 className="package-name pr-14">{product.name}</h3>
            <div className="absolute top-0 right-0">
              <ProductVisual
                brand={product.brand}
                placeholderId={product.placeholderId}
                compact
              />
            </div>
            <p className="package-quota mt-4">
              {product.quotaGb}
              <span className="ml-1.5 text-2xl font-semibold tracking-tight">
                GB
              </span>
            </p>
            <div className="mt-2">
              <p className="package-price">
                <SalePrice
                  price={product.price}
                  originalPrice={product.originalPrice}
                />
              </p>
              <p className="mt-1 text-[11px] text-white/90">
                {product.informationStatus === "demo"
                  ? "Harga ilustrasi per paket"
                  : "Harga catatan lokal; periksa sumber"}
              </p>
            </div>
          </div>
          <div className="my-5 border-t border-white/20" />
          <p className="mb-4 text-[10px] font-semibold tracking-[0.14em] text-white/90 uppercase">
            {product.informationStatus === "demo"
              ? "Kenali paket demo ini"
              : "Kenali informasi paket"}
          </p>
          <ul className="space-y-3">
            <li className="package-benefit">
              <span className="package-benefit-icon">
                <Globe2 aria-hidden="true" className="size-[18px]" />
              </span>
              <div>
                <p className="text-[13px] font-semibold">Kuota utama</p>
                <p className="mt-0.5 text-xs leading-5 text-white/90">
                  {product.benefits[0]}
                </p>
              </div>
            </li>
            <li className="package-benefit">
              <span className="package-benefit-icon">
                <UsageIcon aria-hidden="true" className="size-[18px]" />
              </span>
              <div>
                <p className="text-[13px] font-semibold">
                  {usageTitles[usage]}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-white/90">
                  {product.benefits[1]}
                </p>
              </div>
            </li>
            <li className="package-benefit">
              <span className="package-benefit-icon">
                <CalendarDays aria-hidden="true" className="size-[18px]" />
              </span>
              <div>
                <p className="text-[13px] font-semibold">Masa aktif jelas</p>
                <p className="mt-0.5 text-xs leading-5 text-white/90">
                  {product.validityDays} hari{" "}
                  {product.informationStatus === "demo"
                    ? "dalam simulasi"
                    : "menurut catatan"}
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-auto pt-5">
            <p className="mb-4 flex items-center gap-2 text-xs text-white/90">
              <span
                className={
                  "size-1.5 rounded-full " +
                  (product.available ? "bg-[#7ff0cd]" : "bg-white/60")
                }
                aria-hidden="true"
              />
              {product.available ? "Tersedia" : "Tidak tersedia"}
              {" \u00b7 "}
              {product.informationStatus === "demo" ? "demo" : "catatan lokal"}
            </p>
            <div className="mb-4 text-white/90">
              <ProductMetadata product={product} />
            </div>
            <div className="flex flex-col gap-2.5">
              <ProductDetails product={product} onColor />
              <Button
                variant="secondary"
                className="package-compare-button min-h-12 w-full gap-2 rounded-full bg-white font-semibold hover:bg-white/90"
                aria-pressed={selected}
                aria-label={
                  (selected ? "Hapus " : "Bandingkan ") + product.name
                }
                disabled={full}
                onClick={() => toggle(product.id)}
              >
                {selected ? (
                  <Check
                    key="selected"
                    className="package-selection-icon"
                    aria-hidden="true"
                  />
                ) : (
                  <GitCompareArrows aria-hidden="true" />
                )}
                {selected ? "Dipilih untuk dibandingkan" : "Bandingkan paket"}
              </Button>
            </div>
            {full && (
              <p className="mt-3 text-xs leading-6 text-white/85">
                Maksimal 3 paket.{" "}
                <Link
                  href="/compare"
                  className="inline-flex min-h-11 items-center rounded text-xs font-semibold text-white underline underline-offset-4"
                >
                  Kelola perbandingan
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
