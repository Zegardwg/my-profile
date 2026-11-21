import { FeaturedPackages } from "@/features/catalog/components/featured-packages";
import { StarterGuide } from "@/features/home/components/starter-guide";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Langsung ke konten
      </a>
      <AppHeader />
      <main id="main-content" className="bg-white">
        <div className="page-container py-7 sm:py-12">
          <FeaturedPackages />
          <StarterGuide />
          <nav
            aria-label="Bantuan pelanggan"
            className="mt-5 flex flex-wrap gap-x-7 border-t pt-2 text-sm font-medium text-primary"
          >
            <Link
              className="inline-flex min-h-12 items-center"
              href="/activation-guide"
            >
              Panduan registrasi
            </Link>
            <Link className="inline-flex min-h-12 items-center" href="/trust">
              Pertanyaan pelanggan
            </Link>
          </nav>
        </div>
      </main>
      <AppFooter />
    </>
  );
}
