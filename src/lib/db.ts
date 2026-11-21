import Dexie, { type Table } from "dexie";
import type { Product } from "@/types/product";
import { demoProducts } from "@/data/demo-products";

import {
  emptyOffer,
  type Offer,
  type Campaign,
  type Invoice,
} from "./counter-model";
import { starterBrands, isStarterCard } from "./starter-cards";
import type { Brand } from "@/types/product";

export const DATABASE_NAME = "xlsmart-local-catalog";
const seedDate = "2026-11-18T00:00:00.000Z";
export class CatalogDatabase extends Dexie {
  products!: Table<Product, string>;
  offers!: Table<Offer, Brand>;
  campaigns!: Table<Campaign, string>;
  invoices!: Table<Invoice, string>;
  constructor() {
    super(DATABASE_NAME);
    this.version(1).stores({ products: "&id,brand,name" });
    // Additive migration: preserve IDs, prices, content and any prior edits.
    this.version(2)
      .stores({ products: "&id,brand,name,informationStatus,updatedAt" })
      .upgrade((transaction) =>
        transaction
          .table("products")
          .toCollection()
          .modify((product) => {
            product.category ??= "Umum";
            product.placeholderId ??= "package";
            product.sourceUrl ??= "";
            product.lastVerifiedAt ??= "";
            product.informationStatus ??= "demo";
            product.archived ??= false;
            product.createdAt ??= seedDate;
            product.updatedAt ??= seedDate;
            product.revision ??= 1;
          }),
      );
    this.version(3)
      .stores({
        offers: "&brand",
        campaigns: "&id",
        invoices: "&id,stage,created",
      })
      .upgrade(async (tx) => {
        const previous: Product[] = await tx.table("products").toArray();
        for (const brand of starterBrands) {
          const product = previous
            .filter(
              (p) =>
                p.brand === brand &&
                !p.archived &&
                p.informationStatus === "verified" &&
                isStarterCard(p),
            )
            .sort(
              (a, b) =>
                Number(b.available) - Number(a.available) ||
                a.price - b.price ||
                a.id.localeCompare(b.id),
            )[0];
          if (product)
            await tx
              .table("offers")
              .put({
                ...emptyOffer(brand),
                price: product.price,
                quota: product.quotaGb,
                days: product.validityDays,
                benefits: product.benefits.join("\n"),
                verifiedAt: product.lastVerifiedAt,
                updatedAt: product.updatedAt,
                revision: 1,
              });
        }
      });
    // IndexedDB's version-change transaction serializes creation across tabs.
    // populate never runs on reload, schema upgrade or an intentionally empty catalog.
    this.on("populate", (transaction) =>
      transaction
        .table("products")
        .bulkAdd(demoProducts.map((product) => ({ ...product }))),
    );
    this.on("blocked", () => {
      console.warn(
        "Tutup tab Sales Kit lain untuk menyelesaikan pembaruan database lokal.",
      );
    });
  }
}
let database: CatalogDatabase | undefined;
export function getDatabase() {
  if (typeof window === "undefined")
    throw new Error("Database katalog hanya tersedia di browser.");
  return (database ??= new CatalogDatabase());
}
