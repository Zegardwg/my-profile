import { CustomerTrustHub } from "@/features/home/components/customer-trust-hub";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { HeroSection } from "@/features/home/components/hero-section";
import { SmartPackageFinder } from "@/features/catalog/components/smart-package-finder";
import { FeaturedPackages } from "@/features/catalog/components/featured-packages";
import { RegistrationEducation } from "@/features/home/components/registration-education";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-60 -translate-y-24 rounded-xl bg-primary px-5 py-3 font-semibold text-white focus:translate-y-0"
      >
        Langsung ke konten
      </a>
      <AppHeader />
      <main id="main-content" tabIndex={-1}>
        <div id="beranda" className="page-container pt-7 sm:pt-9">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>YOUR EVERYDAY CONNECTION COMPANION</p>
            <span className="flex items-center gap-2">
              <span
                className="size-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              Mode presentasi · Data demo
            </span>
          </div>
          <HeroSection />
          <SmartPackageFinder />
          <FeaturedPackages />
          <RegistrationEducation />
          <CustomerTrustHub />
        </div>
      </main>
      <AppFooter />
    </>
  );
}
