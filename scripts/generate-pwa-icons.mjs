import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Reuse the app's code-native X identity. No third-party artwork or AI image generation.
await mkdir("public/icons", { recursive: true });
await mkdir("public/images", { recursive: true });
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#093BCB"/><path d="m184 176 144 160m0-160L184 336" fill="none" stroke="white" stroke-width="40" stroke-linecap="round"/></svg>';
for (const size of [192, 512]) await sharp(Buffer.from(svg)).resize(size, size).png().toFile("public/icons/icon-" + size + ".png");
await sharp(Buffer.from(svg)).png().toFile("public/icons/icon-maskable-512.png");
const placeholder = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" rx="20" fill="#EDF2FF"/><rect x="59" y="24" width="42" height="72" rx="9" fill="white" stroke="#093BCB" stroke-width="3"/><path d="M68 49q12-12 24 0m-20 7q8-8 16 0m-12 7q4-4 8 0" fill="none" stroke="#093BCB" stroke-width="3" stroke-linecap="round"/></svg>';
await writeFile("public/images/package-placeholder.svg", placeholder);
console.log("Local PWA icons (192/512/maskable) and placeholder generated.");
