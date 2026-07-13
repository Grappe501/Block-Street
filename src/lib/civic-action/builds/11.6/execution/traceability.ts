/**
 * CAE-11.6-W2 — Operational mission traceability
 */
import { OPS_EXECUTION_PRINCIPLE } from "./constitution";
import type { OperationalMissionTraceability } from "./data-model";
import { explainWhyWeAreDoingThis } from "../traceability";

export function validateMissionTraceability(fields: OperationalMissionTraceability): boolean {
  return !!(fields.objective_id && fields.strategic_goal_id && fields.program_id);
}

export function explainMissionPurpose(fields: OperationalMissionTraceability): string {
  const strategic = explainWhyWeAreDoingThis({
    vision_id: fields.vision_id,
    mission_id: fields.mission_statement_id,
    pillar_id: fields.pillar_id,
    goal_id: fields.strategic_goal_id,
    objective_id: fields.objective_id,
    key_result_id: fields.key_result_id,
  });
  const ops = fields.project_id ? `Project ${fields.project_id}` : fields.program_id ? `Program ${fields.program_id}` : null;
  if (!ops) return strategic;
  return `${strategic} → ${ops} → Operational Mission`;
}

export function getMissionTraceabilityProtocol() {
  return {
    protocol: "11.6-W2",
    principle: OPS_EXECUTION_PRINCIPLE,
    required_fields: [
      "vision_id",
      "mission_statement_id",
      "pillar_id",
      "strategic_goal_id",
      "objective_id",
      "program_id",
    ],
  };
}
