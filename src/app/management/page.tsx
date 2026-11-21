import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { SalesSettings } from "@/components/management/sales-settings";
export const metadata: Metadata = {
  title: "Pengaturan jual | XLSMART Personal Sales Kit",
};
export default function ManagementPage() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Langsung ke konten
      </a>
      <AppHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="page-container min-w-0 py-8 sm:py-12"
      >
        <h1 className="mb-6 text-3xl font-bold sm:text-4xl">Pengaturan jual</h1>
        <SalesSettings />
      </main>
      <AppFooter />
    </>
  );
}
