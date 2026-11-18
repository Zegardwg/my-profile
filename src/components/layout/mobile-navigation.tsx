"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation, customerNavigation } from "@/config/navigation";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-12 rounded-xl xl:hidden"
            aria-label="Buka navigasi"
          />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent className="max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Jelajahi Sales Kit</SheetTitle>
          <SheetDescription>
            Alat presentasi personal · versi demo
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Navigasi mobile" className="flex flex-col gap-2 px-6">
          {[
            ...navigation,
            ...customerNavigation.filter(
              (entry) => !navigation.some((item) => item.href === entry.href),
            ),
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center rounded-xl px-4 font-medium hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
