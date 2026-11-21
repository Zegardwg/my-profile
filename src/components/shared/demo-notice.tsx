"use client";
import { useCatalog } from "@/components/products/catalog-provider";
import { Info } from "lucide-react";
import { DEMO_LABEL } from "@/data/demo-products";
export function DemoNotice() {
  const { activeProducts } = useCatalog();
  return (
    <aside
      aria-label="Informasi demonstrasi"
      className="mb-7 flex gap-3 rounded-xl border border-primary/15 bg-secondary p-4 text-xs leading-6 text-muted-foreground"
    >
      <Info className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
      <p>
        <strong className="block text-navy">
          {activeProducts.every((p) => p.informationStatus === "demo")
            ? DEMO_LABEL
            : "KATALOG LOKAL - PERIKSA STATUS INFORMASI"}
        </strong>
        Alat presentasi personal, bukan situs resmi atau bukti status karyawan
        XLSMART. Perhatikan label setiap produk: demo berarti fiktif; diperiksa
        manual adalah catatan promotor, bukan verifikasi operator. Registrasi
        hanya melalui kanal resmi perusahaan.
      </p>
    </aside>
  );
}
