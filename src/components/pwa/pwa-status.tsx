"use client";
import { Download, Wifi, WifiOff } from "lucide-react";
import { usePwa } from "./pwa-provider";
import { Button } from "@/components/ui/button";

export function PwaStatus() {
  const { online, ready, supported, installed, installable, error, notice, install, check } = usePwa();
  return <div className="border-t bg-background/80"><div className="page-container flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1">
    <p role="status" className="flex items-center gap-2 text-[11px] leading-5 text-muted-foreground">{online ? <Wifi aria-hidden="true" className="size-3.5 shrink-0 text-primary" /> : <WifiOff aria-hidden="true" className="size-3.5 shrink-0 text-primary" />}<span>{online ? "Jaringan tersedia" : "Offline"} · {ready ? "Siap digunakan offline" : supported ? "Menyiapkan halaman offline…" : "Offline tersedia pada build produksi dengan HTTPS"}</span></p>
    <div className="flex flex-wrap items-center gap-3">{online && ready && <button type="button" className="min-h-11 rounded px-1 text-[11px] font-semibold text-primary" onClick={() => void check()}>Periksa pembaruan</button>}
      {!installed && (installable ? <Button variant="ghost" className="min-h-11 gap-1 rounded-xl px-2 text-xs text-primary" onClick={() => void install()}><Download aria-hidden="true" className="size-3.5" />Pasang aplikasi</Button> : <details className="relative"><summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 rounded px-1 text-[11px] font-semibold text-primary [&::-webkit-details-marker]:hidden"><Download aria-hidden="true" className="size-3.5" />Panduan instalasi</summary><div className="absolute right-0 z-50 mt-1 w-64 max-w-[85vw] rounded-xl border bg-white p-4 text-xs leading-6 text-muted-foreground shadow-card">Di Chrome Android, buka menu browser lalu pilih <strong>Pasang aplikasi</strong> atau <strong>Tambahkan ke layar utama</strong>. Gunakan alamat HTTPS. Tunggu status siap offline sebelum meninggalkan internet. Instalasi bergantung pada dukungan browser.</div></details>)}
    </div>
    {!online && <p className="w-full pb-1 text-[11px] leading-5 text-muted-foreground">Katalog tetap data demo. Rujukan dan registrasi resmi memerlukan internet; tidak ada aktivasi offline.</p>}
    {(error || notice) && <p role="alert" className="w-full pb-1 text-xs leading-6 text-muted-foreground">{notice || error}</p>}
  </div></div>;
}
export function PwaUpdateNotice() {
  const { waiting, updating, update } = usePwa();
  if (!waiting && !updating) return null;
  return <aside aria-label="Pembaruan aplikasi" className="fixed right-4 bottom-4 left-4 z-50 mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-white p-5 shadow-xl" style={{ marginBottom: "env(safe-area-inset-bottom)" }}><div className="min-w-0 flex-1 basis-64"><p className="text-sm font-bold">Versi baru siap digunakan</p><p className="mt-1 text-xs leading-6 text-muted-foreground">Perbarui saat presentasi selesai. Halaman dan langkah pencari akan dimuat ulang; pilihan perbandingan tetap tersimpan di perangkat.</p></div><Button className="min-h-12 rounded-xl" disabled={updating} onClick={update}>{updating ? "Memperbarui…" : "Perbarui sekarang"}</Button></aside>;
}
