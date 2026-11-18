import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { trustContent } from "@/config/customer-trust";
import { CustomerNavigation } from "./customer-navigation";
export function CustomerPage({
  title,
  eyebrow,
  description,
  current,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
  current: string;
  children: ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-60 -translate-y-24 rounded-xl bg-primary px-5 py-3 text-white focus:translate-y-0"
      >
        Langsung ke konten
      </a>
      <AppHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="page-container min-w-0 py-8 sm:py-12"
      >
        <CustomerNavigation current={current} />
        <p className="eyebrow mb-3 text-primary">{eyebrow}</p>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 mb-6 max-w-2xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
        <aside
          aria-label="Status aplikasi personal"
          className="mb-8 rounded-xl border border-primary/15 bg-secondary p-4 text-xs leading-6 text-muted-foreground"
        >
          <strong className="block font-semibold text-navy">
            Presentasi personal · bukan kartu pegawai atau sistem registrasi
          </strong>
          {trustContent.personalDisclaimer}
        </aside>
        {children}
      </main>
      <AppFooter />
    </>
  );
}
