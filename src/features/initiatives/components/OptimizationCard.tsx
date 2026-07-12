"use client";

import type { OptimizationRecommendation } from "@/lib/civic-action/builds/11.1/optimization/contracts";
import { OptimizationConfidenceBadge } from "./OptimizationConfidenceBadge";

export function OptimizationCard({
  recommendation,
  onFeedback,
}: {
  recommendation: OptimizationRecommendation;
  onFeedback?: (id: string, action: "accepted" | "rejected" | "deferred") => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{recommendation.title}</h3>
        <OptimizationConfidenceBadge confidence={recommendation.confidence} />
      </div>
      <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{recommendation.category}</p>
      <p className="mt-2 text-sm text-slate-600">{recommendation.why}</p>
      <p className="mt-2 text-sm text-slate-700">
        <span className="font-medium">Expected benefit:</span> {recommendation.expected_benefit}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        <span className="font-medium">Possible downside:</span> {recommendation.possible_downside}
      </p>
      {recommendation.evidence.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium text-orange-700">Evidence</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
            {recommendation.evidence.map((e) => (
              <li key={e.signal_id}>{e.summary}</li>
            ))}
          </ul>
        </details>
      )}
      <p className="mt-3 text-sm font-medium text-slate-800">Review: {recommendation.who_should_review}</p>
      <p className="mt-1 text-sm text-slate-700">Suggested: {recommendation.suggested_action}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {recommendation.action_href_optional && (
          <a href={recommendation.action_href_optional} className="text-sm text-orange-700 hover:underline">
            Learn more →
          </a>
        )}
        {onFeedback && (
          <>
            <button
              type="button"
              onClick={() => onFeedback(recommendation.optimization_id, "accepted")}
              className="text-sm text-green-700 hover:underline"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => onFeedback(recommendation.optimization_id, "deferred")}
              className="text-sm text-slate-600 hover:underline"
            >
              Defer
            </button>
            <button
              type="button"
              onClick={() => onFeedback(recommendation.optimization_id, "rejected")}
              className="text-sm text-slate-500 hover:underline"
            >
              Reject
            </button>
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-400">Advisory only — Humans decide.</p>
    </article>
  );
}
