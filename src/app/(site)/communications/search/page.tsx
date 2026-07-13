import {
  assembleCommunicationSearch,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";

export default async function CommunicationSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const view = assembleCommunicationSearch(q ?? "", DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT);

  return (
    <CollaborationWorkbenchShell shell={view.shell}>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Search Communications</h1>
          <p className="mt-1 text-sm text-slate-600">{view.placeholder}</p>
        </header>

        <form method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={view.query}
            placeholder={view.placeholder}
            className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
            aria-label="Search communications"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {view.query && (
          <p className="text-xs text-slate-500">Semantic intent: {view.parsed_semantic_intent}</p>
        )}

        <ul className="space-y-2">
          {view.results.map((r) => (
            <li key={r.id}>
              <a href={r.href} className="card block hover:border-teal-300">
                <span className="text-xs font-medium text-teal-700">{r.entity_type}</span>
                <p className="font-medium text-slate-900">{r.title}</p>
                <p className="text-sm text-slate-600">{r.excerpt}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </CollaborationWorkbenchShell>
  );
}
