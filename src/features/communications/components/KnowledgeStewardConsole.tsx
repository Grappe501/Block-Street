import type { KnowledgeStewardshipRecommendation } from "@/lib/civic-action/builds/11.7/optimization";

export function KnowledgeStewardConsole({ recommendations }: { recommendations: KnowledgeStewardshipRecommendation[] }) {
  return (
    <section aria-labelledby="steward-console" className="card">
      <h2 id="steward-console" className="text-lg font-bold text-slate-900">
        Knowledge Steward Console
      </h2>
      <p className="mt-1 text-sm text-amber-700">All actions require human approval — advisory only.</p>
      <ul className="mt-3 space-y-2">
        {recommendations.length === 0 ? (
          <li className="text-sm text-slate-600">No stewardship recommendations at this time.</li>
        ) : (
          recommendations.map((r) => (
            <li key={r.recommendation_id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold uppercase text-amber-800">{r.type}</p>
              <p className="font-medium text-slate-900">{r.summary}</p>
              <p className="mt-1 text-sm text-slate-600">{r.suggested_action}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
