// Explicit public-document allowlist; never discover pages from customer URLs.
export const offlineRoutes = ["/", "/catalog", "/finder", "/compare", "/trust", "/promoter", "/activation-guide", "/sales-assistant"];
export const localAssets = ["/manifest.webmanifest", "/icon.svg", "/favicon.ico", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-512.png", "/images/package-placeholder.svg", "/offline.html"];
export const cachePrefix = "xlsmart-public-";
