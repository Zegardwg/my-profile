// Explicit public-document allowlist; never discover pages from customer URLs.
export const offlineRoutes = ["/", "/finder", "/compare", "/trust", "/promoter", "/activation-guide", "/sales-assistant", "/management"];
export const localAssets = ["/manifest.webmanifest", "/icon.svg", "/favicon.ico", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-512.png", "/images/package-placeholder.svg", "/offline.html", "/images/qris-merchant.png", ...["axis", "xl", "smartfren"].map(brand => "/images/products/" + brand + ".webp"), ...Array.from({ length: 9 }, (_, page) => "/images/registrasi/" + String(page).padStart(2, "0") + ".webp")];
export const cachePrefix = "xlsmart-public-";
