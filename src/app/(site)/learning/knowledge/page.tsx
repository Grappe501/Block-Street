import { assembleUniversalSearch, DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.12/ux";
import { LearningWorkbenchShell } from "@/features/knowledge/components/LearningWorkbenchShell";

export default function KnowledgeLibraryPage() {
  const view = assembleUniversalSearch(DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT, "");

  return (
    <LearningWorkbenchShell shell={view.shell}>
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Knowledge library</h1>
        <p className="text-sm text-slate-500">{view.placeholder}</p>
        <ul className="space-y-2">
          {view.results.map((r) => (
            <li key={r.id} className="rounded border border-slate-200 bg-white p-3 text-sm">
              <a href={r.href} className="font-medium text-indigo-700 hover:underline">
                {r.title}
              </a>
              <span className="ml-2 text-xs uppercase text-slate-400">{r.badge}</span>
              <p className="text-slate-600">{r.snippet}</p>
            </li>
          ))}
        </ul>
      </div>
    </LearningWorkbenchShell>
  );
}
