import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { offlineRoutes, localAssets } from "./pwa-settings.mjs";

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => entry.isDirectory() ? filesIn(directory + "/" + entry.name) : [directory + "/" + entry.name]));
  return nested.flat();
}
const manifest = JSON.parse(await readFile(".next/prerender-manifest.json", "utf8"));
for (const route of offlineRoutes) {
  const entry = manifest.routes[route];
  if (!entry || entry.compute !== "static" || entry.response !== "complete" || (entry.initialStatus && entry.initialStatus !== 200)) {
    throw new Error("Offline route must be a complete public static document: " + route);
  }
}
const staticFiles = (await filesIn(".next/static")).filter((path) => /\.(js|css|woff2?|png|svg|webp|ico)$/.test(path)).sort();
const staticAssets = staticFiles.map((path) => path.replace(".next/static/", "/_next/static/"));
const urls = [...offlineRoutes, ...staticAssets, ...localAssets];
const template = await readFile("scripts/service-worker.template.js", "utf8");
const buildId = (await readFile(".next/BUILD_ID", "utf8")).trim();
const hash = createHash("sha256").update(buildId).update(template).update(JSON.stringify(urls));
for (const asset of localAssets.filter((url) => !["/manifest.webmanifest", "/icon.svg", "/favicon.ico"].includes(url))) hash.update(await readFile("public" + asset));
const version = hash.digest("hex").slice(0, 16);
const output = template.replace("/*__PWA_CONFIG__*/ null", JSON.stringify({ version, routes: offlineRoutes, urls }));
await writeFile("public/sw.js", output);
console.log("PWA release " + version + ": " + offlineRoutes.length + " public pages, " + staticAssets.length + " bundled assets. No runtime data caching.");
