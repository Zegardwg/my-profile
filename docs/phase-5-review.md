# Phase 5 — Offline PWA & Tablet Optimization

Reviewed and implemented on 18 November 2026.

## Compatibility and preserved features

Installed Next.js **16.4.6**, React 19.3.0 and Turbopack were inspected against
`node_modules/next/dist/docs/01-app/02-guides/progressive-web-apps.md`, the manifest
file convention and the headers reference. Cache Components, Partial Prefetching,
the existing Tailwind loader, routes, design tokens and local recommendation
rules remain enabled. No webpack override or legacy PWA dependency was added.

Previous phases were verified through existing unit and browser suites: 18 demo
products; brand, keyword, price, quota, validity and availability filters; five-step
finder and transparent recommendations; maximum-three comparison; promoter demo
profile; trust FAQ; official-channel education; conversation assistant and customer
presentation controls. Existing personal-tool and demo disclaimers remain visible.
Previously started PWA and comparison-storage files were completed and integrated.

## Implementation

- `src/app/manifest.ts` defines the identity, scope, standalone mode, any orientation,
  Indonesian language, theme/background colors and local 192/512/maskable PNG icons.
- `src/app/layout.tsx` adds viewport/theme metadata, app installation metadata and
  the PWA provider. The existing page architecture and server components remain.
- `src/components/pwa/` provides connectivity and cache readiness, Android install
  instructions, deferred install prompt, manual update checks and explicit update
  application. Client support detection uses `useSyncExternalStore`.
- `scripts/generate-pwa.mjs` runs **after every successful production build**. It
  validates each allowlisted page is a complete static HTML document in the actual
  Next prerender manifest, inventories the emitted static chunks/fonts/CSS, then
  creates a versioned `public/sw.js`. Build ID, template and local assets contribute
  to the release hash. Generated worker output is ignored by Git.
- `scripts/service-worker.template.js` precaches Home, Catalog, Finder, Compare,
  Trust, Promoter, Activation Guide and Sales Assistant, plus bundled application
  assets, local icons, local placeholder and `public/offline.html`.
- Installation is atomic from the user's perspective: readiness is published only
  after all URLs load successfully; a failed install deletes its incomplete cache.
  Small batches bound concurrent download pressure on tablets.
- Public documents use network first with cached-document fallback. Local release
  assets use cache first. Offline in-app links use full document navigation to
  avoid storing context-dependent Next Flight responses. Unexpected Flight network
  failures also return the cached HTML so Next can fall back to document navigation.
  Unknown pages receive the local fallback; registration/auth routes bypass it.
- Updates wait while an existing version is active. Applying an update reloads only
  after the button is pressed; unfinished finder steps reset, while validated demo
  product IDs in comparison persist. One previous public release remains available
  for old chunks in another open tab; unrelated caches are never deleted.
- `src/config/catalog-metadata.ts` records the demo dataset's editorial date, shown
  on catalog/finder/compare. A client-side clock check warns after 30 days or for an
  invalid/future device date. This is not a live operator offer verification.
- Tablet navigation keeps the existing accessible drawer; touch controls, responsive
  grids and the separately scrollable comparison table remain. Safe-area padding
  and header-aware finder focus scrolling were added. Portrait and landscape are
  supported without locking orientation or disabling zoom.
- Finder recommendations are memoized across step changes. Existing route splitting,
  lazy route loading, tree-shaken icons, inline/CSS placeholders and reduced-motion
  behavior are preserved. No image library or PWA runtime library was added.
  The measured release contained 34 static assets, about 1.22 MB raw in total,
  including about 0.85 MB JavaScript across **all** routes (not a per-page transfer
  size). HTML and small public assets are additional. Fonts are bundled by
  `next/font`; they do not require Google/CDN requests during app use.

## Data and security boundaries

Cache writes happen only during installation against explicit public URLs, with
credentials omitted. No runtime responses, query-string URLs, form submissions,
APIs, external registration/authentication pages or authorization requests are
written. Sensitive registration/auth/activation paths bypass worker interception.
There is no identity, NIK, KTP, OTP or biometric storage, no registration queue, no
camera request and no simulated biometric verification. The only application
localStorage value contains up to three known demo product IDs.

The Permissions Policy disables camera, microphone and geolocation. Responses have
nosniff, frame protection, referrer policy and production HSTS headers. `/sw.js` is
served with no-store/no-cache, a same-origin CSP and root scope. Production hosting
must terminate **HTTPS** and preserve these headers; HSTS does not provision TLS.
External official links require internet and are blocked with an explanation while
the browser reports offline. No external HTTP requests were observed in acceptance
runs. Service worker caching never extends to external origins.

## Verification

| Check | Result |
| --- | --- |
| ESLint | Passed, no errors or warnings |
| `next typegen && tsc --noEmit` | Passed |
| Unit tests | 43 passed, 0 failed |
| Production build | Passed with Turbopack; all eight offline pages complete/static |
| Chromium installability | No installability errors in a fresh persistent Edge profile |
| Manifest and local icons | Standalone/start URL and actual decoded 192/512 dimensions passed |
| First visit precache | All pages/assets cached after visiting only Home |
| Cold offline navigation | HTTP cache cleared, network disabled; all eight pages rendered |
| Tablet/mobile layouts | 768x1024, 1024x768, 800x1280, 1280x800, 375x812; no page overflow |
| Offline catalog | Search, brand, combined price/availability filters and sorting passed |
| Offline finder | Recommendations with mandatory brand/validity requirements passed |
| Offline comparison | Three products, seven attribute rows, link navigation and reload persistence passed |
| Offline fallback | Unknown-page fallback and locally cached image decoded successfully |
| Registration limits | Official link blocked offline; no fields, camera, external requests or popup |
| Catalog freshness | Expired date warning verified using a simulated January 2027 device clock |
| Repeat visit | A new page in the existing profile was already controlled by the worker |
| App update | Second worker waited; old release stayed active until explicit apply; new release worked offline and comparison persisted |
| Phase 3 regression | Existing catalog/finder/compare browser suite passed |
| Phase 4 regression | Existing trust/presentation/accessibility browser suite passed |
| Card presentation regression | Branded cards, animation, hover, touch targets and reduced motion passed |
| Browser runtime errors | None in passing acceptance runs |

The worker tests additionally exercise partial-install cleanup, cache namespace
retention, sensitive-request exclusions, Flight fallback and same-origin update
messages. Node 24 emits the existing non-fatal module-type warning when importing
TypeScript domain modules in tests; all assertions pass.

Screenshots: [offline comparison landscape](qa/phase5-compare-offline-landscape.png)
and [offline finder portrait](qa/phase5-finder-offline-portrait.png).

## Run and deploy

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run start -- --port 3100
```

In another terminal, with Playwright available and Edge installed:

```powershell
$env:XLSMART_PLAYWRIGHT_MODULE = 'C:/path/to/node_modules/playwright'
$env:XLSMART_QA_URL = 'http://localhost:3100'
npm.cmd run test:browser:pwa
npm.cmd run test:browser
npm.cmd run test:browser:trust
```

Run the PWA browser test serially against a disposable local production server. It
uses a fresh temporary persistent browser profile (headless incognito cannot be
installed), clears the HTTP cache and disables networking. The Edge CDP network
emulation also sets `navigator.onLine` correctly for offline status checks. The
update test temporarily writes another worker version and restores it in `finally`;
it must not run against a live shared deployment or concurrently with another
worker-writing test. `XLSMART_QA_URL` must point at the server serving this checkout
for that update test. `npm.cmd run pwa:icons` regenerates the committed local icons
and placeholder using the existing installed Sharp dependency.

Deploy the complete result of `npm run build`, including generated `public/sw.js`,
`public` assets and matching `.next` output. Keep hashed release assets available
during a rolling deployment. Do not run bare `next build` and omit generation.
`next dev` unregisters the app's production worker and clears only its public
release caches on the same origin so HMR is not intercepted.

For first use, open online and wait for **Siap digunakan offline**, then install
through the app or Chrome's Add to Home Screen menu. Browser cache eviction can
remove offline files, so check readiness before leaving connectivity. An initial
visit with no prior cache requires internet. Unfinished finder state is intentionally
not persisted. No background customer-data synchronization is implemented.

These are desktop Chromium/Edge tests with touch-enabled tablet viewports. Physical
Android installation, OS home-screen launch, storage eviction and deployed HTTPS
certificate/proxy behavior still need device/deployment acceptance testing. No
production deployment or physical-device test is claimed.
