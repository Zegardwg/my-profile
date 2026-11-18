"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { pwaConfig } from "@/config/pwa";

interface InstallEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }>; }
interface PwaState {
  online: boolean; ready: boolean; supported: boolean; installed: boolean; installable: boolean;
  waiting: boolean; updating: boolean; error: string; notice: string;
  install: () => Promise<void>; update: () => void; check: () => Promise<void>;
}
const Context = createContext<PwaState | null>(null);
const routes = new Set<string>(pwaConfig.routes);
const subscribeSupport = () => () => {};
const supportSnapshot = () => process.env.NODE_ENV === "production" && "serviceWorker" in navigator && window.isSecureContext;
const supportServerSnapshot = () => true;
export function PwaProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(true);
  const [ready, setReady] = useState(false);
  const supported = useSyncExternalStore(subscribeSupport, supportSnapshot, supportServerSnapshot);
  const [installed, setInstalled] = useState(false);
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const registration = useRef<ServiceWorkerRegistration | null>(null);
  const applying = useRef(false);

  useEffect(() => {
    let alive = true;
    const cleanups: (() => void)[] = [];
    const connectivity = () => { setOnline(navigator.onLine); if (navigator.onLine) setNotice(""); };
    connectivity();
    window.addEventListener("online", connectivity);
    window.addEventListener("offline", connectivity);
    cleanups.push(() => { window.removeEventListener("online", connectivity); window.removeEventListener("offline", connectivity); });
    const display = window.matchMedia("(display-mode: standalone)");
    const displayChange = () => setInstalled(display.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    displayChange(); display.addEventListener("change", displayChange);
    cleanups.push(() => display.removeEventListener("change", displayChange));
    const beforeInstall = (event: Event) => { event.preventDefault(); setInstallEvent(event as InstallEvent); };
    const appInstalled = () => { setInstalled(true); setInstallEvent(null); };
    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", appInstalled);
    cleanups.push(() => { window.removeEventListener("beforeinstallprompt", beforeInstall); window.removeEventListener("appinstalled", appInstalled); });

    // Offline documents are more robust than caching Next's context-dependent Flight responses.
    const offlineNavigation = (event: MouseEvent) => {
      if (navigator.onLine || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (!["http:", "https:"].includes(url.protocol)) return;
      if (url.origin !== location.origin) {
        event.preventDefault(); event.stopImmediatePropagation();
        setNotice("Tautan resmi memerlukan internet. Registrasi dan aktivasi biometrik tidak tersedia offline.");
        return;
      }
      const path = url.pathname.replace(/\/$/, "") || "/";
      if (!routes.has(path) || (url.pathname === location.pathname && url.search === location.search)) return;
      event.preventDefault(); event.stopImmediatePropagation(); location.assign(url.href);
    };
    document.addEventListener("click", offlineNavigation, true);
    cleanups.push(() => document.removeEventListener("click", offlineNavigation, true));

    if (!("serviceWorker" in navigator) || !window.isSecureContext) {
      return () => { alive = false; cleanups.forEach((cleanup) => cleanup()); };
    }
    if (process.env.NODE_ENV !== "production") {
      // A production worker must never interfere with local HMR on the same origin.
      void navigator.serviceWorker.getRegistrations().then(async (items) => {
        for (const item of items) if (item.active?.scriptURL === new URL("/sw.js", location.origin).href) await item.unregister();
        for (const name of await caches.keys()) if (name.startsWith("xlsmart-public-")) await caches.delete(name);
      });
      return () => { alive = false; cleanups.forEach((cleanup) => cleanup()); };
    }
    const readStatus = (worker: ServiceWorker | null) => {
      if (!worker) return;
      const channel = new MessageChannel();
      const timeout = window.setTimeout(() => channel.port1.close(), 5000);
      channel.port1.onmessage = (event) => {
        if (alive && event.data?.type === "PWA_STATUS") setReady(Boolean(event.data.ready));
        window.clearTimeout(timeout); channel.port1.close();
      };
      worker.postMessage({ type: "GET_STATUS" }, [channel.port2]);
    };
    const controlled = () => {
      if (applying.current) { location.reload(); return; }
      readStatus(navigator.serviceWorker.controller);
    };
    navigator.serviceWorker.addEventListener("controllerchange", controlled);
    cleanups.push(() => navigator.serviceWorker.removeEventListener("controllerchange", controlled));
    void navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then((reg) => {
      if (!alive) return;
      registration.current = reg;
      setWaiting(Boolean(reg.waiting));
      readStatus(reg.active);
      const found = () => {
        const worker = reg.installing;
        if (!worker) return;
        const changed = () => {
          if (!alive) return;
          if (worker.state === "installed") { setWaiting(Boolean(reg.waiting)); readStatus(reg.active); }
          if (worker.state === "activated") readStatus(worker);
          if (worker.state === "redundant") setError("Penyimpanan atau pembaruan offline belum berhasil. Versi sebelumnya tetap dapat digunakan jika sudah tersimpan.");
        };
        worker.addEventListener("statechange", changed);
        cleanups.push(() => worker.removeEventListener("statechange", changed));
      };
      found(); reg.addEventListener("updatefound", found);
      cleanups.push(() => reg.removeEventListener("updatefound", found));
      const refresh = () => { if (navigator.onLine) void reg.update().catch(() => {}); };
      window.addEventListener("online", refresh);
      cleanups.push(() => window.removeEventListener("online", refresh));
    }).catch(() => { if (alive) setError("Mode offline belum siap. Sambungkan internet dan muat ulang aplikasi."); });
    return () => { alive = false; cleanups.forEach((cleanup) => cleanup()); };
  }, []);

  const install = useCallback(async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }, [installEvent]);
  const update = useCallback(() => {
    const worker = registration.current?.waiting;
    if (!worker) return;
    applying.current = true; setUpdating(true);
    worker.postMessage({ type: "SKIP_WAITING" });
  }, []);
  const check = useCallback(async () => {
    if (!registration.current || !navigator.onLine) return;
    setError("");
    try { await registration.current.update(); } catch { setError("Pembaruan belum dapat diperiksa. Coba saat koneksi kembali tersedia."); }
  }, []);
  const value = useMemo(() => ({ online, ready, supported, installed, installable: Boolean(installEvent), waiting, updating, error, notice, install, update, check }), [online, ready, supported, installed, installEvent, waiting, updating, error, notice, install, update, check]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function usePwa() {
  const context = useContext(Context);
  if (!context) throw new Error("PwaProvider is required");
  return context;
}
