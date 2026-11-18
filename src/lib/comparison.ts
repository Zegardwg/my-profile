export const MAX_COMPARISON = 3;
export function toggleComparison(
  ids: readonly string[],
  id: string,
  validIds: readonly string[],
): string[] {
  const safe = [...new Set(ids)]
    .filter((item) => validIds.includes(item))
    .slice(0, MAX_COMPARISON);
  if (!validIds.includes(id)) return safe;
  if (safe.includes(id)) return safe.filter((item) => item !== id);
  return safe.length < MAX_COMPARISON ? [...safe, id] : safe;
}
