"use client";

import type { OptimizationConfidence, OptimizationRecommendation } from "@/lib/civic-action/builds/11.2/optimization";

const STYLES: Record<OptimizationConfidence, string> = {
  observed: "bg-slate-100 text-slate-700",
  likely: "bg-amber-100 text-amber-800",
  strong_pattern: "bg-emerald-100 text-emerald-800",
  institution_standard: "bg-green-100 text-green-800",
  emerging: "bg-violet-100 text-violet-800",
};

export function ObjectiveOptimizationCard({
  optimization,
  onFeedback,
}: {
  optimization: OptimizationRecommendation;
  onFeedback?: (id: string, action: "accepted" | "rejected" | "deferred") => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{optimization.title}</h3>
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[optimization.confidence]}`}>
          {optimization.confidence.replace("_", " ")}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{optimization.why}</p>
      <p className="mt-1 text-xs text-slate-500">What changed: {optimization.what_changed}</p>
      {optimization.evidence.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium text-orange-700">Evidence</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
            {optimization.evidence.map((e) => (
              <li key={e.signal_id}>{e.summary}</li>
            ))}
          </ul>
        </details>
      )}
      <p className="mt-2 text-xs text-emerald-700">Expected benefit: {optimization.expected_benefit}</p>
      <p className="mt-1 text-xs text-amber-700">Possible risk: {optimization.possible_downside}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">Next: {optimization.suggested_action}</p>
      <p className="mt-1 text-xs text-slate-500">Review with: {optimization.who_should_review}</p>
      {onFeedback && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => onFeedback(optimization.optimization_id, "accepted")} className="text-sm text-emerald-700 hover:underline">
            Accept
          </button>
          <button type="button" onClick={() => onFeedback(optimization.optimization_id, "deferred")} className="text-sm text-amber-700 hover:underline">
            Defer
          </button>
          <button type="button" onClick={() => onFeedback(optimization.optimization_id, "rejected")} className="text-sm text-slate-500 hover:underline">
            Reject
          </button>
        </div>
      )}
      <p className="mt-2 text-xs text-slate-400">Advisory only — Humans approve improvements.</p>
    </article>
  );
}
