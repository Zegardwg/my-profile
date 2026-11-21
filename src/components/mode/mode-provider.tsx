"use client";
import Link from "next/link";
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { UserRound, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
type Mode = "customer" | "promoter";
const key = "xlsmart-interface-mode-v1",
  changed = "xlsmart-mode-change";
let memory: Mode = "customer";
let storageFailed = false;
function snapshot(): Mode {
  if (storageFailed) return memory;
  try {
    return localStorage.getItem(key) === "promoter" ? "promoter" : "customer";
  } catch {
    return memory;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener(changed, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(changed, callback);
    window.removeEventListener("storage", callback);
  };
}
const Context = createContext<{
  mode: Mode;
  setMode: (mode: Mode) => void;
} | null>(null);
function setMode(mode: Mode) {
  memory = mode;
  try {
    localStorage.setItem(key, mode);
    storageFailed = false;
  } catch {
    storageFailed = true; /* interface mode remains available in memory */
  }
  window.dispatchEvent(new Event(changed));
}
export function ModeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "customer" as Mode,
  );
  return (
    <Context.Provider value={{ mode, setMode }}>{children}</Context.Provider>
  );
}
export function useMode() {
  const value = useContext(Context);
  if (!value) throw new Error("ModeProvider diperlukan.");
  return value;
}
export function ModeSwitcher({ expanded = false }: { expanded?: boolean }) {
  const { mode, setMode } = useMode();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        className="min-h-12 min-w-12 rounded-xl px-3"
        aria-label="Pilih mode tampilan"
        onClick={() => setOpen(true)}
      >
        <UserRound aria-hidden="true" className="size-4" />
        <span className={expanded ? "" : "hidden 2xl:inline"}>
          {mode === "customer" ? "Mode pelanggan" : "Mode promotor"}
        </span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Pilih mode tampilan</DialogTitle>
            <DialogDescription>
              Mode lokal hanya mengatur tampilan, bukan login atau autentikasi
              admin. Siapa pun yang menggunakan browser ini dapat berganti mode.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Button
              variant={mode === "customer" ? "default" : "outline"}
              className="min-h-14 rounded-xl"
              onClick={() => {
                setMode("customer");
                setOpen(false);
              }}
            >
              Gunakan mode pelanggan
            </Button>
            <Button
              variant={mode === "promoter" ? "default" : "outline"}
              className="min-h-14 rounded-xl"
              onClick={() => {
                setMode("promoter");
                setOpen(false);
              }}
            >
              Gunakan mode promotor
            </Button>
          </div>
          <p className="text-xs leading-6 text-muted-foreground">
            Pelanggan dapat melihat promo, mencari paket dan membandingkan pilihan. Promotor
            dapat mengatur tiga kartu perdana, stok, promo, dan invoice. Pengelolaan cloud
            dengan autentikasi memerlukan backend.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function ManagementLink() {
  const { mode } = useMode();
  if (mode !== "promoter") return null;
  return (
    <Link
      href="/management"
      className="inline-flex min-h-11 items-center gap-2 rounded px-1 text-xs font-semibold text-primary"
    >
      <Settings2 aria-hidden="true" className="size-4" />
      Pengaturan jual
    </Link>
  );
}

