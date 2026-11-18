"use client";
import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { useComparison } from "./comparison-provider";
export function ComparisonSummary() {
  const { ids } = useComparison();
  return (
    <Link href="/compare" className="action-link border bg-white text-primary">
      <GitCompareArrows aria-hidden="true" className="size-4" />
      Bandingkan <span aria-live="polite">({ids.length}/3)</span>
    </Link>
  );
}
