import type { DocumentWorkspaceView } from "@/lib/civic-action/builds/11.7/ux";

export function DocumentWorkspacePanel({ view }: { view: DocumentWorkspaceView }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{view.display_name}</h1>
        <p className="mt-1 text-sm text-slate-600">{view.status_label}</p>
      </header>

      <section className="card">
        <h2 className="text-sm font-bold uppercase text-teal-800">Content</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{view.content_preview}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card">
          <h2 className="text-sm font-bold text-slate-900">Editors</h2>
          <ul className="mt-2 text-sm text-slate-600">
            {view.editors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h2 className="text-sm font-bold text-slate-900">Reviewers</h2>
          <ul className="mt-2 text-sm text-slate-600">
            {view.reviewers.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
