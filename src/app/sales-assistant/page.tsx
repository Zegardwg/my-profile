import type { Metadata } from "next";
import { CustomerPage } from "@/components/trust/customer-page";
import { ConversationAssistant } from "@/components/trust/conversation-assistant";
export const metadata: Metadata = {
  title: "Percakapan Layanan | XLSMART Personal Sales Kit",
};
export default function Page() {
  return (
    <CustomerPage
      title="Dengarkan dulu. Jelaskan dengan jujur."
      eyebrow="Pendamping percakapan layanan"
      description="Tanggapi pertanyaan pelanggan dengan empati, penjelasan yang dapat diperiksa, dan langkah yang menghormati keputusan mereka."
      current="/sales-assistant"
    >
      <ConversationAssistant />
    </CustomerPage>
  );
}
