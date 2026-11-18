import type { MetadataRoute } from "next";
import { pwaConfig } from "@/config/pwa";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/", name: pwaConfig.name, short_name: pwaConfig.shortName,
    description: pwaConfig.description, start_url: "/", scope: "/",
    display: "standalone", orientation: "any", lang: "id",
    theme_color: pwaConfig.themeColor, background_color: pwaConfig.backgroundColor,
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
