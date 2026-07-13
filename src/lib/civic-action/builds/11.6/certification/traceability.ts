/**
 * CAE-11.6-W15 — Certification traceability
 */
import { OPS_CERTIFICATION_PRINCIPLE } from "./constitution";

export function explainCertificationAction(input: {
  institution_id: string;
  action_type: string;
  certification_id?: string;
  evidence_refs: string[];
}): string {
  return [
    `Action ${input.action_type}`,
    `Institution ${input.institution_id}`,
    input.certification_id ? `Certification ${input.certification_id}` : "No certification",
    `Evidence: ${input.evidence_refs.join(", ")}`,
  ].join(" → ");
}

export function getCertificationTraceabilityProtocol() {
  return {
    protocol: "11.6-W15",
    principle: OPS_CERTIFICATION_PRINCIPLE,
    required_fields: ["institution_id", "action_type", "evidence_refs"],
  };
}
