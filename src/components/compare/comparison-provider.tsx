"use client";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { demoProducts } from "@/data/demo-products";
import { toggleComparison } from "@/lib/comparison";
import { comparisonStorageKey, readComparisonIds } from "@/lib/comparison-storage";
interface ComparisonState { ids: string[]; toggle: (id: string) => void; clear: () => void; }
const ComparisonContext = createContext<ComparisonState | null>(null);
const validIds = demoProducts.map((product) => product.id);
const changedEvent = "xlsmart-comparison-change";
let memory = "[]";
function snapshot() { try { return localStorage.getItem(comparisonStorageKey) ?? memory; } catch { return memory; } }
function serverSnapshot() { return "[]"; }
function subscribe(callback: () => void) {
  const changed = () => callback();
  const storage = (event: StorageEvent) => { if (event.key === comparisonStorageKey || event.key === null) callback(); };
  window.addEventListener(changedEvent, changed); window.addEventListener("storage", storage);
  return () => { window.removeEventListener(changedEvent, changed); window.removeEventListener("storage", storage); };
}
function write(ids: string[]) {
  memory = JSON.stringify(ids);
  try { localStorage.setItem(comparisonStorageKey, memory); } catch { /* In-memory mode when storage is unavailable. */ }
  window.dispatchEvent(new Event(changedEvent));
}
export function ComparisonProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const ids = useMemo(() => readComparisonIds(raw, validIds), [raw]);
  const toggle = useCallback((id: string) => write(toggleComparison(readComparisonIds(snapshot(), validIds), id, validIds)), []);
  const clear = useCallback(() => write([]), []);
  const value = useMemo(() => ({ ids, toggle, clear }), [ids, toggle, clear]);
  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
}
export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) throw new Error("ComparisonProvider is required");
  return context;
}
