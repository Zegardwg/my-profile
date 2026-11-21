import { ImageIcon, Signal, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePlaceholder({ className, label = "Contoh visual presentasi" }: { className?: string; label?: string }) {
  return (
    <div role="img" aria-label={label} className={cn("relative isolate min-h-80 overflow-hidden rounded-2xl border border-white/15 bg-white/5", className)}>
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <div className="absolute size-72 rounded-full border border-white/10" />
        <div className="absolute size-96 rounded-full border border-white/10" />
        <div className="relative w-44 rotate-8 rounded-[2rem] border-4 border-white/25 bg-[#123575] p-3 shadow-2xl sm:w-48">
          <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/35" />
          <div className="flex justify-between text-white/65"><span className="text-[10px]">09:41</span><Signal className="size-3" /></div>
          <div className="mt-7 grid size-11 place-items-center rounded-xl bg-mint text-navy"><Wifi className="size-6" /></div>
          <div className="mt-4 text-white"><p className="text-[10px] tracking-widest uppercase">Koneksi</p><p className="font-heading text-2xl font-bold">sehari-hari.</p></div>
          <div className="mt-7 space-y-2 pb-6"><div className="h-2 w-3/4 rounded bg-white/20" /><div className="h-2 w-1/2 rounded bg-white/10" /><div className="mt-4 h-9 rounded-lg bg-white/90" /></div>
        </div>
        <span className="absolute right-4 bottom-16 rounded-xl border border-white/20 bg-[#214783] px-4 py-3 text-xs font-medium text-white shadow-lg sm:right-7"><span className="mr-2 inline-block size-2 rounded-full bg-mint" />Tetap terhubung</span>
      </div>
      <span className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] tracking-widest text-white/65 uppercase"><ImageIcon className="size-3" aria-hidden="true" />Contoh ilustrasi</span>
    </div>
  );
}

