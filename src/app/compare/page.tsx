import type { Metadata } from "next";
import { ToolPage } from "@/components/shared/tool-page";
import { ComparisonTable } from "@/components/compare/comparison-table";
export const metadata: Metadata = {
  title: "Bandingkan Paket | XLSMART Personal Sales Kit",
};
export default function ComparePage() {
  return (
    <ToolPage
      title="Lebih jelas saat berdampingan."
      eyebrow="Perbandingan paket"
      description="Lihat harga, kuota, manfaat, dan batasan hingga tiga paket lokal. Perhatikan label demo atau pemeriksaan manual. Hanya ID paket pilihan yang disimpan di perangkat, tanpa data pelanggan."
    >
      <ComparisonTable />
    </ToolPage>
  );
}
