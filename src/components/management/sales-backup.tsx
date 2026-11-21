"use client";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { offerSchema, type Offer } from "@/lib/counter-model";
import { getDatabase } from "@/lib/db";
import { saveOffer } from "@/lib/counter-repository";
import { brandNames } from "@/data/demo-products";
import { formatPrice } from "@/lib/product-presentation";
const schema = z
  .object({
    format: z.literal("xlsmart-perdana"),
    version: z.literal(1),
    exportedAt: z.iso.datetime(),
    offers: z.array(offerSchema).length(3),
  })
  .refine((b) => new Set(b.offers.map((o) => o.brand)).size === 3);
export function SalesBackup({ offers }: { offers: Offer[] }) {
  const [preview, setPreview] = useState<{
      rows: Offer[];
      date: string;
    } | null>(null),
    [message, show] = useState("");
  function download() {
    const date = new Date().toISOString(),
      url = URL.createObjectURL(
        new Blob(
          [
            JSON.stringify(
              {
                format: "xlsmart-perdana",
                version: 1,
                exportedAt: date,
                offers,
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
      );
    const a = document.createElement("a");
    a.href = url;
    a.download = "perdana-" + date.slice(0, 10) + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    show("Berkas cadangan tiga kartu siap disimpan.");
  }
  async function replace() {
    if (!preview) return;
    try {
      const db = getDatabase();
      await db.transaction("rw", db.offers, db.invoices, async () => {
        if (await db.invoices.where("stage").anyOf("pending", "paid").count())
          throw Error("Selesaikan invoice terbuka sebelum mengganti stok.");
        for (const row of preview.rows) await saveOffer(row);
      });
      setPreview(null);
      show("Pengaturan tiga kartu dipulihkan.");
    } catch (e) {
      show(e instanceof Error ? e.message : "Pemulihan gagal.");
    }
  }
  return (
    <details className="rounded-2xl border p-4">
      <summary className="cursor-pointer font-semibold">
        Cadangan pengaturan kartu
      </summary>
      <p className="my-3 text-sm text-muted-foreground">
        Berkas berisi harga, stok dan rincian tiga kartu. Invoice dan sesi promo
        tersimpan terpisah di browser ini. Simpan berkas di tempat aman.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={download}>
          Ekspor JSON
        </Button>
        <label className="text-sm font-semibold">
          Impor JSON{" "}
          <input
            type="file"
            accept=".json,application/json"
            className="block"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              setPreview(null);
              show("");
              if (!f) return;
              try {
                if (f.size > 128000) throw Error();
                const b = schema.parse(JSON.parse(await f.text()));
                setPreview({
                  date: b.exportedAt,
                  rows: b.offers.map((o) => ({
                    ...o,
                    revision: offers.find((row) => row.brand === o.brand)!
                      .revision,
                  })),
                });
              } catch {
                show(
                  "Berkas ditolak. Periksa versi format dan pastikan setiap merek tercantum satu kali.",
                );
              }
            }}
          />
        </label>
      </div>
      {preview && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Pratinjau penggantian</h3>
          <p>{new Date(preview.date).toLocaleString("id-ID")}</p>
          {preview.rows.map((o) => (
            <p key={o.brand}>
              {brandNames[o.brand]} · {formatPrice(o.price)} · {o.stock} fisik
            </p>
          ))}
          <Button onClick={replace}>Ganti pengaturan tiga kartu</Button>{" "}
          <Button variant="outline" onClick={() => setPreview(null)}>
            Batal
          </Button>
        </div>
      )}
      {message && (
        <p role="status" className="mt-3 text-sm">
          {message}
        </p>
      )}
    </details>
  );
}
