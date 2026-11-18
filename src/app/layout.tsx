import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ComparisonProvider } from "@/components/compare/comparison-provider";
import type { Viewport } from "next";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import { PwaUpdateNotice } from "@/components/pwa/pwa-status";
import { pwaConfig } from "@/config/pwa";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: pwaConfig.name,
  appleWebApp: { capable: true, statusBarStyle: "default", title: pwaConfig.shortName },
  icons: { apple: "/icons/icon-192.png" },
  title: "XLSMART • Personal Sales Kit",
  description:
    "Alat presentasi personal multi-brand. Seluruh paket dan harga merupakan data demo, bukan penawaran resmi operator.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: pwaConfig.themeColor,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={[inter.variable, jakarta.variable, "antialiased"].join(" ")}
    >
      <body>
        <PwaProvider>
          <ComparisonProvider>{children}</ComparisonProvider>
          <PwaUpdateNotice />
        </PwaProvider>
      </body>
    </html>
  );
}
