import Link from "next/link";
import { customerNavigation } from "@/config/navigation";
export function CustomerNavigation({ current }: { current: string }) {
  return (
    <nav
      aria-label="Navigasi kepercayaan pelanggan"
      className="mb-7 grid grid-cols-2 gap-2 rounded-2xl border bg-white p-2 lg:grid-cols-4"
    >
      {customerNavigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={current === item.href ? "page" : undefined}
          className={
            "flex min-h-12 items-center justify-center rounded-xl px-3 py-2 text-center text-xs leading-5 font-semibold sm:text-sm " +
            (current === item.href
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-secondary hover:text-primary")
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
