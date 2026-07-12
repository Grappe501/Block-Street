"use client";

import type { ObjectiveRecommendation } from "@/lib/civic-action/builds/11.2/intelligence";
import { ObjectiveConfidenceBadge } from "./ObjectiveConfidenceBadge";

export function ObjectiveRecommendationCard({
  recommendation,
  onDismiss,
}: {
  recommendation: ObjectiveRecommendation;
  onDismiss?: (id: string) => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{recommendation.title}</h3>
        <ObjectiveConfidenceBadge confidence={recommendation.confidence} />
      </div>
      <p className="mt-2 text-sm text-slate-600">{recommendation.why}</p>
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
      {recommendation.expected_benefit_optional && (
        <p className="mt-2 text-xs text-emerald-700">Expected benefit: {recommendation.expected_benefit_optional}</p>
      )}
      <p className="mt-3 text-sm font-medium text-slate-800">Next: {recommendation.suggested_action}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {recommendation.action_href_optional && (
          <a href={recommendation.action_href_optional} className="text-sm text-orange-700 hover:underline">
            Learn more →
          </a>
        )}
        {onDismiss && (
          <button type="button" onClick={() => onDismiss(recommendation.recommendation_id)} className="text-sm text-slate-500 hover:text-slate-800">
            Dismiss
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-400">Advisory only — Humans decide.</p>
    </article>
  );
}
