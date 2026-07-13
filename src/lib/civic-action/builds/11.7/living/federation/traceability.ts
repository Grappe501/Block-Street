/**
 * CAE-11.7-W11 — Federation traceability
 */
import { LIX_FEDERATION_PRINCIPLE } from "./constitution";

export function explainFederationAction(input: {
  human_id: string;
  action_type: string;
  institution_id?: string;
  owner_institution_id?: string;
}) {
  return [
    `Federation action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.institution_id ? `Institution: ${input.institution_id}` : null,
    input.owner_institution_id ? `Owner: ${input.owner_institution_id}` : null,
    `Principle: ${LIX_FEDERATION_PRINCIPLE}`,
    "Sovereignty: Each institution remains independent.",
  ]
    .filter(Boolean)
    .join(" · ");
}
