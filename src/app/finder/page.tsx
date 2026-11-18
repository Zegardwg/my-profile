import type { Metadata } from "next";
import { ToolPage } from "@/components/shared/tool-page";
import { FinderWizard } from "@/components/finder/finder-wizard";
export const metadata: Metadata = {
  title: "Smart Package Finder | XLSMART Personal Sales Kit",
};
export default function FinderPage() {
  return (
    <ToolPage
      title="Paket yang sesuai dimulai dari kamu."
      eyebrow="Smart Package Finder"
      description="Empat pilihan kebutuhan, lalu maksimal tiga contoh paket. Rekomendasi transparan dengan aturan lokal, tanpa AI eksternal atau data pribadi."
    >
      <FinderWizard />
    </ToolPage>
  );
}
