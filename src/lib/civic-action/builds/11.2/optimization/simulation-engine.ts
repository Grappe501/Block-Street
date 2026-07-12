/**
 * CAE-11.2-W7 — Simulation engine (what-if, no mutations)
 */
import { caeId } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import type { SimulationRequest, SimulationResult } from "./contracts";

function countObjectives(institutionId: string, initiativeId?: string, state?: string) {
  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);
  if (state) objectives = objectives.filter((o) => o.lifecycle_state === state);
  return objectives.length;
}

const SCENARIO_HANDLERS: Record<
  string,
  (params: Record<string, unknown>, institutionId: string, initiativeId?: string) => SimulationResult
> = {
  reduce_approvals: (params, institutionId, initiativeId) => {
    const proposed = countObjectives(institutionId, initiativeId, "proposed");
    const reduction = Number(params.steps_removed ?? 2);
    return buildResult(
      "reduce_approvals",
      [
        `Removing ${reduction} approval steps could clear ${proposed} proposed Objectives faster.`,
        "Governance accountability must be preserved — simulation only.",
      ],
      ["Faster activation may reduce deliberation quality.", "Policy exceptions may increase."],
      proposed >= 3 ? "likely" : "emerging"
    );
  },
  increase_training: (params) => {
    const hours = Number(params.hours ?? 8);
    return buildResult(
      "increase_training",
      [
        `Adding ${hours} hours of training per mission owner may reduce evidence quality issues.`,
        "Timeline to first mission completion may extend by 1–2 weeks.",
      ],
      ["Training investment delays short-term execution.", "Volunteer availability may constrain scheduling."],
      "emerging"
    );
  },
  change_workflow: (_params, institutionId, initiativeId) => {
    const active = countObjectives(institutionId, initiativeId, "active");
    return buildResult(
      "change_workflow",
      [
        `Workflow consolidation affects ${active} active Objectives.`,
        "Merged review cadence could save ~2 meetings per month.",
      ],
      ["Mission owners may lose Objective-specific review time."],
      "observed"
    );
  },
  shift_resources: (params, institutionId) => {
    const pct = Number(params.percent ?? 20);
    const total = countObjectives(institutionId);
    return buildResult(
      "shift_resources",
      [
        `Shifting ${pct}% of owner capacity affects ~${Math.ceil(total * (pct / 100))} Objectives.`,
        "Under-resourced Objectives may slip to at_risk.",
      ],
      ["Concentrating resources may starve emerging Objectives."],
      "emerging"
    );
  },
  merge_workstreams: (_params, institutionId, initiativeId) => {
    let count = 0;
    const objectives = objectiveApplicationService
      .listAllObjectives()
      .filter((o) => o.institution_id === institutionId && (!initiativeId || o.initiative_id === initiativeId));
    for (const o of objectives) {
      count += objectiveApplicationService.listWorkstreams(o.canonical_id).length;
    }
    return buildResult(
      "merge_workstreams",
      [
        `${count} workstreams modeled — merging could simplify coordination.`,
        "Cross-workstream dependencies must be remapped before merge.",
      ],
      ["Merged workstreams may obscure accountability lines."],
      count >= 4 ? "likely" : "observed"
    );
  },
  expand_staffing: (params, institutionId) => {
    const additional = Number(params.additional_owners ?? 2);
    const atRisk = countObjectives(institutionId, undefined, "at_risk");
    return buildResult(
      "expand_staffing",
      [
        `Adding ${additional} operational owners could relieve ${atRisk} at-risk Objectives.`,
        "Onboarding time required before capacity benefit realized.",
      ],
      ["New owners need training and context transfer."],
      atRisk >= 2 ? "likely" : "emerging"
    );
  },
  volunteer_loss: (params, institutionId, initiativeId) => {
    const pct = Number(params.percent ?? 40);
    const active = countObjectives(institutionId, initiativeId, "active");
    const impact = Math.ceil(active * (pct / 100));
    return buildResult(
      "volunteer_loss",
      [
        `Estimated ${impact} of ${active} active Objectives would face staffing gaps.`,
        "Timeline slippage likely on community-facing missions.",
      ],
      ["Volunteer recruitment Objectives may need acceleration."],
      pct >= 50 ? "strong_pattern" : "emerging"
    );
  },
};

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
    note: "Simulation only — no Objective or governance state was modified.",
  };
}

export function runSimulation(
  institutionId: string,
  request: SimulationRequest,
  initiativeId?: string
): SimulationResult {
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
  return handler(request.parameters, institutionId, initiativeId ?? request.objective_id_optional);
}
