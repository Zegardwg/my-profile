"use client";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brandStyles } from "../data/demo-packages";

export function BrandSelector() {
  return (
    <TabsList
      aria-label="Filter paket berdasarkan merek"
      className="grid h-auto! w-full! grid-cols-2 gap-2 rounded-2xl border bg-white p-2 sm:grid-cols-4"
    >
      <TabsTrigger
        value="all"
        className="min-h-14 rounded-xl px-3 data-active:bg-navy data-active:text-white"
      >
        Semua merek
      </TabsTrigger>
      {Object.entries(brandStyles).map(([id, brand]) => (
        <TabsTrigger
          key={id}
          value={id}
          className="min-h-14 gap-2 rounded-xl px-3 data-active:bg-secondary data-active:text-primary"
        >
          <span
            className={["font-heading text-lg font-extrabold", brand.text].join(
              " ",
            )}
          >
            {brand.label}
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Paket
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
