import type { KnowledgeReaderView } from "@/lib/civic-action/builds/11.12/ux";

export function KnowledgeReaderPanel({ view }: { view: KnowledgeReaderView }) {
  return (
    <article className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      {view.historical_banner && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          {view.historical_banner}
        </div>
      )}
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{view.title}</h1>
        <p className="mt-2 text-slate-600">{view.summary}</p>
        <dl className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-700">Status</dt>
            <dd>{view.status_label}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Version</dt>
            <dd>{view.version}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Confidence</dt>
            <dd>{view.confidence_label}</dd>
          </div>
        </dl>
      </header>
      <div className="prose prose-slate max-w-none text-sm">
        <p>{view.body_preview}</p>
      </div>
      <section>
        <h2 className="text-sm font-semibold text-slate-900">AI prompts (advisory)</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
          {view.ai_command_prompts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
