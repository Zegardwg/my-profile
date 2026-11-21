"use client";
import Image from "next/image";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Banknote, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brandNames } from "@/data/demo-products";
import { useMode, ModeSwitcher } from "@/components/mode/mode-provider";
import {
  checkout,
  updateInvoice,
  type readCounter,
} from "@/lib/counter-repository";
import { getDatabase } from "@/lib/db";
import {
  remainingStock,
  remainingClaims,
  validCode,
  quote,
  type Line,
  type Invoice,
} from "@/lib/counter-model";
import { formatPrice } from "@/lib/product-presentation";
import { SalePrice } from "@/components/shared/sale-price";
import type { Brand } from "@/types/product";

function Lines({ lines }: { lines: Line[] }) {
  return (
    <ul className="divide-y">
      {lines.map((l) => (
        <li
          key={l.kind}
          className="flex items-start justify-between gap-3 py-2 text-sm"
        >
          <span>
            {l.kind === "sale"
              ? "1 kartu perdana "
              : l.kind === "bonus"
                ? "1 kartu bonus "
                : "1 kartu gratis "}
            {brandNames[l.brand]}
          </span>
          <span className="font-bold">
            <SalePrice price={l.price} originalPrice={l.originalPrice} />
          </span>
        </li>
      ))}
    </ul>
  );
}
export function SaleDialog({
  brand,
  free,
  data,
  onClose,
  onInvoice,
}: {
  brand: Brand;
  free: boolean;
  data: Awaited<ReturnType<typeof readCounter>>;
  onClose: () => void;
  onInvoice: (id: string) => void;
}) {
  const saved = data.offers.find((row) => row.brand === brand)!,
    c = data.campaign;
  const o = saved.verifiedAt
    ? saved
    : { ...saved, price: 0, quota: 0, days: 0, benefits: "" };
  const [id] = useState(() => crypto.randomUUID()),
    [method, setMethod] = useState<"qr" | "cash">("qr"),
    [code, setCode] = useState(""),
    [applied, apply] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const axisStock = remainingStock(
    data.offers.find((row) => row.brand === "axis")!,
    data.invoices,
  );
  const available = remainingStock(o, data.invoices) > 0;
  const eligible = free
    ? c.free && remainingClaims(c, data.invoices) > 0 && axisStock > 0
    : c.bonus && brand !== "axis" && axisStock > 0;
  const blocked = !available
    ? "Stok belum tersedia."
    : !free && !o.price
      ? "Harga jual belum diatur."
      : free && !eligible
        ? "Jatah kartu gratis sudah habis."
        : applied && !eligible
          ? "Bonus sudah habis. Lepas kode untuk melanjutkan."
          : free && !applied
            ? "Masukkan kode untuk klaim kartu."
            : code.trim() && !applied
              ? "Terapkan atau kosongkan kode terlebih dahulu."
              : "";
  function redeem(value: string) {
    if (!validCode(value)) {
      setError("Kode tidak dikenali. Periksa kembali kodenya.");
      return;
    }
    setCode("XLSMART");
    apply(true);
    setError("");
  }
  async function submit() {
    if (blocked || busy) return;
    setBusy(true);
    setError("");
    try {
      const i = await checkout({
        id,
        brand,
        price: o.price,
        method: free ? "free" : method,
        code: applied ? "XLSMART" : "",
        session: c.session,
      });
      onInvoice(i.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invoice gagal disimpan.");
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {free
              ? "Klaim kartu gratis AXIS"
              : "Kartu perdana " + brandNames[brand]}
          </DialogTitle>
          <DialogDescription>
            {free
              ? "Satu kartu per klaim selama sesi pembagian."
              : "Periksa kartu dan total sebelum membayar."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Image
              unoptimized
              width={600}
              height={600}
              src={"/images/products/" + brand + ".webp"}
              alt={"Kemasan kartu perdana " + brandNames[brand]}
              className="aspect-[2/1] w-full rounded-2xl object-cover sm:aspect-square"
            />
            {!free && (
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {(o.days > 0 || o.quota > 0) && (
                  <p>
                    {[
                      o.quota > 0 && o.quota + " GB",
                      o.days > 0 && o.days + " hari",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {o.verifiedAt && <p>Diperiksa promotor · {o.verifiedAt}</p>}
                {o.updatedAt && (
                  <p>
                    Diperbarui ·{" "}
                    {new Date(o.updatedAt).toLocaleDateString("id-ID")}
                  </p>
                )}
                {o.benefits
                  .split("\n")
                  .filter(Boolean)
                  .map((s, i) => (
                    <p key={i}>{s}</p>
                  ))}
              </div>
            )}
          </div>
          <div className="grid content-start gap-4">
            {(eligible || applied || free) && (
              <div className="space-y-2 rounded-xl bg-secondary p-3">
                {applied ? (
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm">Kode XLSMART diterapkan</strong>
                    <Button
                      variant="outline"
                      onClick={() => {
                        apply(false);
                        setCode("");
                      }}
                    >
                      Lepas kode
                    </Button>
                  </div>
                ) : (
                  <>
                    <label className="text-sm font-semibold" htmlFor="redeem">
                      Kode promo
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="redeem"
                        autoComplete="off"
                        maxLength={40}
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value);
                          setError("");
                        }}
                      />
                      <Button variant="outline" onClick={() => redeem(code)}>
                        Terapkan
                      </Button>
                    </div>
                    {!free && (
                      <button
                        className="min-h-11 text-sm font-semibold text-primary underline"
                        onClick={() => redeem("XLSMART")}
                      >
                        Pakai kode XLSMART
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
            {free || o.price > 0 ? (
              <>
                <Lines
                  lines={quote(brand, o.price, free, applied, o.originalPrice)}
                />
                <p className="flex justify-between border-t pt-3 font-bold">
                  Total <span>{formatPrice(free ? 0 : o.price)}</span>
                </p>
              </>
            ) : (
              <p>Harga belum diatur</p>
            )}
            {!free && (
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">
                  Cara bayar
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {(["qr", "cash"] as const).map((m) => (
                    <Button
                      key={m}
                      aria-pressed={method === m}
                      className="min-h-12"
                      variant={method === m ? "default" : "outline"}
                      onClick={() => setMethod(m)}
                    >
                      {m === "qr" ? <QrCode /> : <Banknote />}
                      {m === "qr" ? "QRIS" : "Tunai"}
                    </Button>
                  ))}
                </div>
              </fieldset>
            )}
            {blocked && (
              <p className="text-sm text-muted-foreground">{blocked}</p>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <Button
              disabled={!!blocked || busy}
              className="min-h-12 rounded-full"
              onClick={submit}
            >
              {busy
                ? "Menyimpan…"
                : free
                  ? "Konfirmasi pengambilan"
                  : "Lanjut bayar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const invoiceStatus = (i: Invoice) =>
  i.stage === "cancelled"
    ? "Dibatalkan"
    : i.stage === "handed"
      ? "Sudah diambil"
      : i.stage === "paid"
        ? "Lunas"
        : i.method === "free"
          ? "Menunggu pengambilan"
          : "Menunggu pembayaran";
export function ReceiptDialog({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const result = useLiveQuery(async () => {
    try {
      return { invoice: await getDatabase().invoices.get(id), error: "" };
    } catch {
      return {
        invoice: null,
        error: "Invoice gagal dimuat dari penyimpanan lokal.",
      };
    }
  }, [id]);
  const { mode } = useMode(),
    [cash, setCash] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [cancel, setCancel] = useState(false);
  const i = result?.invoice;
  async function act(action: "pay" | "cancel" | "handover") {
    setBusy(true);
    setError("");
    try {
      await updateInvoice(id, action, Number(cash));
      setCancel(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Perubahan gagal disimpan.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v && !busy) onClose();
      }}
    >
      <DialogContent className="max-h-[92dvh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invoice penjualan</DialogTitle>
          <DialogDescription>
            {i
              ? "INV-" +
                id.toUpperCase().slice(0, 8) +
                " · " +
                new Date(i.created).toLocaleString("id-ID")
              : result?.error ||
                (!result ? "Memuat invoice…" : "Invoice tidak ditemukan.")}
          </DialogDescription>
        </DialogHeader>
        {i && (
          <>
            <div className="rounded-xl bg-secondary p-4">
              <p role="status" className="mb-2 font-semibold text-primary">
                {invoiceStatus(i)}
              </p>
              <Lines lines={i.lines} />
              {i.code && <p className="text-xs">Kode promo · {i.code}</p>}
              <p className="mt-3 flex justify-between border-t pt-3 font-bold">
                Total <span>{formatPrice(i.total)}</span>
              </p>
            </div>
            {i.method !== "free" && (
              <p className="text-sm">
                Cara bayar ·{" "}
                <strong>{i.method === "qr" ? "QRIS" : "Tunai"}</strong>
              </p>
            )}
            {i.stage === "pending" && i.method === "qr" && (
              <div className="grid justify-items-center gap-2 text-center text-sm">
                <Image
                  unoptimized
                  src="/images/qris-merchant.png"
                  alt="Kode QRIS promotor"
                  width={250}
                  height={250}
                  className="max-w-full"
                />
                <p>
                  Pindai QRIS dan masukkan{" "}
                  <strong>{formatPrice(i.total)}</strong>. Periksa penerima{" "}
                  <strong>Jawastore.biz.id, Pengiri</strong> di aplikasi
                  pembayaran.
                </p>
                <p className="text-xs text-muted-foreground">
                  Nama pada poster · DEWABLOX.ID ROBLOX
                </p>
              </div>
            )}
            {i.stage === "pending" && i.method === "cash" && (
              <p>Serahkan {formatPrice(i.total)} kepada promotor.</p>
            )}
            {i.method === "cash" && i.received !== undefined && (
              <p className="text-sm">
                Tunai diterima {formatPrice(i.received)} · Kembalian{" "}
                {formatPrice(i.received - i.total)}
              </p>
            )}
            {mode === "promoter" &&
              i.stage === "pending" &&
              i.method !== "free" && (
                <div className="grid gap-2">
                  {i.method === "cash" && (
                    <label className="text-sm">
                      Uang diterima (Rp)
                      <Input
                        type="number"
                        min={i.total}
                        value={cash}
                        onChange={(e) => setCash(e.target.value)}
                      />
                    </label>
                  )}
                  {i.method === "qr" && (
                    <p className="text-sm">
                      Cek pembayaran masuk di akun penerima sebelum menandai
                      lunas.
                    </p>
                  )}
                  <Button
                    disabled={
                      busy || (i.method === "cash" && Number(cash) < i.total)
                    }
                    onClick={() => act("pay")}
                  >
                    Konfirmasi pembayaran diterima
                  </Button>
                </div>
              )}
            {mode === "promoter" &&
              (i.stage === "paid" ||
                (i.stage === "pending" && i.method === "free")) && (
                <Button disabled={busy} onClick={() => act("handover")}>
                  Konfirmasi kartu diserahkan
                </Button>
              )}
            {mode === "customer" &&
              (i.stage === "pending" || i.stage === "paid") && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <p className="text-sm">Tunjukkan invoice ini ke promotor.</p>
                  <ModeSwitcher expanded />
                </div>
              )}
            {mode === "promoter" &&
              i.stage === "pending" &&
              (!cancel ? (
                <Button variant="outline" onClick={() => setCancel(true)}>
                  Batalkan invoice
                </Button>
              ) : (
                <div className="rounded-xl border p-3">
                  <p className="mb-2 text-sm">
                    Batalkan invoice dan lepaskan alokasi stok? Pastikan
                    pembayaran belum diterima.
                  </p>
                  <div className="flex gap-2">
                    <Button disabled={busy} onClick={() => act("cancel")}>
                      Ya, batalkan
                    </Button>
                    <Button variant="outline" onClick={() => setCancel(false)}>
                      Kembali
                    </Button>
                  </div>
                </div>
              ))}
            {error && <p role="alert">{error}</p>}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
