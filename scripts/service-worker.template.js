/* Generated after next build. Cache only public release artifacts. */
const CONFIG = /*__PWA_CONFIG__*/ null;
const PREFIX = "xlsmart-public-";
const CACHE = PREFIX + CONFIG.version;
const READY = "/__xlsmart_offline_ready__";
const ROUTES = new Set(CONFIG.routes);
const DENIED = /^\/(api|auth|login|register|registration|registrasi|activation|activate|account)(\/|$)/i;
const absolute = (path) => new URL(path, self.location.origin).href;

async function cached(path) {
  const current = await caches.open(CACHE);
  return current.match(absolute(path), { ignoreVary: true });
}
async function cachedAsset(request) {
  const ownNames = (await caches.keys()).filter((name) => name.startsWith(PREFIX));
  for (const name of [CACHE, ...ownNames.filter((name) => name !== CACHE).reverse()]) {
    const response = await (await caches.open(name)).match(request.url, { ignoreVary: true });
    if (response) return response;
  }
}
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      // Small batches limit peak memory/network pressure on tablets.
      for (let offset = 0; offset < CONFIG.urls.length; offset += 6) {
        await Promise.all(CONFIG.urls.slice(offset, offset + 6).map(async (path) => {
          const response = await fetch(new Request(absolute(path), { credentials: "omit", cache: "reload", headers: { Accept: ROUTES.has(path) ? "text/html" : "*/*" } }));
          if (!response.ok || response.redirected || response.type === "opaque") throw new Error("Precache failed: " + path);
          if (ROUTES.has(path) && !(response.headers.get("content-type") || "").includes("text/html")) throw new Error("Expected public HTML: " + path);
          await cache.put(absolute(path), response);
        }));
      }
      await cache.put(absolute(READY), new Response(JSON.stringify({ version: CONFIG.version }), { headers: { "Content-Type": "application/json" } }));
    } catch (error) {
      await caches.delete(CACHE);
      throw error;
    }
    // Updates deliberately wait for user consent; first install activates normally.
  })());
});
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = (await caches.keys()).filter((name) => name.startsWith(PREFIX) && name !== CACHE);
    // Keep one preceding release so another open tab can finish its old chunks.
    await Promise.all(names.slice(0, -1).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener("message", (event) => {
  if (!event.source || new URL(event.source.url).origin !== self.location.origin) return;
  if (event.data?.type === "SKIP_WAITING") event.waitUntil(self.skipWaiting());
  if (event.data?.type === "GET_STATUS") event.waitUntil((async () => {
    const ready = Boolean(await cached(READY));
    event.ports[0]?.postMessage({ type: "PWA_STATUS", ready, version: CONFIG.version });
  })());
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || request.headers.has("authorization") || DENIED.test(url.pathname)) return;
  const path = url.pathname.replace(/\/$/, "") || "/";
  const isFlight = request.headers.has("rsc") || request.headers.has("next-router-prefetch") || request.headers.has("next-router-segment-prefetch") || url.searchParams.has("_rsc");
  if (request.mode === "navigate" || (ROUTES.has(path) && isFlight)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) return response;
        if (isFlight) return response;
        if (!ROUTES.has(path)) return response;
      } catch { /* Offline: use the installed release only. */ }
      // HTML for an RSC failure intentionally lets Next fall back to document navigation.
      const response = ROUTES.has(path) ? await cached(path) : null;
      return response || await cached("/offline.html") || new Response("Offline. Buka aplikasi saat online untuk menyiapkan cache.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    })());
    return;
  }
  if (!url.search && (url.pathname.startsWith("/_next/static/") || CONFIG.urls.includes(url.pathname))) {
    event.respondWith((async () => await cachedAsset(request) || fetch(request))());
  }
  // No runtime writes: no query strings, form submissions, external origins or customer data.
});
