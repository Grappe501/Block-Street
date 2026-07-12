"use client";

import type { OptimizationConfidence } from "@/lib/civic-action/builds/11.1/optimization/contracts";

const STYLES: Record<OptimizationConfidence, string> = {
  observed: "bg-slate-100 text-slate-700",
  emerging: "bg-amber-100 text-amber-800",
  strong_pattern: "bg-emerald-100 text-emerald-800",
  institution_standard: "bg-green-100 text-green-800",
};

const LABELS: Record<OptimizationConfidence, string> = {
  observed: "Observed",
  emerging: "Emerging",
  strong_pattern: "Strong pattern",
  institution_standard: "Institution standard",
};

export function OptimizationConfidenceBadge({ confidence }: { confidence: OptimizationConfidence }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[confidence]}`}>
      {LABELS[confidence]}
    </span>
  );
}
