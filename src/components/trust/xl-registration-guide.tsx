"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const titles = [
  "Sampul panduan",
  "Aktivasi kartu baru",
  "Siapkan data",
  "Akses kanal resmi",
  "Masukkan data kartu",
  "Masukkan NIK",
  "Verifikasi wajah",
  "Periksa data",
  "Periksa status registrasi",
];

export function XlRegistrationGuide() {
  const [page, setPage] = useState(0);
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setPage(0);
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" className="mb-6 min-h-12 rounded-xl" />
        }
      >
        Lihat panduan bergambar XL
      </DialogTrigger>
      <DialogContent className="max-h-[94dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Panduan kartu XL</DialogTitle>
          <DialogDescription>
            Ikuti instruksi yang tampil di kanal resmi XL saat registrasi.
          </DialogDescription>
        </DialogHeader>
        <Image
          src={"/images/registrasi/" + String(page).padStart(2, "0") + ".webp"}
          width={940}
          height={1254}
          unoptimized
          alt={titles[page]}
          className="mx-auto max-h-[54dvh] w-auto object-contain"
        />
        <p className="text-center text-sm" aria-live="polite">
          {page + 1} / {titles.length} · {titles[page]}
        </p>
        <div className="flex justify-between gap-2">
          <Button
            className="min-h-11"
            variant="outline"
            disabled={!page}
            onClick={() => setPage(page - 1)}
          >
            Sebelumnya
          </Button>
          <Button
            className="min-h-11"
            disabled={page === titles.length - 1}
            onClick={() => setPage(page + 1)}
          >
            Berikutnya
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
