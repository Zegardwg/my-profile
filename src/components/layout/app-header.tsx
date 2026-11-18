import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { navigation } from "@/config/navigation";
import { MobileNavigation } from "./mobile-navigation";
import { PwaStatus } from "@/components/pwa/pwa-status";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="page-container flex min-h-22 items-center justify-between gap-5">
        <Link
          href="/"
          aria-label="XLSMART Personal Sales Kit, beranda"
          className="inline-flex min-h-11 items-center rounded-lg"
        >
          <BrandMark />
        </Link>
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-4 xl:gap-6 xl:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-12 items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/finder"
            className="action-link hidden bg-primary text-white hover:bg-navy sm:inline-flex"
          >
            Temukan paket <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
          <MobileNavigation />
        </div>
      </div>
      <PwaStatus />
    </header>
  );
}
