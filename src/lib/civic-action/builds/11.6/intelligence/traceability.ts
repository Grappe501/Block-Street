/**
 * CAE-11.6-W10 — Intelligence traceability
 */
import { OPS_INTELLIGENCE_PRINCIPLE } from "./constitution";

export function explainIntelligenceInsight(input: {
  institution_id: string;
  insight_id: string;
  evidence_refs: string[];
}): string {
  return [
    `Insight ${input.insight_id}`,
    `Institution ${input.institution_id}`,
    `Evidence: ${input.evidence_refs.join(", ")}`,
  ].join(" → ");
}

export function getIntelligenceTraceabilityProtocol() {
  return {
    protocol: "11.6-W10",
    principle: OPS_INTELLIGENCE_PRINCIPLE,
    required_fields: ["institution_id", "insight_id", "supporting_evidence", "confidence"],
  };
}
