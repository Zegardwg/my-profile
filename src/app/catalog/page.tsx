import type { Metadata } from "next";
import { ToolPage } from "@/components/shared/tool-page";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
export const metadata: Metadata = {
  title: "Katalog Demo | XLSMART Personal Sales Kit",
};
export default function CatalogPage() {
  return (
    <ToolPage
      title="Pilihan koneksi, dalam satu katalog."
      eyebrow="Eksplorasi paket demo"
      description="Bandingkan contoh paket XL, Smartfren, dan AXIS. Sesuaikan harga, kuota, dan masa aktif untuk mendukung presentasimu."
    >
      <CatalogBrowser />
    </ToolPage>
  );
}
