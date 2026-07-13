/**
 * CAE-11.12-W7 — Non-mutating simulation engine
 */
import { caeId } from "../../../utils";
import type { KnowledgeOptimization } from "./contracts";

export type SimulationRequest = {
  scenario_type: string;
  parameters: Record<string, unknown>;
};

export type SimulationResult = {
  simulation_id: string;
  scenario_type: string;
  outcomes: string[];
  risks: string[];
  assumptions: string[];
  production_mutated: false;
  advisory_only: true;
  note: string;
};

export function runImprovementSimulation(
  institutionId: string,
  request: SimulationRequest
): SimulationResult {
  const outcomes: string[] = [];
  const risks: string[] = [];

  if (request.scenario_type === "course_revision") {
    outcomes.push("Active learners remain on enrolled version in simulation.");
    outcomes.push("New learners would receive revised version after adoption.");
    risks.push("Certification mappings may need transition review.");
  } else if (request.scenario_type === "certification_transition") {
    outcomes.push("Existing awards retain historical integrity in simulation.");
    risks.push("Renewal backlog may increase during transition period.");
  } else {
    outcomes.push("Simulation completed with labeled assumptions.");
    risks.push("Validate with pilot before adoption.");
  }

  return {
    simulation_id: caeId("sim"),
    scenario_type: request.scenario_type,
    outcomes,
    risks,
    assumptions: ["Simulation uses current projections — not live mutation"],
    production_mutated: false,
    advisory_only: true,
    note: `Simulation for ${institutionId} — no canonical records modified`,
  };
}
