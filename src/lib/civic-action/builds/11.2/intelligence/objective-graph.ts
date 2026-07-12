/**
 * CAE-11.2-W6 — Objective execution graph
 */
import { objectiveApplicationService } from "../application-service";

export type ObjectiveGraph = {
  objective_id: string;
  initiative_id: string;
  node_count: number;
  edge_count: number;
  nodes: { id: string; type: string; label: string }[];
  edges: { source: string; target: string; type: string }[];
};

export function buildObjectiveGraph(objectiveId: string): ObjectiveGraph | null {
  const bundle = objectiveApplicationService.getObjectiveBundle(objectiveId);
  if (!bundle) return null;
  const { objective, workstreams, missions, tasks } = bundle;

  const nodes = [
    { id: objective.canonical_id, type: "objective", label: objective.display_name },
    ...workstreams.map((w) => ({ id: w.canonical_id, type: "workstream", label: w.display_name })),
    ...missions.map((m) => ({ id: m.canonical_id, type: "mission", label: m.display_name })),
    ...tasks.slice(0, 20).map((t) => ({ id: t.canonical_id, type: "task", label: t.description.slice(0, 40) })),
  ];

  const edges: ObjectiveGraph["edges"] = [];
  for (const w of workstreams) {
    edges.push({ source: objective.canonical_id, target: w.canonical_id, type: "HAS_WORKSTREAM" });
  }
  for (const m of missions) {
    edges.push({ source: m.workstream_id, target: m.canonical_id, type: "HAS_MISSION" });
  }
  for (const t of tasks.slice(0, 20)) {
    edges.push({ source: t.mission_id, target: t.canonical_id, type: "HAS_TASK" });
  }

  return {
    objective_id: objectiveId,
    initiative_id: objective.initiative_id,
    node_count: nodes.length,
    edge_count: edges.length,
    nodes,
    edges,
  };
}
