import { Skeleton } from "@/components/ui/skeleton";
export function ToolLoading() {
  return (
    <div
      role="status"
      aria-label="Memuat halaman"
      className="page-container space-y-6 py-12"
    >
      <span className="sr-only">Memuat halaman…</span>
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((id) => (
          <Skeleton key={id} className="h-96 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
