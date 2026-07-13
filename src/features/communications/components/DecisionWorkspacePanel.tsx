import type { DecisionWorkspaceView } from "@/lib/civic-action/builds/11.7/ux";

export function DecisionWorkspacePanel({ view }: { view: DecisionWorkspaceView }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Decision</h1>
        <p className="mt-1 text-sm text-slate-600">
          {view.status_label} · {view.decided_by_label}
        </p>
      </header>

      <section className="card">
        <h2 className="text-sm font-bold uppercase text-teal-800">Decision</h2>
        <p className="mt-2 text-slate-900">{view.decision_text}</p>
      </section>

      <section className="card">
        <h2 className="text-sm font-bold uppercase text-teal-800">Rationale</h2>
        <p className="mt-2 text-slate-700">{view.rationale}</p>
      </section>

      {view.related_messages.length > 0 && (
        <section aria-labelledby="related-messages">
          <h2 id="related-messages" className="text-lg font-bold text-slate-900">
            Related Messages
          </h2>
          <ul className="mt-2 space-y-2">
            {view.related_messages.map((m) => (
              <li key={m.id} className="card text-sm text-slate-700">
                {m.excerpt}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
