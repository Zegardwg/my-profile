"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogProductCard } from "@/components/catalog/catalog-product-card";
import { ComparisonSummary } from "@/components/compare/comparison-summary";
import { EmptyState } from "@/components/shared/empty-state";
import {
  useCatalog,
  CatalogLoading,
} from "@/components/products/catalog-provider";
import { brandNames, usageNames } from "@/data/demo-products";
import { formatPrice } from "@/lib/product-presentation";
import { recommendProducts } from "@/lib/recommendation-engine";
import type { Brand, FinderRequirements, Usage } from "@/types/product";

const initial: FinderRequirements = {
  budget: 75000,
  usage: "general",
  preferredValidity: 30,
  preferredBrand: "all",
  minValidity: 0,
  requiredBrand: "all",
};
const steps = ["Anggaran", "Penggunaan", "Masa aktif", "Merek", "Rekomendasi"];
const field = "min-h-12 w-full rounded-xl border bg-white px-4 text-sm";

export function FinderWizard() {
  const { activeProducts: products, loading } = useCatalog();
  const [step, setStep] = useState(0);
  const [requirements, setRequirements] = useState<FinderRequirements>({
    ...initial,
  });
  const heading = useRef<HTMLHeadingElement>(null);
  const recommendations = useMemo(
    () => recommendProducts(products, requirements),
    [products, requirements],
  );
  const validBudget =
    Number.isFinite(requirements.budget) && requirements.budget > 0;
  function go(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  function reset() {
    setRequirements({ ...initial });
    go(0);
  }
  if (loading) return <CatalogLoading />;
  return (
    <div>
      <label
        htmlFor="finder-status"
        className="mb-2 block text-xs font-semibold"
      >
        Status informasi paket
      </label>
      <select
        id="finder-status"
        className={field + " mb-6 max-w-md"}
        value={requirements.informationStatus ?? "all"}
        onChange={(e) =>
          setRequirements({
            ...requirements,
            informationStatus: e.target
              .value as FinderRequirements["informationStatus"],
          })
        }
      >
        <option value="all">Semua (demo dan diperiksa manual)</option>
        <option value="demo">Hanya data demo</option>
        <option value="verified">Hanya diperiksa manual</option>
      </select>
      <ol
        aria-label="Langkah pencari paket"
        className="mb-8 grid grid-cols-5 gap-2"
      >
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={step === index ? "step" : undefined}
            className="min-w-0"
          >
            <span
              className={
                "mb-2 flex size-9 items-center justify-center rounded-full text-sm font-bold " +
                (step >= index
                  ? "bg-primary text-white"
                  : "border bg-white text-muted-foreground")
              }
            >
              {step > index ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
            <span className="hidden text-xs font-medium sm:block">{label}</span>
          </li>
        ))}
      </ol>
      <h2 ref={heading} tabIndex={-1} className="mb-3 text-2xl font-bold">
        Langkah {step + 1}: {steps[step]}
      </h2>
      <p className="mb-7 max-w-2xl text-sm leading-7 text-muted-foreground">
        {step === 4
          ? "Hanya paket tersedia yang memenuhi anggaran dan semua syarat wajib. Maksimal tiga hasil, dengan alasan yang dapat ditelusuri."
          : "Pilihan tersimpan selama berpindah langkah. Preferensi membantu peringkat; syarat wajib menyaring hasil."}
      </p>
      {step < 4 ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (validBudget) go(step + 1);
          }}
          className="max-w-2xl rounded-2xl border bg-white p-5 sm:p-8"
        >
          {step === 0 && (
            <fieldset>
              <legend className="mb-4 text-lg font-semibold">
                Berapa anggaran internet per 30 hari?
              </legend>
              <label
                htmlFor="finder-budget"
                className="mb-2 block text-sm font-medium"
              >
                Anggaran maksimum (Rupiah)
              </label>
              <input
                id="finder-budget"
                type="number"
                min="1"
                step="1"
                required
                value={requirements.budget || ""}
                onChange={(event) =>
                  setRequirements({
                    ...requirements,
                    budget: Number(event.target.value),
                  })
                }
                className={field}
                aria-describedby="budget-help"
              />
              <p
                id="budget-help"
                className="mt-4 text-xs leading-6 text-muted-foreground"
              >
                Kami membatasi harga satu paket dan estimasi kebutuhan 30 hari.
                Estimasi = pembulatan ke atas (30 ÷ masa aktif) × harga paket.
                Ini simulasi anggaran, bukan ketentuan perpanjangan operator.
              </p>
            </fieldset>
          )}
          {step === 1 && (
            <fieldset>
              <legend className="mb-4 text-lg font-semibold">
                Aktivitas utama kamu?
              </legend>
              <div className="space-y-3">
                {Object.entries(usageNames).map(([usage, label]) => (
                  <label
                    key={usage}
                    className="flex min-h-14 items-center gap-3 rounded-xl border p-4 has-checked:border-primary has-checked:bg-secondary"
                  >
                    <input
                      type="radio"
                      name="usage"
                      value={usage}
                      checked={requirements.usage === usage}
                      onChange={() =>
                        setRequirements({
                          ...requirements,
                          usage: usage as Usage,
                        })
                      }
                      className="size-5 accent-primary"
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {step === 2 && (
            <fieldset>
              <legend className="mb-4 text-lg font-semibold">
                Masa aktif yang disukai
              </legend>
              <label htmlFor="finder-validity" className="sr-only">
                Preferensi masa aktif
              </label>
              <select
                id="finder-validity"
                value={requirements.preferredValidity}
                onChange={(event) => {
                  const days = Number(event.target.value);
                  setRequirements({
                    ...requirements,
                    preferredValidity: days,
                    minValidity: requirements.minValidity ? days : 0,
                  });
                }}
                className={field}
              >
                {[0, 7, 14, 28, 30, 60].map((days) => (
                  <option key={days} value={days}>
                    {days ? days + " hari" : "Tidak ada preferensi"}
                  </option>
                ))}
              </select>
              <label className="mt-4 flex min-h-12 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  disabled={!requirements.preferredValidity}
                  checked={requirements.minValidity > 0}
                  onChange={(event) =>
                    setRequirements({
                      ...requirements,
                      minValidity: event.target.checked
                        ? requirements.preferredValidity
                        : 0,
                    })
                  }
                  className="size-5 accent-primary"
                />
                Wajib minimal masa aktif yang dipilih
              </label>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Tanpa syarat wajib, masa aktif lain dapat muncul dengan
                penjelasan. Syarat wajib menetapkan batas minimum, bukan masa
                aktif tepat.
              </p>
            </fieldset>
          )}
          {step === 3 && (
            <fieldset>
              <legend className="mb-4 text-lg font-semibold">
                Merek pilihanmu
              </legend>
              <label htmlFor="finder-brand" className="sr-only">
                Preferensi merek
              </label>
              <select
                id="finder-brand"
                value={requirements.preferredBrand}
                onChange={(event) => {
                  const brand = event.target.value as Brand | "all";
                  setRequirements({
                    ...requirements,
                    preferredBrand: brand,
                    requiredBrand:
                      requirements.requiredBrand !== "all" ? brand : "all",
                  });
                }}
                className={field}
              >
                <option value="all">No Brand Preference / Semua merek</option>
                {Object.entries(brandNames).map(([brand, label]) => (
                  <option key={brand} value={brand}>
                    {label}
                  </option>
                ))}
              </select>
              <label className="mt-4 flex min-h-12 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  disabled={requirements.preferredBrand === "all"}
                  checked={requirements.requiredBrand !== "all"}
                  onChange={(event) =>
                    setRequirements({
                      ...requirements,
                      requiredBrand: event.target.checked
                        ? requirements.preferredBrand
                        : "all",
                    })
                  }
                  className="size-5 accent-primary"
                />
                Hanya merek pilihan (syarat wajib)
              </label>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Semua merek diperingkat dengan aturan yang sama. Rekomendasi
                selalu mengecualikan paket tidak tersedia.
              </p>
            </fieldset>
          )}
          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => go(step - 1)}
              className="min-h-12 rounded-xl"
            >
              <ArrowLeft aria-hidden="true" />
              Kembali
            </Button>
            <Button
              type="submit"
              disabled={!validBudget}
              className="min-h-12 rounded-xl"
            >
              {step === 3 ? "Lihat rekomendasi" : "Lanjut"}
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-6 rounded-2xl border bg-white p-5">
            <h3 className="mb-3 font-bold">Ringkasan kebutuhan</h3>
            <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs text-muted-foreground">
                  Batas anggaran 30 hari
                </dt>
                <dd className="mt-1 font-semibold">
                  {formatPrice(requirements.budget)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Aktivitas</dt>
                <dd className="mt-1 font-semibold">
                  {usageNames[requirements.usage]}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  Preferensi masa aktif
                </dt>
                <dd className="mt-1 font-semibold">
                  {requirements.preferredValidity
                    ? requirements.preferredValidity + " hari"
                    : "Bebas"}
                  {requirements.minValidity > 0 && " · minimum wajib"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Merek</dt>
                <dd className="mt-1 font-semibold">
                  {requirements.preferredBrand === "all"
                    ? "Semua merek"
                    : brandNames[requirements.preferredBrand]}
                  {requirements.requiredBrand !== "all" && " · wajib"}
                </dd>
              </div>
            </dl>
          </div>
          <div className="mb-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="min-h-12 rounded-xl"
              onClick={() => go(0)}
            >
              Ubah kebutuhan
            </Button>
            <Button
              variant="ghost"
              className="min-h-12 rounded-xl"
              onClick={reset}
            >
              Mulai ulang
            </Button>
            <ComparisonSummary />
          </div>
          <p className="mb-5 text-xs leading-6 text-muted-foreground">
            Peringkat: kecocokan aktivitas 40, masa aktif 20, nilai kuota/harga
            hingga 20, preferensi merek 10. Tanpa preferensi, tidak ada bonus
            merek. Urutan seri: harga lebih rendah, lalu ID produk. Skor adalah
            aturan demo, bukan penilaian kualitas jaringan.
          </p>
          <div aria-live="polite">
            {recommendations.length ? (
              <>
                <p className="mb-4 text-sm font-semibold">
                  {recommendations.length} rekomendasi yang memenuhi syarat
                </p>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {recommendations.map((result, index) => (
                    <div
                      key={result.product.id}
                      className="flex min-w-0 flex-col gap-4"
                    >
                      <div className="rounded-xl border bg-white p-4">
                        <p className="mb-3 font-semibold text-primary">
                          #{index + 1} · Skor {result.score}
                        </p>
                        <ul className="space-y-2 text-xs leading-6 text-muted-foreground">
                          {result.reasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                        <p className="mt-3 border-t pt-3 text-xs font-semibold">
                          Estimasi 30 hari: {formatPrice(result.monthlyCost)}
                        </p>
                      </div>
                      <CatalogProductCard
                        product={result.product}
                        order={index}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                title="Belum ada paket yang memenuhi kebutuhan"
                description="Kami tidak menampilkan paket di luar anggaran atau syarat wajib. Naikkan anggaran, ubah masa aktif, atau lepaskan syarat merek/minimum masa aktif secara eksplisit."
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button
                      className="min-h-12 rounded-xl"
                      onClick={() => go(0)}
                    >
                      Ubah anggaran
                    </Button>
                    <Button
                      variant="outline"
                      className="min-h-12 rounded-xl"
                      onClick={() =>
                        setRequirements({
                          ...requirements,
                          minValidity: 0,
                          requiredBrand: "all",
                        })
                      }
                    >
                      Lepaskan syarat wajib
                    </Button>
                  </div>
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
