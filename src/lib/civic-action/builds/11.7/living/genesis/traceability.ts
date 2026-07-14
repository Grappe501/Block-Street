/**
 * CAE-11.7-W16 — Genesis traceability
 */
import { LIX_GENESIS_PRINCIPLE } from "./constitution";

export function explainGenesisAction(input: {
  human_id: string;
  action_type: string;
  package_id?: string;
  institution_id?: string;
}) {
  return [
    `Genesis action: ${input.action_type}`,
    `Human steward: ${input.human_id}`,
    input.institution_id ? `Institution: ${input.institution_id}` : null,
    input.package_id ? `Package: ${input.package_id}` : null,
    `Principle: ${LIX_GENESIS_PRINCIPLE}`,
    "Continuity: Institutional identity survives leadership and technology change.",
  ]
    .filter(Boolean)
    .join(" · ");
}
