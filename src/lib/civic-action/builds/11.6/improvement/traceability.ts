/**
 * CAE-11.6-W13 — Improvement traceability
 */
import { OPS_IMPROVEMENT_PRINCIPLE } from "./constitution";

export function explainImprovementAction(input: {
  institution_id: string;
  action_type: string;
  measurement_id?: string;
  outcome_id?: string;
  evidence_refs: string[];
}): string {
  return [
    `Action ${input.action_type}`,
    `Institution ${input.institution_id}`,
    input.measurement_id ? `Measurement ${input.measurement_id}` : "No measurement",
    input.outcome_id ? `Outcome ${input.outcome_id}` : "No outcome",
    `Evidence: ${input.evidence_refs.join(", ")}`,
  ].join(" → ");
}

export function getImprovementTraceabilityProtocol() {
  return {
    protocol: "11.6-W13",
    principle: OPS_IMPROVEMENT_PRINCIPLE,
    required_fields: ["institution_id", "action_type", "evidence_refs"],
  };
}
