/**
 * CAE-11.2-W7 — Objective digital twin (safe planning sandbox)
 */
import { caeId, nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import { buildObjectiveGraph } from "../intelligence/objective-graph";

export type DigitalTwinSnapshot = {
  twin_id: string;
  institution_id: string;
  objective_count: number;
  active_objectives: number;
  mission_count: number;
  relationship_edges: number;
  safe_to_test: true;
  advisory_only: true;
  generated_at: string;
};

export function buildDigitalTwin(institutionId: string, initiativeId?: string): DigitalTwinSnapshot {
  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  let missionCount = 0;
  let edges = 0;
  for (const o of objectives) {
    const graph = buildObjectiveGraph(o.canonical_id);
    if (graph) edges += graph.edges.length;
    const bundle = objectiveApplicationService.getObjectiveBundle(o.canonical_id);
    if (bundle) missionCount += bundle.missions.length;
  }

  return {
    twin_id: caeId("twin"),
    institution_id: institutionId,
    objective_count: objectives.length,
    active_objectives: objectives.filter((o) => o.lifecycle_state === "active").length,
    mission_count: missionCount,
    relationship_edges: edges,
    safe_to_test: true,
    advisory_only: true,
    generated_at: nowIso(),
  };
}

export type DigitalTwinTestRequest = {
  test_type: string;
  parameters?: Record<string, unknown>;
};

export type DigitalTwinTestResult = {
  test_id: string;
  test_type: string;
  safe: true;
  outcomes: string[];
  advisory_only: true;
  note: string;
};

export function runDigitalTwinTest(
  institutionId: string,
  request: DigitalTwinTestRequest,
  initiativeId?: string
): DigitalTwinTestResult {
  const twin = buildDigitalTwin(institutionId, initiativeId);
  const outcomes: string[] = [];

  switch (request.test_type) {
    case "governance_change":
      outcomes.push("Twin models Objective approval paths — no governance rules were modified.");
      outcomes.push(`${twin.active_objectives} active Objectives would need re-validation under new rules.`);
      break;
    case "staffing_change":
      outcomes.push(`Twin models ${twin.mission_count} missions — staffing shift simulated only.`);
      break;
    case "workflow_merge":
      outcomes.push(`Twin has ${twin.relationship_edges} dependency edges — merge simulated only.`);
      break;
    default:
      outcomes.push(`Twin snapshot: ${twin.objective_count} Objectives, ${twin.mission_count} missions.`);
  }

  return {
    test_id: caeId("ttest"),
    test_type: request.test_type,
    safe: true,
    outcomes,
    advisory_only: true,
    note: "Digital twin test — no execution state modified.",
  };
}
