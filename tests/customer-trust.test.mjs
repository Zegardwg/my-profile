import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  trustContent,
  activationSteps,
  conversationScripts,
  conversationSlides,
  profileSlides,
} from "../src/config/customer-trust.ts";

test("profile is clearly demo, unverified, and has no fabricated supervisor contact", () => {
  assert.match(trustContent.profile.displayName, /Contoh/);
  assert.match(trustContent.profile.area, /DATA DEMO/);
  assert.match(trustContent.identityDisclaimer, /DATA DEMO/);
  assert.equal(trustContent.profile.supervisorContact, null);
  assert.equal(
    trustContent.profile.verificationStatus,
    "Tidak diverifikasi oleh aplikasi",
  );
  for (const key of [
    "employeeId",
    "certificate",
    "verificationNumber",
    "badge",
  ])
    assert.equal(key in trustContent.profile, false);
});
test("personal disclaimer preserves required wording", () => {
  assert.equal(
    trustContent.personalDisclaimer,
    "Alat presentasi pribadi promotor. Identitas dan penugasan dapat diperiksa melalui kanal resmi perusahaan.",
  );
});
test("only independently sourced XL registration is enabled", () => {
  assert.equal(trustContent.registrationChannels.length, 3);
  assert.equal(
    trustContent.registrationChannels.find((item) => item.brand === "XL").url,
    "https://registrasi.xl.co.id/",
  );
  for (const item of trustContent.registrationChannels.filter(
    (item) => item.brand !== "XL",
  ))
    assert.equal(item.url, null);
});
test("references use exact approved official HTTPS hosts and include review date", () => {
  const hosts = new Set([
    "jdih.komdigi.go.id",
    "portal.komdigi.go.id",
    "www.xl.co.id",
    "registrasi.xl.co.id",
  ]);
  for (const source of Object.values(trustContent.references)) {
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:");
    assert.ok(hosts.has(url.hostname));
  }
  assert.equal(
    trustContent.references.xlRegistration.url,
    "https://registrasi.xl.co.id/",
  );
  assert.equal(
    trustContent.references.xlGuide.url,
    "https://www.xl.co.id/bantuan/produk/kartu-perdana/cara-registrasi-kartu-xl-prabayar",
  );
  assert.match(trustContent.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
});
test("seven educational stages stay in required order, with no fake active status", () => {
  assert.deepEqual(
    activationSteps.map((step) => step.id),
    [
      "choose",
      "review",
      "identity",
      "requirements",
      "choice",
      "external",
      "status",
    ],
  );
  assert.match(activationSteps[6].body, /sistem operator/);
  assert.match(
    activationSteps[6].detail,
    /tidak menampilkan konfirmasi aktivasi/,
  );
});
test("all cited reference IDs exist in centralized configuration", () => {
  const items = [
    ...activationSteps,
    ...conversationScripts,
    ...trustContent.faq,
  ];
  for (const item of items)
    for (const reference of item.references ?? [])
      assert.ok(reference in trustContent.references);
});
test("all seven concern categories have response, explanation, action and limits", () => {
  assert.equal(conversationScripts.length, 7);
  assert.equal(new Set(conversationScripts.map((item) => item.id)).size, 7);
  for (const item of conversationScripts)
    for (const field of [
      "category",
      "concern",
      "response",
      "explanation",
      "action",
      "neverPromise",
    ])
      assert.ok(item[field].length > (field === "category" ? 0 : 15));
});
test("presentation retains every customer concern and limitation", () => {
  const slides = conversationSlides(conversationScripts);
  for (let i = 0; i < slides.length; i++) {
    assert.equal(slides[i].body, conversationScripts[i].response);
    assert.ok(slides[i].detail.includes(conversationScripts[i].neverPromise));
  }
  assert.match(profileSlides[0].title, /DATA DEMO/);
});
test("refusal does not promise bypassing lawful activation requirements", () => {
  assert.match(trustContent.education.refusal, /tidak dapat dijanjikan aktif/);
  assert.match(
    conversationScripts.find((item) => item.id === "refuse").explanation,
    /tidak berarti persyaratan/,
  );
});
test("Phase 4 components contain no collection fields, iframe, camera or permission APIs", () => {
  const files = readdirSync(
    new URL("../src/components/trust/", import.meta.url),
  ).filter((file) => file.endsWith(".tsx"));
  for (const file of files) {
    const source = readFileSync(
      new URL("../src/components/trust/" + file, import.meta.url),
      "utf8",
    );
    assert.doesNotMatch(source, /<(input|textarea|form|iframe|video)\b/i, file);
    assert.doesNotMatch(
      source,
      /getUserMedia|getDisplayMedia|requestPermission|permissions\.request|capture\s*=/,
      file,
    );
    assert.doesNotMatch(source, /dangerouslySetInnerHTML/, file);
  }
});
