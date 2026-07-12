"use client";

import type { IntelligenceConfidence } from "@/lib/civic-action/builds/11.2/intelligence";

const STYLES: Record<IntelligenceConfidence, string> = {
  very_high: "bg-green-100 text-green-800",
  high: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-slate-100 text-slate-700",
  speculative: "bg-violet-100 text-violet-800",
};

export function ObjectiveConfidenceBadge({ confidence }: { confidence: IntelligenceConfidence }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[confidence]}`}>
      {confidence.replace("_", " ")}
    </span>
  );
}
