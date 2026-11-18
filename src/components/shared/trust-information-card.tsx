import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TrustInformationCardProps { icon: LucideIcon; step: string; title: string; description: string }

export function TrustInformationCard({ icon: Icon, step, title, description }: TrustInformationCardProps) {
  return (
    <Card className="h-full border bg-white py-0 shadow-none ring-0">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-5" aria-hidden="true" /></span><span className="font-heading text-sm font-semibold text-muted-foreground">{step}</span></div>
        <h3 className="text-base font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

