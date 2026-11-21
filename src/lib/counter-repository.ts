import { localVerificationDay } from "./product-schema";
import { getDatabase } from "./db";
import {
  emptyOffer,
  initialCampaign,
  isOpen,
  offerSchema,
  quote,
  remainingClaims,
  remainingStock,
  validCode,
  type Campaign,
  type Invoice,
  type Method,
  type Offer,
} from "./counter-model";
import { starterBrands } from "./starter-cards";
import type { Brand } from "@/types/product";

export async function readCounter() {
  const db = getDatabase();
  return db.transaction("r", db.offers, db.campaigns, db.invoices, async () => {
    const rows = await db.offers.toArray();
    const invoices = await db.invoices
      .where("stage")
      .anyOf("pending", "paid")
      .toArray();
    const recent = await db.invoices
      .orderBy("created")
      .reverse()
      .limit(15)
      .toArray();
    return {
      recent,
      offers: starterBrands.map(
        (b) => rows.find((r) => r.brand === b) ?? emptyOffer(b),
      ),
      campaign: (await db.campaigns.get("axis")) ?? initialCampaign,
      invoices,
    };
  });
}

export async function saveOffer(input: Offer) {
  const o = offerSchema.parse(input),
    db = getDatabase();
  if (o.verifiedAt && o.verifiedAt > localVerificationDay())
    throw Error("Tanggal pemeriksaan tidak boleh di masa depan.");
  await db.transaction("rw", db.offers, db.invoices, async () => {
    const prior = await db.offers.get(o.brand);
    if ((prior?.revision ?? 0) !== o.revision)
      throw Error("Stok atau penawaran berubah. Muat ulang nilai terbaru.");
    const open = await db.invoices
      .where("stage")
      .anyOf("pending", "paid")
      .toArray();
    if (remainingStock(o, open) < 0)
      throw Error("Sebagian stok sudah dialokasikan untuk invoice terbuka.");
    await db.offers.put({
      ...o,
      updatedAt: new Date().toISOString(),
      revision: o.revision + 1,
    });
  });
}

export async function saveCampaign(
  input: Pick<Campaign, "bonus" | "free" | "limit" | "revision">,
) {
  if (
    !Number.isSafeInteger(input.limit) ||
    input.limit < 0 ||
    input.limit > 100000 ||
    (input.free && !input.limit)
  )
    throw Error("Isi jatah sesi gratis dengan bilangan bulat positif.");
  const db = getDatabase();
  await db.transaction("rw", db.campaigns, db.invoices, async () => {
    const prior = (await db.campaigns.get("axis")) ?? initialCampaign;
    if (input.revision !== prior.revision)
      throw Error("Pengaturan promo berubah. Buka kembali pengaturan.");
    const fresh = input.free && !prior.free;
    const next = {
      ...prior,
      ...input,
      session: fresh ? crypto.randomUUID() : prior.session,
      used: fresh ? 0 : prior.used,
      revision: prior.revision + 1,
    };
    const open = await db.invoices
      .where("stage")
      .anyOf("pending", "paid")
      .toArray();
    if (input.free && remainingClaims(next, open) < 0)
      throw Error("Jatah lebih kecil dari jumlah klaim sesi ini.");
    await db.campaigns.put(next);
  });
}

export async function checkout(input: {
  id: string;
  brand: Brand;
  price: number;
  method: Method;
  code: string;
  session: string;
}) {
  const db = getDatabase();
  return db.transaction(
    "rw",
    db.offers,
    db.campaigns,
    db.invoices,
    async () => {
      const existing = await db.invoices.get(input.id);
      if (existing) return existing;
      const offer = await db.offers.get(input.brand),
        axis = (await db.offers.get("axis")) ?? emptyOffer("axis");
      const c = (await db.campaigns.get("axis")) ?? initialCampaign;
      const open = await db.invoices
        .where("stage")
        .anyOf("pending", "paid")
        .toArray();
      const free = input.method === "free",
        redeem = validCode(input.code);
      if (input.code && !redeem) throw Error("Kode tidak dikenali.");
      if (
        free &&
        (input.brand !== "axis" ||
          !redeem ||
          !c.free ||
          c.session !== input.session ||
          remainingClaims(c, open) < 1)
      )
        throw Error("Klaim tidak tersedia untuk sesi ini.");
      if (
        !free &&
        (!offer ||
          !offer.verifiedAt ||
          !offer.price ||
          offer.price !== input.price)
      )
        throw Error("Harga berubah. Periksa total terbaru.");
      if (!free && redeem && (!c.bonus || input.brand === "axis"))
        throw Error("Bonus tidak tersedia untuk penawaran ini.");
      const lines = quote(input.brand, offer?.price ?? 0, free, redeem);
      for (const line of lines) {
        if (remainingStock(line.brand === "axis" ? axis : offer!, open) < 1)
          throw Error("Stok kartu yang dipilih sudah habis.");
      }
      const invoice: Invoice = {
        id: input.id,
        created: new Date().toISOString(),
        lines,
        total: lines.reduce((n, l) => n + l.price, 0),
        method: input.method,
        code: redeem ? "XLSMART" : "",
        session: free ? c.session : "",
        stage: "pending",
      };
      await db.invoices.add(invoice);
      return invoice;
    },
  );
}

export async function updateInvoice(
  id: string,
  action: "pay" | "handover" | "cancel",
  amount?: number,
) {
  const db = getDatabase();
  await db.transaction("rw", db.invoices, db.offers, db.campaigns, async () => {
    const i = await db.invoices.get(id);
    if (!i) throw Error("Invoice tidak ditemukan.");
    if (action === "cancel") {
      if (i.stage === "cancelled") return;
      if (i.stage !== "pending")
        throw Error(
          "Hanya invoice yang belum diselesaikan yang bisa dibatalkan.",
        );
      await db.invoices.update(id, { stage: "cancelled" });
      return;
    }
    if (action === "pay") {
      if (i.stage === "paid" || i.stage === "handed") return;
      if (!isOpen(i) || i.method === "free")
        throw Error("Invoice ini tidak memerlukan konfirmasi pembayaran.");
      if (
        i.method === "cash" &&
        (!Number.isSafeInteger(amount) || amount! < i.total)
      )
        throw Error("Nominal tunai belum mencukupi.");
      await db.invoices.update(id, {
        stage: "paid",
        received: i.method === "cash" ? amount : i.total,
      });
      return;
    }
    if (i.stage === "handed") return;
    if (i.stage !== "paid" && !(i.method === "free" && i.stage === "pending"))
      throw Error("Periksa status pembayaran sebelum menyerahkan kartu.");
    for (const line of i.lines) {
      const offer = await db.offers.get(line.brand);
      if (!offer || offer.stock < 1) throw Error("Stok fisik tidak mencukupi.");
      await db.offers.update(line.brand, {
        stock: offer.stock - 1,
        updatedAt: new Date().toISOString(),
        revision: offer.revision + 1,
      });
    }
    if (i.method === "free") {
      const c = await db.campaigns.get("axis");
      if (c && c.session === i.session)
        await db.campaigns.update("axis", {
          used: c.used + 1,
          revision: c.revision + 1,
        });
    }
    await db.invoices.update(id, {
      stage: "handed",
      handedAt: new Date().toISOString(),
    });
  });
}
