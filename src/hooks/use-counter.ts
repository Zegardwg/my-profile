"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { readCounter } from "@/lib/counter-repository";
export function useCounter() {
  return useLiveQuery(async () => {
    try {
      return { data: await readCounter(), error: "" };
    } catch {
      return {
        data: null,
        error:
          "Penyimpanan lokal tidak dapat dibuka. Periksa izin browser lalu muat ulang.",
      };
    }
  }, []);
}
