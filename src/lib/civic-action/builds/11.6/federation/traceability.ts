/**
 * CAE-11.6-W12 — Federation traceability
 */
import { OPS_FEDERATION_PRINCIPLE } from "./constitution";

export function explainFederationAction(input: {
  federation_id: string;
  institution_id: string;
  action_type: string;
  agreement_id?: string;
  evidence_refs: string[];
}): string {
  return [
    `Action ${input.action_type}`,
    `Federation ${input.federation_id}`,
    `Institution ${input.institution_id}`,
    input.agreement_id ? `Agreement ${input.agreement_id}` : "No agreement",
    `Evidence: ${input.evidence_refs.join(", ")}`,
  ].join(" → ");
}

export function getFederationTraceabilityProtocol() {
  return {
    protocol: "11.6-W12",
    principle: OPS_FEDERATION_PRINCIPLE,
    required_fields: ["federation_id", "institution_id", "action_type", "evidence_refs"],
  };
}
