import type { KnowledgeGraphEdge, KnowledgeGraphNode } from "@/lib/civic-action/builds/11.7/intelligence";

export function RelationshipExplorer({
  nodes,
  edges,
}: {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}) {
  return (
    <section aria-labelledby="rel-explorer" className="card">
      <h2 id="rel-explorer" className="text-lg font-bold text-slate-900">
        Relationship Explorer
      </h2>
      <p className="text-sm text-slate-600">{nodes.length} entities · {edges.length} links (no people scoring)</p>
      <ul className="mt-3 space-y-1 text-sm">
        {edges.map((e) => (
          <li key={e.edge_id} className="text-slate-700">
            <span className="font-medium">{e.source_type}</span> —{e.relationship}→{" "}
            <span className="font-medium">{e.target_type}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
