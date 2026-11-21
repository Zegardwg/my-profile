import { getDatabase } from "./db";
import {
  backupSchema,
  catalogSignature,
  parseBackup,
  productSchema,
  type CatalogBackup,
} from "./product-schema";
import type { Product } from "@/types/product";

import { readCounter } from "./counter-repository";
import { remainingStock } from "./counter-model";
import { isStarterCard } from "./starter-cards";
import { brandNames } from "@/data/demo-products";

export async function listProducts(): Promise<Product[]> {
  const db = getDatabase();
  return db.transaction(
    "r",
    db.products,
    db.offers,
    db.invoices,
    db.campaigns,
    async () => {
      const records = await db.products.toArray();
      const { offers, invoices } = await readCounter();
      const cards = offers
        .filter((o) => o.verifiedAt && o.price > 0)
        .map((o): Product => ({
          id: "perdana-" + o.brand,
          brand: o.brand,
          name: "Kartu perdana " + brandNames[o.brand],
          price: o.price,
          quotaGb: o.quota,
          validityDays: o.days,
          benefits: o.benefits.split("\n").filter(Boolean),
          restrictions: [],
          usages: ["general"],
          available: remainingStock(o, invoices) > 0,
          category: "Kartu perdana",
          placeholderId: "sim",
          sourceUrl: "",
          lastVerifiedAt: o.verifiedAt!,
          informationStatus: "verified",
          archived: false,
          createdAt: o.updatedAt ?? o.verifiedAt!,
          updatedAt: o.updatedAt ?? o.verifiedAt!,
          revision: o.revision,
        }));
      return [
        ...records.filter(
          (p) => !isStarterCard(p) && !cards.some((c) => c.id === p.id),
        ),
        ...cards,
      ];
    },
  );
}
export function newProduct(): Product {
  const now = new Date().toISOString();
  return {
    id: "local-" + crypto.randomUUID(),
    brand: "xl",
    name: "",
    price: 0,
    quotaGb: 0,
    validityDays: 30,
    category: "Umum",
    benefits: [],
    restrictions: [],
    usages: ["general"],
    available: true,
    placeholderId: "package",
    sourceUrl: "",
    lastVerifiedAt: "",
    informationStatus: "demo",
    archived: false,
    createdAt: now,
    updatedAt: now,
    revision: 1,
  };
}
export async function saveProduct(input: Product, expectedRevision?: number) {
  const parsed = productSchema.parse(input);
  const db = getDatabase();
  return db.transaction("rw", db.products, async () => {
    const existing = await db.products.get(parsed.id);
    if (
      expectedRevision === undefined
        ? Boolean(existing)
        : !existing || existing.revision !== expectedRevision
    )
      throw new Error(
        "Produk berubah di tab lain atau ID sudah digunakan. Tutup editor dan buka kembali data terbaru.",
      );
    if (!existing && (await db.products.count()) >= 2000)
      throw new Error(
        "Batas katalog lokal 2000 produk, termasuk arsip, telah tercapai.",
      );
    const product: Product = {
      ...parsed,
      createdAt: existing?.createdAt ?? parsed.createdAt,
      updatedAt: new Date().toISOString(),
      revision: (existing?.revision ?? 0) + 1,
    };
    await db.products.put(product);
    return product;
  });
}
export async function setArchived(product: Product, archived: boolean) {
  return saveProduct({ ...product, archived }, product.revision);
}
export async function duplicateProduct(id: string) {
  const db = getDatabase();
  return db.transaction("rw", db.products, async () => {
    if ((await db.products.count()) >= 2000)
      throw new Error(
        "Batas katalog lokal 2000 produk, termasuk arsip, telah tercapai.",
      );
    const original = await db.products.get(id);
    if (!original) throw new Error("Produk sumber tidak ditemukan.");
    const product: Product = {
      ...original,
      ...newProduct(),
      brand: original.brand,
      name: original.name.slice(0, 88) + " (salinan)",
      price: original.price,
      quotaGb: original.quotaGb,
      validityDays: original.validityDays,
      category: original.category,
      benefits: original.benefits,
      restrictions: original.restrictions,
      usages: original.usages,
      placeholderId: original.placeholderId,
      sourceUrl: original.sourceUrl,
      available: original.available,
    };
    // Copies always start as demo and unverified; the source's verification is not transferable.
    await db.products.add(productSchema.parse(product));
    return product;
  });
}
export async function exportCatalog() {
  const products = await getDatabase().products.toArray();
  return backupSchema.parse({
    format: "xlsmart-catalog",
    version: 1,
    exportedAt: new Date().toISOString(),
    products,
  });
}
export interface ImportPreview {
  backup: CatalogBackup;
  signature: string;
  conflicts: string[];
  newCount: number;
}
export async function previewImport(raw: string): Promise<ImportPreview> {
  const backup = parseBackup(raw);
  const existing = await getDatabase().products.toArray();
  const ids = new Set(existing.map((product) => product.id));
  const conflicts = backup.products
    .filter((product) => ids.has(product.id))
    .map((product) => product.id);
  return {
    backup,
    signature: catalogSignature(existing),
    conflicts,
    newCount: backup.products.length - conflicts.length,
  };
}
export async function applyImport(
  preview: ImportPreview,
  replaceMatching: boolean,
) {
  const backup = backupSchema.parse(preview.backup);
  const db = getDatabase();
  return db.transaction("rw", db.products, async () => {
    const existing = await db.products.toArray();
    if (catalogSignature(existing) !== preview.signature)
      throw new Error(
        "Katalog berubah setelah pratinjau. Pilih berkas lagi untuk meninjau konflik terbaru.",
      );
    const byId = new Map(existing.map((product) => [product.id, product]));
    if (
      existing.length +
        backup.products.filter((product) => !byId.has(product.id)).length >
      2000
    )
      throw new Error(
        "Impor melebihi batas katalog lokal 2000 produk, termasuk arsip.",
      );
    const now = new Date().toISOString();
    const products = backup.products
      .filter((product) => replaceMatching || !byId.has(product.id))
      .map((product) => ({
        ...product,
        createdAt: byId.get(product.id)?.createdAt ?? product.createdAt,
        updatedAt: now,
        revision: (byId.get(product.id)?.revision ?? 0) + 1,
      }));
    await db.products.bulkPut(products);
    return {
      imported: products.length,
      skipped: backup.products.length - products.length,
    };
  });
}
