export async function showRecommendations(
  page,
  { budget = "100000", usage, status } = {},
) {
  await page.getByLabel("Anggaran maksimum (Rupiah)").fill(budget);
  if (status)
    await page.getByLabel("Status informasi paket").selectOption(status);
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  if (usage) await page.getByLabel(usage, { exact: true }).check();
  for (let step = 0; step < 2; step++) {
    await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  }
  await page
    .getByRole("button", { name: "Lihat rekomendasi", exact: true })
    .click();
}
