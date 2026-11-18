import type { Metadata } from "next";
import { CustomerPage } from "@/components/trust/customer-page";
import { ActivationEducation } from "@/components/trust/activation-education";
export const metadata: Metadata = {
  title: "Panduan Registrasi | XLSMART Personal Sales Kit",
};
export default function Page() {
  return (
    <CustomerPage
      title="Pahami prosesnya. Tetap pegang kendali."
      eyebrow="Edukasi registrasi dan privasi"
      description="Panduan visual untuk percakapan sebelum registrasi. Seluruh ilustrasi adalah placeholder; tidak ada aktivasi atau pengambilan data di sini."
      current="/activation-guide"
    >
      <ActivationEducation />
    </CustomerPage>
  );
}
