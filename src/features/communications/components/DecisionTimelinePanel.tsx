import type { DecisionIntelligenceInsight } from "@/lib/civic-action/builds/11.7/intelligence/decision-analysis";

export function DecisionTimelinePanel({ decisions }: { decisions: DecisionIntelligenceInsight[] }) {
  return (
    <section aria-labelledby="decision-timeline" className="card">
      <h2 id="decision-timeline" className="text-lg font-bold text-slate-900">
        Decision Timeline
      </h2>
      <ul className="mt-3 space-y-2">
        {decisions.length === 0 ? (
          <li className="text-sm text-slate-600">No decisions in scope.</li>
        ) : (
          decisions.map((d) => (
            <li key={d.decision_id} className="border-l-2 border-teal-400 pl-3">
              <p className="font-medium text-slate-900">{d.decision_text.slice(0, 80)}</p>
              <p className="text-xs text-slate-500">
                {d.status} · {d.days_since_decision}d ago
                {d.related_mission_ids.length > 0 && ` · Mission: ${d.related_mission_ids.join(", ")}`}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
