import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed bg-white px-5 py-12 text-center">
      <SearchX
        aria-hidden="true"
        className="mx-auto mb-4 size-8 text-primary"
      />
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mx-auto mt-3 mb-6 max-w-lg text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      {action}
    </div>
  );
}
