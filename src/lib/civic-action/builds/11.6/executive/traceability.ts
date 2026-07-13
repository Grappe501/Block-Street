/**
 * CAE-11.6-W8 — Executive traceability
 */
import { OPS_EXECUTIVE_PRINCIPLE } from "./constitution";

export function explainExecutiveInsight(input: {
  institution_id: string;
  insight_type: string;
  evidence_refs: string[];
}): string {
  return [`Insight ${input.insight_type}`, `Institution ${input.institution_id}`, `Evidence: ${input.evidence_refs.join(", ")}`].join(" → ");
}

export function getExecutiveTraceabilityProtocol() {
  return {
    protocol: "11.6-W8",
    principle: OPS_EXECUTIVE_PRINCIPLE,
    required_fields: ["institution_id", "evidence_refs"],
  };
}
