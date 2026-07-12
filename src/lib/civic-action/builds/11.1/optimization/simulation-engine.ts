/**
 * CAE-11.1-W7 — Simulation engine (what-if, no mutations)
 */
import { caeId } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";
import type { SimulationRequest, SimulationResult } from "./contracts";

const SCENARIO_HANDLERS: Record<string, (params: Record<string, unknown>, institutionId: string) => SimulationResult> = {
  volunteer_loss: (params, institutionId) => {
    const pct = Number(params.percent ?? 40);
    const active = countByStatus(institutionId, "active");
    const impact = Math.ceil(active * (pct / 100));
    return buildResult("volunteer_loss", [
      `Estimated ${impact} of ${active} active Initiatives would face staffing gaps.`,
      "Timeline slippage likely on community-facing Initiatives.",
    ], ["Volunteer recruitment Initiatives may need acceleration.", "Owner workload increases on remaining teams."], pct >= 50 ? "strong_pattern" : "emerging");
  },
  funding_decrease: (params) => {
    const pct = Number(params.percent ?? 20);
    return buildResult("funding_decrease", [
      `A ${pct}% funding reduction would likely pause ${pct >= 30 ? "multiple" : "one or two"} Initiatives.`,
      "Charter scope revisions recommended before cancellation.",
    ], ["Community trust risk if Initiatives pause without communication."], "emerging");
  },
  timeline_slip: (params, institutionId) => {
    const weeks = Number(params.weeks ?? 4);
    const active = countByStatus(institutionId, "active");
    return buildResult("timeline_slip", [
      `${weeks}-week slip on ${active} active Initiatives affects dependent milestones.`,
      "Election or seasonal windows may be missed.",
    ], ["Downstream Initiatives may need dependency review."], "observed");
  },
  initiative_double: (_params, institutionId) => {
    const total = initiativeApplicationService.listInitiativeIds().filter((id) => {
      const a = initiativeApplicationService.getAggregate(id);
      return a && a.initiative.institution_id === institutionId;
    }).length;
    return buildResult("initiative_double", [
      `Portfolio would grow from ${total} to ~${total * 2} Initiatives.`,
      "Approval and owner capacity become primary constraints.",
    ], ["Governance batch reviews recommended.", "Training pipeline must scale."], "emerging");
  },
  statewide_launch: () =>
    buildResult("statewide_launch", [
      "75-county rollout requires phased template deployment.",
      "Digital twin suggests 3-wave geographic expansion.",
    ], ["Approval load increases 5–8x without delegation.", "Community trust varies by county — localize messaging."], "emerging"),
};

function countByStatus(institutionId: string, status: string) {
  return initiativeApplicationService
    .listInitiativeIds()
    .map((id) => initiativeApplicationService.getAggregate(id))
    .filter((a) => a && a.initiative.institution_id === institutionId && a.initiative.status === status).length;
}

function buildResult(
  scenarioType: string,
  outcomes: string[],
  risks: string[],
  confidence: SimulationResult["confidence"]
): SimulationResult {
  return {
    simulation_id: caeId("sim"),
    scenario_type: scenarioType,
    outcomes,
    risks,
    confidence,
    advisory_only: true,
    note: "Simulation only — no Initiative or governance state was modified.",
  };
}

export function runSimulation(institutionId: string, request: SimulationRequest): SimulationResult {
  const handler = SCENARIO_HANDLERS[request.scenario_type];
  if (!handler) {
    return {
      simulation_id: caeId("sim"),
      scenario_type: request.scenario_type,
      outcomes: [`Unknown scenario type: ${request.scenario_type}`],
      risks: [],
      confidence: "observed",
      advisory_only: true,
      note: `Supported: ${Object.keys(SCENARIO_HANDLERS).join(", ")}`,
    };
  }
  return handler(request.parameters, institutionId);
}
