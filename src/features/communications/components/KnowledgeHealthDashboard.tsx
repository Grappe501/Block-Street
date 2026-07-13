import type { CommunicationHealthDimension } from "@/lib/civic-action/builds/11.7/optimization";

export function KnowledgeHealthDashboard({ health }: { health: CommunicationHealthDimension[] }) {
  const knowledgeDims = health.filter((h) =>
    ["knowledge_capture", "documentation_currency", "institutional_memory"].includes(h.dimension)
  );

  return (
    <section aria-labelledby="knowledge-health" className="card">
      <h2 id="knowledge-health" className="text-lg font-bold text-slate-900">
        Knowledge Health
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {knowledgeDims.map((d) => (
          <li key={d.dimension} className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-semibold uppercase text-teal-700">{d.label}</p>
            <p className="text-xl font-bold capitalize">{d.state}</p>
            <p className="mt-1 text-xs text-slate-600">{d.explanation}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
