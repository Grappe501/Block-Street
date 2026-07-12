/**
 * CAE-11.1-W6 — Per-initiative intelligence graph
 */
import { initiativeApplicationService } from "../services/application-service";
import type { IntelligenceGraphEdge, IntelligenceGraphNode } from "./contracts";

export function buildInitiativeGraph(initiativeId: string) {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg) return null;

  const ini = agg.initiative;
  const nodes: IntelligenceGraphNode[] = [
    {
      id: `init:${ini.initiative_id}`,
      type: "initiative",
      label: ini.initiative_name,
      metadata: { status: ini.status },
    },
  ];
  const edges: IntelligenceGraphEdge[] = [];

  if (ini.operational_owner_human_id) {
    nodes.push({ id: `human:op`, type: "human", label: ini.operational_owner_human_id });
    edges.push({
      id: "edge-op-owner",
      source: `human:op`,
      target: `init:${ini.initiative_id}`,
      type: "OWNS",
      confidence: "verified",
    });
  }
  if (ini.executive_owner_human_id) {
    nodes.push({ id: `human:exec`, type: "human", label: ini.executive_owner_human_id });
    edges.push({
      id: "edge-exec-owner",
      source: `human:exec`,
      target: `init:${ini.initiative_id}`,
      type: "OWNS",
      confidence: "verified",
    });
  }

  for (const h of agg.history.slice(-10)) {
    nodes.push({
      id: `event:${h.initiative_event_id}`,
      type: "event",
      label: h.event_type,
      metadata: { occurred_at: h.occurred_at },
    });
    edges.push({
      id: `edge-hist-${h.initiative_event_id}`,
      source: `init:${ini.initiative_id}`,
      target: `event:${h.initiative_event_id}`,
      type: "CREATED",
      confidence: "known",
    });
  }

  for (const dep of agg.dependencies) {
    nodes.push({
      id: `dep:${dep.initiative_dependency_id}`,
      type: "objective",
      label: dep.description || dep.target_id,
    });
    edges.push({
      id: `edge-dep-${dep.initiative_dependency_id}`,
      source: `init:${ini.initiative_id}`,
      target: `dep:${dep.initiative_dependency_id}`,
      type: dep.blocks_activation ? "BLOCKS" : "DEPENDS_ON",
      confidence: "known",
    });
  }

  return {
    initiative_id: initiativeId,
    nodes,
    edges,
    questions_answerable: [
      "Who owns this Initiative?",
      "What dependencies block progress?",
      "What lifecycle events occurred recently?",
    ],
  };
}
