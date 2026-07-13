/**
 * CAE-11.6-W16 — Evolution traceability
 */
import { OPS_EVOLUTION_PRINCIPLE } from "./constitution";

export function explainEvolutionAction(input: {
  institution_id: string;
  action_type: string;
  evolution_id?: string;
  evidence_refs: string[];
}): string {
  return [
    `Action ${input.action_type}`,
    `Institution ${input.institution_id}`,
    input.evolution_id ? `Evolution ${input.evolution_id}` : "No evolution",
    `Evidence: ${input.evidence_refs.join(", ")}`,
    `Principle: ${OPS_EVOLUTION_PRINCIPLE}`,
  ].join(" → ");
}

export function getEvolutionTraceabilityProtocol() {
  return {
    protocol: "11.6-W16",
    principle: OPS_EVOLUTION_PRINCIPLE,
    required_fields: ["institution_id", "action_type", "evidence_refs"],
    backward: "Why does this exist?",
    forward: "What depends upon this?",
  };
}
