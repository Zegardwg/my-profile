import type { Metadata } from "next";
import { CustomerPage } from "@/components/trust/customer-page";
import { TrustCenter } from "@/components/trust/trust-center";
export const metadata: Metadata = {
  title: "Pusat Kepercayaan | XLSMART Personal Sales Kit",
};
export default function Page() {
  return (
    <CustomerPage
      title="Kepercayaan dimulai dari kejelasan."
      eyebrow="Pusat kepercayaan pelanggan"
      description="Ruang untuk memahami penawaran, memeriksa identitas secara mandiri, dan memilih tanpa tekanan."
      current="/trust"
    >
      <TrustCenter />
    </CustomerPage>
  );
}
