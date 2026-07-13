/**
 * CAE-11.6-W14 — Experience traceability
 */
import { OPS_EXPERIENCE_PRINCIPLE } from "./constitution";

export function explainExperienceAction(input: {
  human_id: string;
  institution_id: string;
  action_type: string;
  workspace_id?: string;
  evidence_refs: string[];
}): string {
  return [
    `Action ${input.action_type}`,
    `Human ${input.human_id}`,
    `Institution ${input.institution_id}`,
    input.workspace_id ? `Workspace ${input.workspace_id}` : "No workspace",
    `Evidence: ${input.evidence_refs.join(", ")}`,
  ].join(" → ");
}

export function getExperienceTraceabilityProtocol() {
  return {
    protocol: "11.6-W14",
    principle: OPS_EXPERIENCE_PRINCIPLE,
    required_fields: ["human_id", "institution_id", "action_type", "evidence_refs"],
  };
}
