import type { CompetencyWorkspaceView } from "@/lib/civic-action/builds/11.12/ux";

export function CompetencyTrackerPanel({ view }: { view: CompetencyWorkspaceView }) {
  return (
    <div className="space-y-4">
      {view.competencies.map((c) => (
        <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-900">{c.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{c.expected_behavior}</p>
          <p className="mt-2 text-sm text-slate-500">Evidence: {c.evidence_summary}</p>
          {c.incomplete_items.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-800">
              {c.incomplete_items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
