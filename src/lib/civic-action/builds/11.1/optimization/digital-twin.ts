/**
 * CAE-11.1-W7 — Institution digital twin (safe planning sandbox)
 */
import { caeId, nowIso } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";
import { buildInstitutionGraph } from "../intelligence/institution-graph";
import type { DigitalTwinSnapshot } from "./contracts";
import { analyzeProcessOptimization } from "./process-optimization";

export function buildDigitalTwin(institutionId: string): DigitalTwinSnapshot {
  const graph = buildInstitutionGraph(institutionId);
  const ids = initiativeApplicationService
    .listInitiativeIds()
    .map((id) => initiativeApplicationService.getAggregate(id))
    .filter((a) => a && a.initiative.institution_id === institutionId);

  return {
    twin_id: caeId("twin"),
    institution_id: institutionId,
    people_count: graph.nodes.filter((n) => n.type === "human").length,
    initiative_count: ids.length,
    active_initiatives: ids.filter((a) => a!.initiative.status === "active").length,
    relationship_edges: graph.edges.length,
    processes_modeled: analyzeProcessOptimization(institutionId).length,
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
  request: DigitalTwinTestRequest
): DigitalTwinTestResult {
  const twin = buildDigitalTwin(institutionId);
  const outcomes: string[] = [];

  switch (request.test_type) {
    case "governance_change":
      outcomes.push("Twin models approval paths — no governance rules were modified.");
      outcomes.push(`Current ${twin.active_initiatives} active Initiatives would need re-validation under new rules.`);
      break;
    case "staffing_change":
      outcomes.push(`Twin has ${twin.people_count} modeled Humans — staffing shift simulated only.`);
      break;
    case "statewide_expansion":
      outcomes.push("Twin projects 75-county footprint — phased rollout recommended.");
      outcomes.push(`Relationship edges would scale from ${twin.relationship_edges} to estimated 3–5x.`);
      break;
    default:
      outcomes.push(`Test type '${request.test_type}' recorded against twin ${twin.twin_id}.`);
  }

  return {
    test_id: caeId("twin-test"),
    test_type: request.test_type,
    safe: true,
    outcomes,
    advisory_only: true,
    note: "Digital twin test — reality unchanged.",
  };
}
