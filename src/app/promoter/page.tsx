import type { Metadata } from "next";
import { CustomerPage } from "@/components/trust/customer-page";
import { PromoterProfile } from "@/components/trust/promoter-profile";
export const metadata: Metadata = {
  title: "Profil Promotor | XLSMART Personal Sales Kit",
};
export default function Page() {
  return (
    <CustomerPage
      title="Kenali, lalu periksa secara mandiri."
      eyebrow="Profil promotor demo"
      description="Profil contoh untuk memperkenalkan layanan personal. Identitas dan penugasan sebenarnya harus diperiksa melalui kanal resmi perusahaan."
      current="/promoter"
    >
      <PromoterProfile />
    </CustomerPage>
  );
}
