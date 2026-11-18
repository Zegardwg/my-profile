import { Info } from "lucide-react";
import { DEMO_LABEL } from "@/data/demo-products";
export function DemoNotice() {
  return (
    <aside
      aria-label="Informasi demonstrasi"
      className="mb-7 flex gap-3 rounded-xl border border-primary/15 bg-secondary p-4 text-xs leading-6 text-muted-foreground"
    >
      <Info className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
      <p>
        <strong className="block text-navy">{DEMO_LABEL}</strong>Alat presentasi
        personal, bukan situs resmi atau bukti status karyawan XLSMART. Seluruh
        harga, manfaat, dan ketersediaan fiktif. Registrasi hanya melalui kanal
        resmi perusahaan.
      </p>
    </aside>
  );
}
