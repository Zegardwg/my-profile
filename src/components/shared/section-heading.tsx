import type { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({ id, eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3 text-primary">{eyebrow}</p>
        <h2 id={id} className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

