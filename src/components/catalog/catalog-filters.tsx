"use client";
import type { ProductFilters } from "@/types/product";
import { Button } from "@/components/ui/button";
const fieldClass = "min-h-12 w-full rounded-xl border bg-white px-3 text-sm";
export function CatalogFilters({
  value,
  onChange,
  onClear,
  prefix,
}: {
  value: ProductFilters;
  onChange: (next: ProductFilters) => void;
  onClear: () => void;
  prefix: string;
}) {
  function numeric(
    key: "minPrice" | "maxPrice" | "minQuota" | "minValidity",
    raw: string,
  ) {
    const clearedMaximum = key === "maxPrice" && raw === "";
    onChange({ ...value, [key]: clearedMaximum ? Infinity : Math.max(0, Number(raw) || 0) });
  }
  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor={prefix + "-information"}
          className="mb-2 block text-xs font-semibold"
        >
          Status informasi
        </label>
        <select
          id={prefix + "-information"}
          className={fieldClass}
          value={value.informationStatus ?? "all"}
          onChange={(e) =>
            onChange({
              ...value,
              informationStatus: e.target
                .value as ProductFilters["informationStatus"],
            })
          }
        >
          <option value="all">Semua informasi</option>
          <option value="demo">Data demo</option>
          <option value="verified">Diperiksa manual</option>
        </select>
      </div>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">
          Rentang harga paket (Rp)
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={prefix + "-min"}
              className="mb-2 block text-xs text-muted-foreground"
            >
              Minimum
            </label>
            <input
              id={prefix + "-min"}
              type="number"
              min="0"
              step="1000"
              value={value.minPrice}
              onChange={(event) => numeric("minPrice", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label
              htmlFor={prefix + "-max"}
              className="mb-2 block text-xs text-muted-foreground"
            >
              Maksimum
            </label>
            <input
              id={prefix + "-max"}
              type="number"
              min="0"
              step="1000"
              placeholder="Tanpa batas"
              value={Number.isFinite(value.maxPrice) ? value.maxPrice : ""}
              onChange={(event) => numeric("maxPrice", event.target.value)}
              className={fieldClass}
            />
          </div>
        </div>
        {value.minPrice > value.maxPrice && (
          <p role="status" className="mt-2 text-xs text-destructive">
            Minimum melebihi maksimum. Sesuaikan rentang harga.
          </p>
        )}
      </fieldset>
      <div>
        <label
          htmlFor={prefix + "-quota"}
          className="mb-2 block text-sm font-semibold"
        >
          Kuota utama minimum
        </label>
        <select
          id={prefix + "-quota"}
          value={value.minQuota}
          onChange={(event) => numeric("minQuota", event.target.value)}
          className={fieldClass}
        >
          {[0, 5, 15, 30, 50, 80].map((amount) => (
            <option key={amount} value={amount}>
              {amount ? amount + " GB" : "Semua kuota"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor={prefix + "-validity"}
          className="mb-2 block text-sm font-semibold"
        >
          Masa aktif minimum
        </label>
        <select
          id={prefix + "-validity"}
          value={value.minValidity}
          onChange={(event) => numeric("minValidity", event.target.value)}
          className={fieldClass}
        >
          {[0, 7, 14, 28, 30, 60].map((days) => (
            <option key={days} value={days}>
              {days ? days + " hari" : "Semua masa aktif"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor={prefix + "-availability"}
          className="mb-2 block text-sm font-semibold"
        >
          Ketersediaan paket
        </label>
        <select
          id={prefix + "-availability"}
          value={value.availability}
          onChange={(event) =>
            onChange({
              ...value,
              availability: event.target
                .value as ProductFilters["availability"],
            })
          }
          className={fieldClass}
        >
          <option value="all">Semua status</option>
          <option value="available">Tersedia</option>
          <option value="unavailable">Tidak tersedia</option>
        </select>
      </div>
      <Button
        variant="outline"
        className="min-h-12 w-full rounded-xl"
        onClick={onClear}
      >
        Bersihkan semua filter
      </Button>
    </div>
  );
}
