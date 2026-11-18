// Only non-sensitive product IDs are persisted; no filter text or customer information.
export const comparisonStorageKey = "xlsmart-comparison-ids-v1";
export function readComparisonIds(raw: string, validIds: readonly string[]): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is string => typeof id === "string" && validIds.includes(id)))].slice(0, 3);
  } catch { return []; }
}
