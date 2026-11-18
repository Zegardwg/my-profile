import {
  CircleUserRound,
  FileText,
  Hand,
  LockKeyhole,
  Package,
  PanelsTopLeft,
  Route,
  type LucideIcon,
} from "lucide-react";
import type { IllustrationKind } from "@/config/customer-trust";
const icons: Record<IllustrationKind, LucideIcon> = {
  person: CircleUserRound,
  review: FileText,
  privacy: LockKeyhole,
  choice: Hand,
  channel: Route,
  status: PanelsTopLeft,
  package: Package,
};
export function TrustIllustration({
  kind = "review",
  portrait = false,
}: {
  kind?: IllustrationKind;
  portrait?: boolean;
}) {
  const Icon = icons[kind];
  return (
    <div
      role="img"
      aria-label={
        portrait
          ? "Placeholder foto profil, bukan foto promotor sebenarnya"
          : "Ilustrasi placeholder edukasi, bukan dokumen atau layar sistem resmi"
      }
      className={
        "relative flex items-center justify-center overflow-hidden rounded-2xl border border-primary/10 bg-secondary " +
        (portrait ? "min-h-72" : "min-h-40")
      }
    >
      <span
        aria-hidden="true"
        className="grid size-24 place-items-center rounded-3xl border border-primary/15 bg-white text-primary"
      >
        <Icon className="size-12" strokeWidth={1.4} />
      </span>
      <span className="absolute right-4 bottom-3 left-4 text-center text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
        {portrait ? "Foto placeholder · DATA DEMO" : "Ilustrasi placeholder"}
      </span>
    </div>
  );
}
