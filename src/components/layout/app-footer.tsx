import { BrandMark } from "@/components/shared/brand-mark";

export function AppFooter() {
  return (
    <footer className="border-t bg-white py-9">
      <div className="page-container">
        <div className="flex flex-wrap items-start justify-between gap-6"><BrandMark /><p className="max-w-lg text-xs leading-6 text-muted-foreground">Alat presentasi penjualan personal. Bukan situs resmi XL, Smartfren, AXIS, atau XLSMART dan bukan bukti status karyawan. Seluruh paket dan harga adalah data demonstrasi, bukan penawaran komersial.</p></div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-[11px] text-muted-foreground"><p>PERSONAL SALES KIT <span className="mx-2">/</span> V1.0 · UI DEMO</p><p>Eksplorasi dengan jelas. Pilih dengan paham.</p></div>
      </div>
    </footer>
  );
}

