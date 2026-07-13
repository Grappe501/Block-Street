/**
 * CAE-11.6-W11 — Resilience traceability
 */
import { OPS_RESILIENCE_PRINCIPLE } from "./constitution";

export function explainResilienceAction(input: {
  institution_id: string;
  action_type: string;
  incident_id?: string;
  evidence_refs: string[];
}): string {
  return [
    `Action ${input.action_type}`,
    `Institution ${input.institution_id}`,
    input.incident_id ? `Incident ${input.incident_id}` : "No incident",
    `Evidence: ${input.evidence_refs.join(", ")}`,
  ].join(" → ");
}

export function getResilienceTraceabilityProtocol() {
  return {
    protocol: "11.6-W11",
    principle: OPS_RESILIENCE_PRINCIPLE,
    required_fields: ["institution_id", "action_type", "evidence_refs"],
  };
}
