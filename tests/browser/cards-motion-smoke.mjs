import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
const { chromium } = await import(
  pathToFileURL(process.env.XLSMART_PLAYWRIGHT_MODULE + "/index.mjs").href
);
const browser = await chromium.launch({ channel: "msedge", headless: true });
const origin = process.env.XLSMART_QA_URL || "http://localhost:3100";
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1100 },
    deviceScaleFactor: 2,
  });
  await page.goto(origin);
  await page.waitForLoadState("networkidle");
  const card = page.locator("main:visible .package-card").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    [...document.querySelectorAll("main article.product-card-entry")].every(
      (e) => e.dataset.reveal === "visible",
    ),
  );
  await page
    .locator("main:visible article.product-card-entry")
    .evaluateAll((elements) =>
      Promise.all(
        elements.flatMap((e) =>
          e.getAnimations().map((animation) => animation.finished),
        ),
      ),
    );
  assert.ok(
    await card.evaluate((element) =>
      getComputedStyle(
        element.querySelector(".package-quota"),
      ).fontFamily.includes("Plus Jakarta Sans"),
    ),
  );
  assert.ok(
    await card.evaluate((element) =>
      getComputedStyle(
        element.querySelector(".package-name"),
      ).fontFamily.includes("Inter"),
    ),
  );
  const revealDuration = await page
    .locator("main:visible article.product-card-entry")
    .first()
    .evaluate((element) => getComputedStyle(element).animationDuration);
  assert.equal(revealDuration, "0.52s");
  await card.hover();
  await page.waitForFunction(() => {
    const card = document.querySelector("main .package-card");
    return new DOMMatrixReadOnly(getComputedStyle(card).transform).m42 < -5;
  });
  await page.mouse.move(0, 0);
  await card.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
  const colors = await page
    .locator("main:visible .package-card")
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).backgroundImage),
    );
  assert.equal(new Set(colors).size, 3);
  for (const article of await page
    .locator("main:visible article.product-card-entry")
    .all()) {
    assert.ok(
      await article
        .getByText("DATA DEMO - BUKAN PENAWARAN RESMI", { exact: true })
        .isVisible(),
    );
    for (const button of await article.getByRole("button").all())
      assert.ok((await button.boundingBox()).height >= 44);
  }
  await page
    .locator('#paket [role="tabpanel"]:visible > .grid')
    .screenshot({ path: "docs/qa/cards-refresh-desktop.png" });
  await page.setViewportSize({ width: 375, height: 812 });
  await card.scrollIntoViewIfNeeded();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await card.screenshot({ path: "docs/qa/cards-refresh-mobile.png" });
  await page.close();
  const reduced = await browser.newPage({
    viewport: { width: 768, height: 1024 },
    reducedMotion: "reduce",
  });
  await reduced.goto(origin + "/catalog");
  await reduced.waitForLoadState("networkidle");
  await reduced.locator(".package-card").first().scrollIntoViewIfNeeded();
  const motion = await reduced
    .locator(".product-card-entry")
    .first()
    .evaluate((element) => ({
      opacity: getComputedStyle(element).opacity,
      animation: getComputedStyle(element).animationName,
    }));
  assert.equal(motion.opacity, "1");
  assert.equal(motion.animation, "none");
  assert.ok(
    await reduced.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  console.log(
    "PASS branded surfaces, typography, staggered entry, hover, demo visibility, 44px controls, mobile overflow, reduced-motion fallback",
  );
  await reduced.close();
} finally {
  await browser.close();
}
