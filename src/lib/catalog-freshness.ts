export function catalogFreshness(updatedAt: string, today: string, maxAgeDays: number) {
  const updated = Date.parse(updatedAt + "T00:00:00Z");
  const now = Date.parse(today + "T00:00:00Z");
  if (!Number.isFinite(updated) || !Number.isFinite(now) || now < updated) return { ageDays: null, stale: true };
  const ageDays = Math.floor((now - updated) / 86400000);
  return { ageDays, stale: ageDays > maxAgeDays };
}
