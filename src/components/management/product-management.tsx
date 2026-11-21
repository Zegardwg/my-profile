"use client";
import { useRef, useState } from "react";
import {
  Download,
  Upload,
  Archive,
  ArchiveRestore,
  Copy,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import {
  useCatalog,
  CatalogLoading,
} from "@/components/products/catalog-provider";
import { ModeSwitcher, useMode } from "@/components/mode/mode-provider";
import { catalogErrorMessage } from "@/lib/catalog-errors";
import { checkBackupSize } from "@/lib/product-schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProductEditor } from "./product-editor";
import { ProductVisual } from "@/components/catalog/product-visual";
import {
  applyImport,
  duplicateProduct,
  exportCatalog,
  newProduct,
  previewImport,
  setArchived,
  type ImportPreview,
} from "@/lib/product-repository";
import { brandNames } from "@/data/demo-products";
import { starterBrands, starterCategory } from "@/lib/starter-cards";
import { formatPrice } from "@/lib/product-presentation";
import type { Product } from "@/types/product";
const field = "min-h-12 w-full min-w-0 rounded-xl border bg-white px-3 text-sm";
export function ProductManagement() {
  const { mode } = useMode();
  const { products, loading, error } = useCatalog();
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [archive, setArchive] = useState("active");
  const [editor, setEditor] = useState<{
    product: Product;
    isNew: boolean;
  } | null>(null);
  const [confirm, setConfirm] = useState<Product | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [replace, setReplace] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState("");
  const file = useRef<HTMLInputElement>(null);
  async function perform(action: () => Promise<void>) {
    setBusy(true);
    setFailure("");
    setMessage("");
    try {
      await action();
    } catch (error) {
      setFailure(catalogErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  if (mode !== "promoter")
    return (
      <section className="rounded-2xl border bg-white p-6 sm:p-9">
        <p className="eyebrow text-primary">Mode pelanggan</p>
        <h2 className="mt-3 text-2xl font-bold">
          Katalog siap dipresentasikan.
        </h2>
        <p className="mt-4 mb-6 max-w-2xl text-sm leading-7 text-muted-foreground">
          Pengelolaan produk hanya ditampilkan dalam mode promotor. Ini pilihan
          antarmuka lokal, bukan autentikasi atau pembatasan keamanan admin.
        </p>
        <ModeSwitcher expanded />
      </section>
    );
  if (loading) return <CatalogLoading />;
  const active = products.filter((product) => !product.archived);
  const query = search.trim().toLocaleLowerCase("id-ID");
  const result = products.filter(
    (product) =>
      (archive === "all" || product.archived === (archive === "archived")) &&
      (brand === "all" || product.brand === brand) &&
      (availability === "all" ||
        product.available === (availability === "available")) &&
      [product.name, product.id, product.category]
        .join(" ")
        .toLocaleLowerCase("id-ID")
        .includes(query),
  );
  const disabled = busy || Boolean(error);
  return (
    <div className="space-y-7">
      <aside className="rounded-2xl border border-primary/15 bg-secondary p-5 text-xs leading-6 text-muted-foreground">
        <strong className="block text-sm text-navy">
          Ruang kerja lokal promotor
        </strong>
        IndexedDB hanya tersimpan pada browser dan origin ini, tanpa
        sinkronisasi otomatis. Menghapus penyimpanan browser dapat menghapus
        katalog. Ekspor cadangan dan simpan berkasnya dengan aman. Jangan
        masukkan NIK, KTP, OTP, biometrik atau data pelanggan. Mode ini bukan
        login admin.
      </aside>
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-bold">Kartu perdana di beranda</h2>
        <p className="my-3 text-sm text-muted-foreground">
          Isi harga konter dan periksa informasi kartu. Pembayaran aktif saat
          kartu tersedia, harganya di atas Rp0, dan statusnya diperiksa
          promotor.
        </p>
        <div className="flex flex-wrap gap-2">
          {starterBrands.map((brand) => (
            <Button
              key={brand}
              disabled={disabled}
              variant="outline"
              className="min-h-12"
              onClick={() => {
                const product = {
                  ...newProduct(),
                  brand,
                  category: starterCategory,
                  name: "Kartu perdana " + brandNames[brand],
                  benefits: ["Satu kartu perdana fisik"],
                  restrictions: [
                    "Registrasi dilakukan melalui kanal resmi operator.",
                  ],
                  placeholderId: "sim" as const,
                };
                setEditor({ product, isNew: true });
              }}
            >
              Tambah perdana {brandNames[brand]}
            </Button>
          ))}
        </div>
      </section>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Produk aktif", active.length],
          ["Tersedia", active.filter((p) => p.available).length],
          [
            "Produk demo",
            active.filter((p) => p.informationStatus === "demo").length,
          ],
          ["Diarsipkan", products.length - active.length],
        ].map(([label, count]) => (
          <div key={label} className="rounded-2xl border bg-white p-5">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-2 text-3xl font-bold text-primary">{count}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Produk untuk setiap kebutuhan</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {result.length} dari {products.length} produk lokal
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className="min-h-12 rounded-xl"
            disabled={disabled}
            onClick={() => {
              setFailure("");
              setEditor({ product: newProduct(), isNew: true });
              setMessage("");
            }}
          >
            <Plus aria-hidden="true" />
            Tambah produk
          </Button>
          <Button
            variant="outline"
            className="min-h-12 rounded-xl"
            disabled={disabled}
            onClick={() =>
              void perform(async () => {
                const backup = await exportCatalog();
                const url = URL.createObjectURL(
                  new Blob([JSON.stringify(backup, null, 2)], {
                    type: "application/json",
                  }),
                );
                const link = document.createElement("a");
                link.href = url;
                link.download =
                  "xlsmart-katalog-" + backup.exportedAt.slice(0, 10) + ".json";
                link.click();
                window.setTimeout(() => URL.revokeObjectURL(url), 1000);
                setMessage(
                  "Cadangan JSON berhasil dibuat. Waktu cadangan: " +
                    backup.exportedAt +
                    ". Simpan berkas di tempat aman.",
                );
              })
            }
          >
            <Download aria-hidden="true" />
            Ekspor JSON
          </Button>
          <Button
            variant="outline"
            className="min-h-12 rounded-xl"
            disabled={disabled}
            onClick={() => file.current?.click()}
          >
            <Upload aria-hidden="true" />
            Impor JSON
          </Button>
          <input
            ref={file}
            hidden
            type="file"
            accept="application/json,.json"
            aria-label="Berkas cadangan katalog"
            disabled={disabled}
            onChange={(event) => {
              const selected = event.target.files?.[0];
              event.target.value = "";
              if (!selected) return;
              setPreview(null);
              void perform(async () => {
                checkBackupSize(selected.size);
                const next = await previewImport(await selected.text());
                setReplace(false);
                setAcknowledged(false);
                setPreview(next);
              });
            }}
          />
        </div>
      </div>
      {message && (
        <p
          role="status"
          className="rounded-xl border border-primary/20 bg-white p-4 text-sm leading-6 text-navy"
        >
          {message}
        </p>
      )}
      {failure && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-white p-4 text-sm leading-6 text-destructive"
        >
          {failure}
        </p>
      )}
      <div className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label
            htmlFor="manage-search"
            className="mb-2 flex items-center gap-2 text-xs font-semibold"
          >
            <Search aria-hidden="true" className="size-4" />
            Cari produk
          </label>
          <input
            id="manage-search"
            className={field}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nama, ID atau kategori"
          />
        </div>
        <div>
          <label
            htmlFor="manage-brand"
            className="mb-2 block text-xs font-semibold"
          >
            Merek produk
          </label>
          <select
            id="manage-brand"
            className={field}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="all">Semua merek</option>
            {Object.entries(brandNames).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="manage-availability"
            className="mb-2 block text-xs font-semibold"
          >
            Ketersediaan produk
          </label>
          <select
            id="manage-availability"
            className={field}
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="all">Semua status</option>
            <option value="available">Tersedia</option>
            <option value="unavailable">Tidak tersedia</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="manage-archive"
            className="mb-2 block text-xs font-semibold"
          >
            Status arsip
          </label>
          <select
            id="manage-archive"
            className={field}
            value={archive}
            onChange={(e) => setArchive(e.target.value)}
          >
            <option value="active">Produk aktif</option>
            <option value="archived">Diarsipkan</option>
            <option value="all">Semua produk</option>
          </select>
        </div>
      </div>
      {result.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {result.map((product) => (
            <article
              key={product.id}
              aria-label={"Kelola " + product.name}
              className="flex min-w-0 flex-col rounded-2xl border bg-white p-5"
            >
              <ProductVisual
                brand={product.brand}
                placeholderId={product.placeholderId}
              />
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="rounded-full bg-secondary px-3 py-1 text-primary">
                  {brandNames[product.brand]}
                </span>
                <span className="rounded-full border px-3 py-1">
                  {product.informationStatus === "demo"
                    ? "DATA DEMO"
                    : "DIPERIKSA MANUAL"}
                </span>
                {product.archived && (
                  <span className="rounded-full border px-3 py-1">ARSIP</span>
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold">{product.name}</h3>
              <p className="mt-2 text-lg font-semibold text-primary">
                {formatPrice(product.price)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {product.quotaGb} GB · {product.validityDays} hari ·{" "}
                {product.available ? "Tersedia" : "Tidak tersedia"}
              </p>
              <div className="my-4 space-y-1 break-words text-[11px] leading-5 text-muted-foreground">
                <p>
                  Diperbarui:{" "}
                  <time dateTime={product.updatedAt}>
                    {new Date(product.updatedAt).toLocaleString("id-ID")}
                  </time>
                </p>
                <p>
                  Diverifikasi: {product.lastVerifiedAt || "Belum diperiksa"}
                </p>
                <p className="break-all">ID: {product.id}</p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  className="min-h-12 rounded-xl"
                  disabled={disabled}
                  aria-label={"Edit " + product.name}
                  onClick={() => {
                    setFailure("");
                    setMessage("");
                    setEditor({ product, isNew: false });
                  }}
                >
                  <Pencil aria-hidden="true" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="min-h-12 rounded-xl"
                  disabled={disabled}
                  aria-label={"Duplikat " + product.name}
                  onClick={() =>
                    void perform(async () => {
                      await duplicateProduct(product.id);
                      setMessage(
                        "Salinan dibuat dengan ID baru dan status demo. Verifikasi sumber tidak disalin.",
                      );
                    })
                  }
                >
                  <Copy aria-hidden="true" />
                  Duplikat
                </Button>
                <Button
                  variant="ghost"
                  className="min-h-12 rounded-xl text-primary"
                  disabled={disabled}
                  aria-label={
                    (product.archived ? "Pulihkan " : "Arsipkan ") +
                    product.name
                  }
                  onClick={() => {
                    setFailure("");
                    setConfirm(product);
                  }}
                >
                  {product.archived ? (
                    <ArchiveRestore aria-hidden="true" />
                  ) : (
                    <Archive aria-hidden="true" />
                  )}
                  {product.archived ? "Pulihkan" : "Arsipkan"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
          <h3 className="text-xl font-bold">Belum ada produk yang sesuai</h3>
          <p className="mt-3 mb-5 text-sm text-muted-foreground">
            Ubah filter, pulihkan arsip atau tambahkan produk lokal.
          </p>
          <Button
            variant="outline"
            className="min-h-12 rounded-xl"
            onClick={() => {
              setSearch("");
              setBrand("all");
              setAvailability("all");
              setArchive("active");
            }}
          >
            Bersihkan filter produk
          </Button>
        </div>
      )}
      {editor && (
        <ProductEditor
          key={editor.product.id + ":" + editor.product.revision}
          {...editor}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            setFailure("");
            setMessage(
              "Produk berhasil disimpan di browser ini. Katalog, pencari paket dan perbandingan diperbarui otomatis.",
            );
          }}
        />
      )}
      <Dialog
        open={Boolean(confirm)}
        onOpenChange={(open) => {
          if (!open && !busy) setConfirm(null);
        }}
      >
        <DialogContent className="rounded-2xl" showCloseButton={!busy}>
          <DialogHeader>
            <DialogTitle>
              {confirm?.archived ? "Pulihkan produk?" : "Arsipkan produk?"}
            </DialogTitle>
            <DialogDescription>
              {confirm?.name}{" "}
              {confirm?.archived
                ? "akan kembali tersedia dalam katalog penjualan sesuai status ketersediaannya."
                : "akan disembunyikan dari katalog, pencari paket dan perbandingan. Data tetap tersimpan dan dapat dipulihkan."}
            </DialogDescription>
          </DialogHeader>
          {failure && (
            <p role="alert" className="text-sm text-destructive">
              {failure}
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="min-h-12 rounded-xl"
              disabled={busy}
              onClick={() => setConfirm(null)}
            >
              Batal
            </Button>
            <Button
              className="min-h-12 rounded-xl"
              disabled={busy || Boolean(error)}
              onClick={() => {
                const product = confirm;
                if (product)
                  void perform(async () => {
                    await setArchived(product, !product.archived);
                    setConfirm(null);
                    setMessage(
                      product.archived
                        ? "Produk berhasil dipulihkan."
                        : "Produk diarsipkan; tidak dihapus permanen.",
                    );
                  });
              }}
            >
              {busy
                ? "Menyimpan…"
                : confirm?.archived
                  ? "Ya, pulihkan"
                  : "Ya, arsipkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(preview)}
        onOpenChange={(open) => {
          if (!open && !busy) setPreview(null);
        }}
      >
        <DialogContent
          className="max-h-[85dvh] overflow-y-auto rounded-2xl sm:max-w-xl"
          showCloseButton={!busy}
        >
          <DialogHeader>
            <DialogTitle>Pratinjau impor katalog</DialogTitle>
            <DialogDescription>
              Periksa isi sebelum mengonfirmasi. Produk lain tetap tersimpan.
              Berkas tidak dikirim ke server.
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <>
              <div className="rounded-xl bg-secondary p-4 text-sm leading-7">
                <p>Versi format: {preview.backup.version}</p>
                <p>Waktu cadangan: {preview.backup.exportedAt}</p>
                <p>
                  {preview.backup.products.length} produk · {preview.newCount}{" "}
                  ID baru · {preview.conflicts.length} ID sudah ada
                </p>
                <p>
                  {preview.backup.products.filter((p) => p.archived).length}{" "}
                  produk arsip ·{" "}
                  {
                    preview.backup.products.filter(
                      (p) => p.informationStatus === "verified",
                    ).length
                  }{" "}
                  catatan diperiksa manual
                </p>
              </div>
              <ul className="max-h-40 space-y-2 overflow-y-auto rounded-xl border p-3 text-xs leading-6">
                {preview.backup.products.map((p) => (
                  <li key={p.id} className="break-all">
                    {p.name} · {p.id} ·{" "}
                    {preview.conflicts.includes(p.id) ? "ID sudah ada" : "Baru"}{" "}
                    ·{" "}
                    {p.informationStatus === "demo"
                      ? "Demo"
                      : "Diperiksa manual"}
                  </li>
                ))}
              </ul>
              {preview.conflicts.length > 0 && (
                <label className="flex min-h-14 items-start gap-3 rounded-xl border p-4 text-sm leading-6">
                  <input
                    type="checkbox"
                    className="mt-1 size-5 shrink-0 accent-primary"
                    checked={replace}
                    disabled={busy}
                    onChange={(e) => setReplace(e.target.checked)}
                  />
                  Ganti {preview.conflicts.length} produk dengan ID yang sama.
                  Tanpa pilihan ini, ID yang sudah ada akan dilewati.
                </label>
              )}
              {preview.backup.products.some(
                (p) => p.informationStatus === "verified",
              ) && (
                <label className="flex min-h-14 items-start gap-3 text-xs leading-6">
                  <input
                    type="checkbox"
                    className="mt-1 size-5 shrink-0 accent-primary"
                    checked={acknowledged}
                    disabled={busy}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                  />
                  Saya memahami status diperiksa manual berasal dari berkas.
                  Aplikasi tidak memverifikasi sumber atau harga yang diimpor.
                </label>
              )}
              <p className="text-xs leading-6 text-muted-foreground">
                {replace
                  ? "Konfirmasi akan mengganti isi ID yang cocok. Ekspor cadangan saat ini terlebih dahulu bila diperlukan."
                  : "Hanya produk dengan ID baru yang akan ditambahkan."}
              </p>
              {failure && (
                <p role="alert" className="text-sm text-destructive">
                  {failure}
                </p>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  className="min-h-12 rounded-xl"
                  disabled={busy}
                  onClick={() => setPreview(null)}
                >
                  Batal impor
                </Button>
                <Button
                  className="min-h-12 rounded-xl"
                  disabled={
                    disabled ||
                    (preview.backup.products.some(
                      (p) => p.informationStatus === "verified",
                    ) &&
                      !acknowledged)
                  }
                  onClick={() =>
                    void perform(async () => {
                      const result = await applyImport(preview, replace);
                      setPreview(null);
                      setMessage(
                        "Impor berhasil: " +
                          result.imported +
                          " produk disimpan, " +
                          result.skipped +
                          " ID dilewati.",
                      );
                    })
                  }
                >
                  {busy
                    ? "Mengimpor…"
                    : replace
                      ? "Konfirmasi penggantian"
                      : "Konfirmasi impor"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
