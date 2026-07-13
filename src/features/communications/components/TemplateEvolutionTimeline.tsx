import type { TemplateEvolutionRecord } from "@/lib/civic-action/builds/11.7/optimization";

export function TemplateEvolutionTimeline({ templates }: { templates: TemplateEvolutionRecord[] }) {
  return (
    <section aria-labelledby="template-timeline" className="card">
      <h2 id="template-timeline" className="text-lg font-bold text-slate-900">
        Template Evolution
      </h2>
      <ul className="mt-3 space-y-4">
        {templates.map((t) => (
          <li key={t.template_id} className="border-l-2 border-teal-500 pl-4">
            <p className="font-medium text-slate-900">
              {t.template_name} <span className="text-sm text-slate-500">v{t.version}</span>
            </p>
            <p className="text-xs capitalize text-teal-700">{t.status}</p>
            <ol className="mt-2 space-y-1">
              {t.version_history.map((v) => (
                <li key={v.version} className="text-xs text-slate-600">
                  v{v.version}: {v.change_summary}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </section>
  );
}
