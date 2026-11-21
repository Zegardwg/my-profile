"use client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { listProducts } from "@/lib/product-repository";
import { demoProducts } from "@/data/demo-products";
import type { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
interface CatalogState {
  products: readonly Product[];
  activeProducts: readonly Product[];
  loading: boolean;
  error: string;
  retry: () => void;
}
const Context = createContext<CatalogState | null>(null);
const empty: readonly Product[] = [];
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [attempt, setAttempt] = useState(0);
  const result = useLiveQuery(async () => {
    try {
      return { products: await listProducts(), error: "" };
    } catch {
      return {
        products: demoProducts,
        error:
          "Penyimpanan lokal tidak tersedia. Data lokal belum dapat dibaca; hanya contoh bawaan ditampilkan dalam mode baca-saja. Periksa izin penyimpanan atau tutup tab lama, lalu coba lagi.",
      };
    }
  }, [attempt]);
  const products = result?.products ?? empty;
  const activeProducts = useMemo(
    () => products.filter((product) => !product.archived),
    [products],
  );
  const state = useMemo(
    () => ({
      products,
      activeProducts,
      loading: !result,
      error: result?.error ?? "",
      retry: () => setAttempt((value) => value + 1),
    }),
    [products, activeProducts, result],
  );
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useCatalog() {
  const context = useContext(Context);
  if (!context) throw new Error("CatalogProvider diperlukan.");
  return context;
}
export function CatalogStorageNotice() {
  const { error, retry } = useCatalog();
  if (!error) return null;
  return (
    <div
      role="alert"
      className="page-container border-t bg-secondary py-3 text-xs leading-6"
    >
      <p>{error}</p>
      <button
        type="button"
        className="min-h-11 font-semibold text-primary underline"
        onClick={retry}
      >
        Coba baca penyimpanan lagi
      </button>
    </div>
  );
}
export function CatalogLoading() {
  return (
    <div
      role="status"
      aria-label="Memuat katalog lokal"
      className="space-y-4 py-6"
    >
      <span className="sr-only">Memuat katalog lokal…</span>
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-5 md:grid-cols-2">
        {[1, 2].map((n) => (
          <Skeleton key={n} className="h-80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
