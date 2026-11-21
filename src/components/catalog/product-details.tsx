"use client";
import { ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  productInformationLabel,
  verifiedDescription,
} from "@/lib/product-information";
import { ProductMetadata } from "./product-metadata";
import { ProductVisual } from "./product-visual";
import { brandNames } from "@/data/demo-products";
import { formatPrice } from "@/lib/product-presentation";
import type { Product } from "@/types/product";

export function ProductDetails({
  product,
  onColor = false,
}: {
  product: Product;
  onColor?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className={
              onColor
                ? "package-details-button min-h-12 w-full justify-between rounded-2xl border-white/25 bg-white/10 px-4 text-white hover:bg-white/20 hover:text-white"
                : "min-h-12 flex-1 rounded-xl"
            }
            aria-label={"Detail " + product.name}
          />
        }
      >
        Detail paket <ChevronRight aria-hidden="true" className="size-4" />
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <p className="pr-8 text-[11px] font-bold text-primary">
            {productInformationLabel(product)}
          </p>
          <DialogTitle className="text-2xl leading-tight font-bold">
            {product.name}
          </DialogTitle>
          <DialogDescription>
            {brandNames[product.brand]} - {verifiedDescription(product)}
          </DialogDescription>
        </DialogHeader>
        <ProductVisual
          brand={product.brand}
          placeholderId={product.placeholderId}
        />
        <ProductMetadata product={product} />
        <p className="text-xs text-muted-foreground">
          Kategori: {product.category}
        </p>
        {product.sourceUrl && (
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center break-all rounded text-sm font-semibold text-primary underline"
          >
            Buka sumber informasi (tab baru)
          </a>
        )}
        <dl className="grid grid-cols-2 gap-4 rounded-xl bg-secondary p-4">
          <div>
            <dt className="text-xs text-muted-foreground">Harga paket</dt>
            <dd className="mt-1 font-bold">{formatPrice(product.price)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Kuota utama</dt>
            <dd className="mt-1 font-bold">{product.quotaGb} GB</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Masa aktif</dt>
            <dd className="mt-1 font-bold">{product.validityDays} hari</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ketersediaan</dt>
            <dd className="mt-1 font-bold">
              {product.available ? "Tersedia" : "Tidak tersedia"}
            </dd>
          </div>
        </dl>
        <section>
          <h3 className="mb-2 font-semibold">Manfaat paket</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {product.benefits.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="mb-2 font-semibold">Batasan paket</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            {product.restrictions.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>

        <p className="border-t pt-4 text-xs leading-6 text-muted-foreground">
          Pembayaran diterima oleh promotor. Registrasi dilakukan di kanal resmi.
          Konfirmasi penawaran nyata melalui kanal resmi operator.
        </p>
      </DialogContent>
    </Dialog>
  );
}

