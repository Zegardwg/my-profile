import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { DemoNotice } from "./demo-notice";
import { CatalogFreshness } from "@/components/catalog/catalog-freshness";
export function ToolPage({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
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
        <p className="eyebrow mb-3 text-primary">{eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 mb-7 max-w-2xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
        <DemoNotice />
        <CatalogFreshness />
        {children}
      </main>
      <AppFooter />
    </>
  );
}
