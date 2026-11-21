import { z } from "zod";
import type { Product } from "../types/product";

export function localVerificationDay(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return [year, month, day].join("-");
}

const date = z.union([
  z.literal(""),
  z.iso.date({ error: "Tanggal harus valid (YYYY-MM-DD)." }),
]);
const textList = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Baris tidak boleh kosong.")
      .max(300, "Maksimal 300 karakter per baris."),
  )
  .min(1, "Isi minimal satu baris.")
  .max(20, "Maksimal 20 baris.");
export const productSchema = z
  .strictObject({
    id: z
      .string()
      .regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/, "ID produk tidak valid."),
    brand: z.enum(["xl", "smartfren", "axis"], {
      error: "Pilih merek yang tersedia.",
    }),
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter.")
      .max(100, "Nama maksimal 100 karakter."),
    price: z
      .number({ error: "Isi harga berupa angka." })
      .int("Harga harus berupa Rupiah bulat.")
      .min(0, "Harga tidak boleh negatif.")
      .max(100000000, "Harga maksimal Rp100.000.000."),
    originalPrice: z.number().int().positive().max(100000000).optional(),
    quotaGb: z
      .number({ error: "Isi kuota berupa angka." })
      .min(0, "Kuota tidak boleh negatif.")
      .max(100000, "Kuota terlalu besar."),
    validityDays: z
      .number({ error: "Isi masa aktif berupa angka." })
      .int("Masa aktif harus bulat.")
      .min(1, "Masa aktif harus lebih dari 0 hari.")
      .max(3650, "Masa aktif maksimal 3650 hari."),
    category: z
      .string()
      .trim()
      .min(1, "Isi kategori paket.")
      .max(80, "Kategori maksimal 80 karakter."),
    benefits: textList,
    restrictions: textList,
    usages: z
      .array(z.enum(["social", "streaming", "gaming", "work", "general"]))
      .min(1, "Pilih penggunaan.")
      .max(5),
    available: z.boolean(),
    placeholderId: z.enum(["package", "sim", "banner", "promotion"]),
    sourceUrl: z.union([
      z.literal(""),
      z
        .url({ protocol: /^https$/, error: "Gunakan URL HTTPS yang valid." })
        .max(1000)
        .refine((value) => {
          try {
            const url = new URL(value);
            return !url.username && !url.password;
          } catch {
            return false;
          }
        }, "URL sumber tidak boleh memuat kredensial."),
    ]),
    lastVerifiedAt: date,
    informationStatus: z.enum(["demo", "verified"]),
    archived: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    revision: z.number().int().min(1),
  })
  .superRefine((product, context) => {
    if (
      product.originalPrice !== undefined &&
      product.originalPrice <= product.price
    )
      context.addIssue({
        code: "custom",
        path: ["originalPrice"],
        message: "Harga normal harus lebih tinggi dari harga jual.",
      });
    if (product.informationStatus === "verified") {
      if (!product.lastVerifiedAt)
        context.addIssue({
          code: "custom",
          path: ["lastVerifiedAt"],
          message: "Isi tanggal pemeriksaan sumber.",
        });
    }
    if (
      product.lastVerifiedAt &&
      product.lastVerifiedAt > localVerificationDay()
    )
      context.addIssue({
        code: "custom",
        path: ["lastVerifiedAt"],
        message: "Tanggal verifikasi tidak boleh di masa depan.",
      });
  });
export const backupSchema = z
  .strictObject({
    format: z.literal("xlsmart-catalog"),
    version: z.literal(1),
    exportedAt: z.iso.datetime(),
    products: z
      .array(productSchema)
      .max(2000, "Maksimal 2000 produk per berkas."),
  })
  .superRefine((backup, context) => {
    const seen = new Set<string>();
    backup.products.forEach((product, index) => {
      if (seen.has(product.id))
        context.addIssue({
          code: "custom",
          path: ["products", index, "id"],
          message: "ID duplikat dalam berkas: " + product.id,
        });
      seen.add(product.id);
    });
  });
export type CatalogBackup = z.infer<typeof backupSchema>;
// Allow a full catalog of 2,000 products, including JSON escaping of text fields.
export function checkBackupSize(bytes: number) {
  if (bytes > 192 * 1024 * 1024)
    throw new Error("Berkas melebihi batas 192 MB.");
}
export function parseBackup(raw: string): CatalogBackup {
  let input: unknown;
  try {
    input = JSON.parse(raw.replace(/^\uFEFF/, ""));
  } catch {
    throw new Error("JSON tidak valid. Pilih cadangan katalog XLSMART.");
  }
  const result = backupSchema.safeParse(input, {
    error: z.locales.id().localeError,
  });
  if (!result.success)
    throw new Error(
      "Cadangan tidak valid: " +
        result.error.issues
          .slice(0, 3)
          .map((issue) => issue.path.join(".") + ": " + issue.message)
          .join("; "),
    );
  return result.data;
}
export function catalogSignature(products: readonly Product[]) {
  return JSON.stringify(
    products
      .map((p) => [p.id, p.revision, p.updatedAt])
      .sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
  );
}
