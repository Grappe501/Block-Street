/**
 * CAE-11.1-W6 — Institution knowledge graph (read-only projection)
 */
import graphData from "../../../../../../data/relationships/graph.json";
import { initiativeApplicationService } from "../services/application-service";
import type { IntelligenceGraphEdge, IntelligenceGraphNode } from "./contracts";

export function buildInstitutionGraph(institutionId: string) {
  const ids = initiativeApplicationService.listInitiativeIds();
  const nodes: IntelligenceGraphNode[] = [
    { id: `inst:${institutionId}`, type: "institution", label: institutionId },
  ];
  const edges: IntelligenceGraphEdge[] = [];

  for (const id of ids) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    const ini = agg.initiative;
    nodes.push({
      id: `init:${ini.initiative_id}`,
      type: "initiative",
      label: ini.initiative_name,
      metadata: { status: ini.status, type: ini.initiative_type },
    });
    edges.push({
      id: `edge-inst-${ini.initiative_id}`,
      source: `inst:${institutionId}`,
      target: `init:${ini.initiative_id}`,
      type: "OWNS",
      confidence: "known",
    });
    if (ini.operational_owner_human_id) {
      const hid = `human:${ini.operational_owner_human_id}`;
      if (!nodes.some((n) => n.id === hid)) {
        nodes.push({ id: hid, type: "human", label: ini.operational_owner_human_id });
      }
      edges.push({
        id: `edge-own-${ini.initiative_id}`,
        source: hid,
        target: `init:${ini.initiative_id}`,
        type: "OWNS",
        confidence: "verified",
      });
    }
    for (const dep of agg.dependencies) {
      const depId = `dep:${dep.initiative_dependency_id}`;
      nodes.push({
        id: depId,
        type: "objective",
        label: dep.description || dep.target_id,
        metadata: { target_type: dep.target_type, target_id: dep.target_id },
      });
      edges.push({
        id: `edge-dep-${dep.initiative_dependency_id}`,
        source: `init:${ini.initiative_id}`,
        target: depId,
        type: "DEPENDS_ON",
        confidence: "known",
        strength: dep.blocks_activation ? 1 : 0.5,
      });
    }
  }

  for (const n of graphData.nodes as { id: string; label: string; type: string; county?: string }[]) {
    nodes.push({
      id: `org:${n.id}`,
      type: n.type === "person" ? "human" : "organization",
      label: n.label,
      metadata: { county: n.county },
    });
  }
  for (const e of graphData.edges as { id: string; source: string; target: string; type: string; strength?: number }[]) {
    edges.push({
      id: `rel-${e.id}`,
      source: e.source.startsWith("node-") ? `org:${e.source}` : e.source,
      target: e.target.startsWith("node-") ? `org:${e.target}` : e.target,
      type: "RELATED_TO",
      confidence: "observed",
      strength: e.strength,
    });
  }

  return { institution_id: institutionId, nodes, edges, node_count: nodes.length, edge_count: edges.length };
}
