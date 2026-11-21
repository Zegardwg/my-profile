"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { ModeSwitcher, useMode } from "@/components/mode/mode-provider";
import { brandNames } from "@/data/demo-products";
import { useCounter } from "@/hooks/use-counter";
import { saveOffer, saveCampaign } from "@/lib/counter-repository";
import {
  remainingStock,
  remainingClaims,
  type Offer,
  type Campaign,
} from "@/lib/counter-model";
import { localVerificationDay } from "@/lib/product-schema";
import { formatPrice } from "@/lib/product-presentation";
import {
  ReceiptDialog,
  invoiceStatus,
} from "@/features/home/components/promo-checkout";
import { SalesBackup } from "./sales-backup";

type Editor = { offer: Offer } | { campaign: Campaign };
function SettingsEditor({
  editor,
  onClose,
  onSaved,
}: {
  editor: Editor;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const o = "offer" in editor ? editor.offer : null,
    c = "campaign" in editor ? editor.campaign : null;
  const fields = [
    ["price", "Harga jual (Rp)", 100000000],
    ["stock", "Stok fisik (kartu)", 100000],
    ["quota", "Kuota utama (GB)", 100000],
    ["days", "Masa aktif (hari)", 3650],
  ] as const;
  function close() {
    if (
      !busy &&
      (!dirty || window.confirm("Buang perubahan yang belum disimpan?"))
    )
      onClose();
  }
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v) close();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {o ? "Atur kartu " + brandNames[o.brand] : "Atur promo AXIS"}
          </DialogTitle>
          <DialogDescription>
            {o
              ? "Isi harga dan jumlah kartu yang ada di tangan. Harga 0 menutup penjualan."
              : "Kedua promo memakai stok fisik AXIS yang sama."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onChange={() => setDirty(true)}
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            setBusy(true);
            setError("");
            const f = new FormData(e.currentTarget);
            try {
              if (o)
                await saveOffer({
                  ...o,
                  price: Number(f.get("price")),
                  stock: Number(f.get("stock")),
                  quota: Number(f.get("quota")),
                  days: Number(f.get("days")),
                  benefits: String(f.get("benefits") ?? ""),
                  verifiedAt: String(f.get("verifiedAt") ?? ""),
                });
              if (c)
                await saveCampaign({
                  revision: c.revision,
                  limit: Number(f.get("limit")),
                  bonus: f.has("bonus"),
                  free: f.has("free"),
                });
              onSaved();
            } catch (ex) {
              setError(
                ex instanceof Error ? ex.message : "Gagal menyimpan perubahan.",
              );
              setBusy(false);
            }
          }}
        >
          {o && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {fields.map(([key, label, max]) => (
                  <label key={key} className="text-sm font-medium">
                    {label}
                    <Input
                      className="mt-1 min-h-11"
                      type="number"
                      name={key}
                      min={0}
                      max={max}
                      step={key === "quota" ? "any" : 1}
                      required
                      defaultValue={o[key]}
                    />
                  </label>
                ))}
              </div>
              <label className="text-sm font-medium">
                Manfaat (satu per baris)
                <textarea
                  name="benefits"
                  maxLength={900}
                  defaultValue={o.benefits}
                  className="mt-1 min-h-24 w-full rounded-xl border p-3"
                />
              </label>
              <label className="text-sm font-medium">
                Tanggal pemeriksaan promotor
                <Input
                  name="verifiedAt"
                  type="date"
                  max={localVerificationDay()}
                  defaultValue={o.verifiedAt ?? ""}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Isi setelah memeriksa harga dan rincian kartu. Kosongkan untuk
                menyimpan sebagai draf.
              </p>
            </>
          )}
          {c && (
            <>
              <label className="flex min-h-12 items-center gap-3 rounded-xl border p-3">
                <input type="checkbox" name="bonus" defaultChecked={c.bonus} />
                Bonus AXIS untuk pembelian XL atau Smartfren
              </label>
              <label className="flex min-h-12 items-center gap-3 rounded-xl border p-3">
                <input type="checkbox" name="free" defaultChecked={c.free} />
                Sesi AXIS gratis tanpa pembelian
              </label>
              <label>
                Jatah kartu gratis per sesi
                <Input
                  type="number"
                  name="limit"
                  required
                  min={0}
                  max={100000}
                  step={1}
                  defaultValue={c.limit}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Mengaktifkan kembali sesi memulai jatah baru. Invoice yang sudah
                terbit tetap dapat dilayani.
              </p>
            </>
          )}
          {error && (
            <p role="alert" className="text-red-700">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={close}>
              Batal
            </Button>
            <Button type="submit" disabled={busy}>
              Simpan pengaturan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function SalesSettings() {
  const { mode } = useMode(),
    counter = useCounter(),
    [editor, edit] = useState<Editor | null>(null),
    [id, open] = useState(""),
    [notice, say] = useState("");
  if (mode !== "promoter")
    return (
      <section className="space-y-4">
        <p>Pilih mode promotor untuk mengatur penjualan di perangkat ini.</p>
        <ModeSwitcher expanded />
      </section>
    );
  if (!counter)
    return (
      <div
        aria-label="Memuat pengaturan"
        className="h-52 animate-pulse rounded-2xl bg-secondary"
      />
    );
  if (!counter.data) return <p role="alert">{counter.error}</p>;
  const { offers, campaign, invoices, recent } = counter.data;
  const history = [
    ...invoices,
    ...recent.filter((i) => !invoices.some((item) => item.id === i.id)),
  ].sort((a, b) => b.created.localeCompare(a.created));
  return (
    <div className="grid max-w-5xl gap-8">
      {notice && (
        <p role="status" className="text-primary">
          {notice}
        </p>
      )}
      <section>
        <h2 className="mb-3 text-xl font-bold">Kartu perdana</h2>
        <div className="divide-y rounded-2xl border bg-white px-4">
          {offers.map((o) => (
            <div
              key={o.brand}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <h3 className="font-bold">{brandNames[o.brand]}</h3>
                <p className="mt-1 text-sm">
                  {o.price ? formatPrice(o.price) : "Harga belum diatur"} ·{" "}
                  {remainingStock(o, invoices)} siap dijual · {o.stock} fisik
                </p>
              </div>
              <Button
                variant="outline"
                aria-label={"Atur kartu " + brandNames[o.brand]}
                onClick={() => edit({ offer: o })}
              >
                Atur kartu
              </Button>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f5effc] p-5">
        <div>
          <h2 className="text-xl font-bold">Promo AXIS</h2>
          <p className="mt-1 text-sm">
            Bonus pembelian {campaign.bonus ? "aktif" : "nonaktif"} ·{" "}
            {campaign.free
              ? "Jatah sesi tersisa " + remainingClaims(campaign, invoices)
              : "Pembagian gratis nonaktif"}
          </p>
        </div>
        <Button variant="outline" onClick={() => edit({ campaign })}>
          Atur promo
        </Button>
      </section>
      <section>
        <h2 className="text-xl font-bold">Invoice penjualan</h2>
        {!history.length ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Belum ada transaksi di perangkat ini.
          </p>
        ) : (
          <ul className="mt-3 divide-y">
            {history.map((i) => (
              <li key={i.id}>
                <button
                  className="flex min-h-16 w-full flex-wrap items-center justify-between gap-2 py-2 text-left"
                  onClick={() => open(i.id)}
                >
                  <span>
                    <strong>
                      {brandNames[i.lines[0].brand]} · {formatPrice(i.total)}
                    </strong>
                    <small className="block text-muted-foreground">
                      INV-{i.id.slice(0, 8).toUpperCase()} ·{" "}
                      {new Date(i.created).toLocaleString("id-ID")}
                    </small>
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {invoiceStatus(i)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <SalesBackup offers={offers} />
      {editor && (
        <SettingsEditor
          editor={editor}
          onClose={() => edit(null)}
          onSaved={() => {
            edit(null);
            say("Pengaturan tersimpan.");
          }}
        />
      )}
      {id && <ReceiptDialog id={id} onClose={() => open("")} />}
    </div>
  );
}
