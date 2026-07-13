import type { KnowledgeExplorerView } from "@/lib/civic-action/builds/11.7/ux";

export function KnowledgeExplorerPanel({ view }: { view: KnowledgeExplorerView }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Knowledge Explorer</h1>
        <p className="mt-1 text-sm text-slate-600">Institutional learning captured from conversations.</p>
      </header>

      {view.entries.length === 0 ? (
        <p className="card text-slate-600">{view.empty_message}</p>
      ) : (
        <ul className="space-y-3">
          {view.entries.map((e) => (
            <li key={e.id} className="card">
              <p className="text-slate-900">{e.knowledge_text}</p>
              <p className="mt-2 text-xs text-slate-500">
                {e.source_label} · {e.captured_by_label} · {e.when}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
