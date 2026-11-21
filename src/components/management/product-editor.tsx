"use client";
import { useEffect, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { catalogErrorMessage } from "@/lib/catalog-errors";
import { Button } from "@/components/ui/button";
import { starterCategory } from "@/lib/starter-cards";
import { localVerificationDay, productSchema } from "@/lib/product-schema";
import { saveProduct } from "@/lib/product-repository";
import { placeholderNames } from "@/config/product-placeholders";
import { brandNames, usageNames } from "@/data/demo-products";
import type { Product } from "@/types/product";

type Draft = Omit<
  Product,
  | "price"
  | "originalPrice"
  | "quotaGb"
  | "validityDays"
  | "benefits"
  | "restrictions"
> & {
  price: string;
  originalPrice: string;
  quotaGb: string;
  validityDays: string;
  benefits: string;
  restrictions: string;
};
const draftOf = (product: Product): Draft => ({
  ...product,
  price: String(product.price),
  originalPrice: String(product.originalPrice ?? ""),
  quotaGb: String(product.quotaGb),
  validityDays: String(product.validityDays),
  benefits: product.benefits.join("\n"),
  restrictions: product.restrictions.join("\n"),
});
const inputClass =
  "mt-2 min-h-12 w-full min-w-0 rounded-xl border bg-white px-3 py-2 text-sm aria-invalid:border-destructive";
function Field({
  name,
  label,
  error,
  children,
  wide = false,
}: {
  name: string;
  label: string;
  error?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label
        htmlFor={"editor-" + name}
        className="block text-xs font-semibold text-navy"
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={"error-" + name}
          className="mt-1 text-xs leading-5 text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
export function ProductEditor({
  product,
  isNew,
  onClose,
  onSaved,
}: {
  product: Product;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState(() => draftOf(product));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(draftOf(product));
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const requestClose = () => {
    if (saving) return;
    if (dirty) setDiscard(true);
    else onClose();
  };
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setAcknowledged(false);
  }
  function attributes(name: string) {
    return {
      id: "editor-" + name,
      className: inputClass,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? "error-" + name : undefined,
    };
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const split = (value: string) =>
      value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    const number = (value: string) => (value.trim() ? Number(value) : NaN);
    const result = productSchema.safeParse({
      ...draft,
      price: number(draft.price),
      originalPrice: draft.originalPrice
        ? number(draft.originalPrice)
        : undefined,
      quotaGb: number(draft.quotaGb),
      validityDays: number(draft.validityDays),
      benefits: split(draft.benefits),
      restrictions: split(draft.restrictions),
    });
    const nextErrors: Record<string, string> = {};
    if (!result.success)
      for (const issue of result.error.issues)
        nextErrors[String(issue.path[0])] ??= issue.message;
    if (draft.informationStatus === "verified" && !acknowledged)
      nextErrors.informationStatus =
        "Konfirmasikan bahwa sumber dan seluruh informasi telah diperiksa secara manual.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !result.success) {
      requestAnimationFrame(() =>
        document
          .getElementById("editor-" + Object.keys(nextErrors)[0])
          ?.focus(),
      );
      return;
    }
    setSaving(true);
    try {
      await saveProduct(result.data, isNew ? undefined : product.revision);
      onSaved();
    } catch (error) {
      setErrors({ save: catalogErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) requestClose();
        }}
      >
        <DialogContent
          className="max-h-[90dvh] w-[calc(100%-2rem)] gap-5 overflow-y-auto rounded-2xl sm:max-w-3xl"
          showCloseButton={!saving}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isNew ? "Tambah produk" : "Edit produk"}
            </DialogTitle>
            <DialogDescription>
              Perubahan disimpan hanya di browser ini. Status demo tidak berubah
              menjadi terverifikasi secara otomatis.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => void save(event)}
            noValidate
            className="space-y-6"
            aria-label="Editor produk"
          >
            <div className="rounded-xl bg-secondary px-4 py-3 text-xs leading-6">
              <p className="font-semibold">ID produk (otomatis)</p>
              <p className="break-all text-muted-foreground">{product.id}</p>
            </div>
            <fieldset
              disabled={saving}
              className="grid min-w-0 gap-5 sm:grid-cols-2"
            >
              <legend className="sr-only">Informasi paket</legend>
              <Field name="brand" label="Merek" error={errors.brand}>
                <select
                  {...attributes("brand")}
                  value={draft.brand}
                  onChange={(e) =>
                    update("brand", e.target.value as Product["brand"])
                  }
                >
                  {Object.entries(brandNames).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field name="name" label="Nama produk" error={errors.name}>
                <input
                  {...attributes("name")}
                  value={draft.name}
                  maxLength={100}
                  onChange={(e) => update("name", e.target.value)}
                />
              </Field>
              <Field name="price" label="Harga (Rp)" error={errors.price}>
                <input
                  {...attributes("price")}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={draft.price}
                  onChange={(e) => update("price", e.target.value)}
                />
              </Field>
              <Field
                name="originalPrice"
                label="Harga normal sebelum diskon (Rp, opsional)"
                error={errors.originalPrice}
              >
                <input
                  {...attributes("originalPrice")}
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={draft.originalPrice}
                  onChange={(e) => update("originalPrice", e.target.value)}
                />
              </Field>
              <Field
                name="quotaGb"
                label="Kuota utama (GB)"
                error={errors.quotaGb}
              >
                <input
                  {...attributes("quotaGb")}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={draft.quotaGb}
                  onChange={(e) => update("quotaGb", e.target.value)}
                />
              </Field>
              <Field
                name="validityDays"
                label="Masa aktif (hari)"
                error={errors.validityDays}
              >
                <input
                  {...attributes("validityDays")}
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={draft.validityDays}
                  onChange={(e) => update("validityDays", e.target.value)}
                />
              </Field>
              <Field
                name="category"
                label="Kategori paket"
                error={errors.category}
              >
                <input
                  {...attributes("category")}
                  list="product-categories"
                  value={draft.category}
                  maxLength={80}
                  onChange={(e) => update("category", e.target.value)}
                />
              </Field>
              <datalist id="product-categories">
                <option value={starterCategory} />
              </datalist>
              <Field
                name="usages"
                label="Kebutuhan utama"
                error={errors.usages}
              >
                <select
                  {...attributes("usages")}
                  value={draft.usages[0]}
                  onChange={(e) =>
                    update("usages", [
                      e.target.value as Product["usages"][number],
                    ])
                  }
                >
                  {Object.entries(usageNames).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                name="available"
                label="Ketersediaan"
                error={errors.available}
              >
                <select
                  {...attributes("available")}
                  value={String(draft.available)}
                  onChange={(e) =>
                    update("available", e.target.value === "true")
                  }
                >
                  <option value="true">Tersedia</option>
                  <option value="false">Tidak tersedia</option>
                </select>
              </Field>
              <Field
                name="benefits"
                label="Manfaat (satu per baris)"
                error={errors.benefits}
                wide
              >
                <textarea
                  {...attributes("benefits")}
                  rows={3}
                  value={draft.benefits}
                  onChange={(e) => update("benefits", e.target.value)}
                />
              </Field>
              <Field
                name="restrictions"
                label="Batasan / ketentuan pemakaian wajar (satu per baris)"
                error={errors.restrictions}
                wide
              >
                <textarea
                  {...attributes("restrictions")}
                  rows={3}
                  value={draft.restrictions}
                  onChange={(e) => update("restrictions", e.target.value)}
                />
              </Field>
              <Field
                name="placeholderId"
                label="Gaya ilustrasi produk"
                error={errors.placeholderId}
              >
                <select
                  {...attributes("placeholderId")}
                  value={draft.placeholderId}
                  onChange={(e) =>
                    update(
                      "placeholderId",
                      e.target.value as Product["placeholderId"],
                    )
                  }
                >
                  {Object.entries(placeholderNames).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                name="informationStatus"
                label="Status informasi"
                error={errors.informationStatus}
              >
                <select
                  {...attributes("informationStatus")}
                  value={draft.informationStatus}
                  onChange={(e) =>
                    update(
                      "informationStatus",
                      e.target.value as Product["informationStatus"],
                    )
                  }
                >
                  <option value="demo">Demo (fiktif)</option>
                  <option value="verified">Diperiksa promotor (manual)</option>
                </select>
              </Field>
              <Field
                name="sourceUrl"
                label="URL sumber HTTPS (opsional)"
                error={errors.sourceUrl}
              >
                <input
                  {...attributes("sourceUrl")}
                  type="url"
                  value={draft.sourceUrl}
                  maxLength={1000}
                  onChange={(e) => update("sourceUrl", e.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field
                name="lastVerifiedAt"
                label="Terakhir diverifikasi (opsional untuk demo)"
                error={errors.lastVerifiedAt}
              >
                <input
                  {...attributes("lastVerifiedAt")}
                  type="date"
                  max={localVerificationDay()}
                  value={draft.lastVerifiedAt}
                  onChange={(e) => update("lastVerifiedAt", e.target.value)}
                />
              </Field>
              {draft.informationStatus === "verified" && (
                <label className="flex min-h-14 items-start gap-3 rounded-xl border bg-secondary p-4 text-xs leading-6 sm:col-span-2">
                  <input
                    type="checkbox"
                    className="mt-1 size-5 shrink-0 accent-primary"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                  />
                  Saya telah memeriksa sumber, harga, manfaat dan batasan. Ini
                  catatan manual promotor, bukan verifikasi resmi operator oleh
                  aplikasi.
                </label>
              )}
            </fieldset>
            {errors.save && (
              <p
                role="alert"
                className="rounded-xl border border-destructive/30 p-4 text-sm text-destructive"
              >
                {errors.save}
              </p>
            )}
            {Object.keys(errors).some((key) => key !== "save") && (
              <p role="alert" className="text-sm text-destructive">
                Periksa kolom yang ditandai sebelum menyimpan.
              </p>
            )}
            <div className="sticky -bottom-6 flex flex-wrap justify-end gap-3 border-t bg-white py-4">
              <Button
                type="button"
                variant="outline"
                className="min-h-12 rounded-xl"
                disabled={saving}
                onClick={requestClose}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="min-h-12 rounded-xl"
                disabled={saving}
              >
                {saving ? "Menyimpan…" : "Simpan produk"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={discard} onOpenChange={setDiscard}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Buang perubahan yang belum disimpan?</DialogTitle>
            <DialogDescription>
              Perubahan pada editor ini akan hilang. Produk yang sudah tersimpan
              tetap tersedia.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="min-h-12 rounded-xl"
              onClick={() => setDiscard(false)}
            >
              Lanjutkan mengedit
            </Button>
            <Button className="min-h-12 rounded-xl" onClick={onClose}>
              Buang perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
