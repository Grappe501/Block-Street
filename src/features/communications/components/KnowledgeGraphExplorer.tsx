import type { KnowledgeGraphView } from "@/lib/civic-action/builds/11.7/intelligence";

export function KnowledgeGraphExplorer({ graph }: { graph: KnowledgeGraphView | null }) {
  if (!graph) {
    return (
      <section className="card text-sm text-slate-600" aria-label="Knowledge graph">
        No graph data for this anchor.
      </section>
    );
  }

  return (
    <section aria-labelledby="kg-explorer" className="card">
      <h2 id="kg-explorer" className="text-lg font-bold text-slate-900">
        Knowledge Graph
      </h2>
      <p className="text-sm text-slate-600">
        {graph.node_count} nodes · {graph.edge_count} relationships (advisory)
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        {graph.nodes.map((n) => (
          <li key={n.node_id} className="flex justify-between border-b border-slate-100 py-1">
            <span>{n.label}</span>
            <span className="text-xs text-teal-700">{n.node_type}</span>
          </li>
        ))}
      </ul>
      {graph.edges.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-slate-500">
          {graph.edges.map((e) => (
            <li key={e.edge_id}>
              {e.source_type} → {e.target_type}: {e.relationship}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
