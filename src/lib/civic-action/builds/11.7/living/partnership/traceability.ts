/**
 * CAE-11.7-W10 — Partnership traceability
 */
import { LIX_PARTNERSHIP_PRINCIPLE } from "./constitution";

export function explainPartnershipAction(input: {
  human_id: string;
  action_type: string;
  recommendation_id?: string;
  trust_score?: number;
}) {
  return [
    `Partnership action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.recommendation_id ? `Recommendation: ${input.recommendation_id}` : null,
    input.trust_score !== undefined ? `Trust: ${input.trust_score.toFixed(2)}` : null,
    `Principle: ${LIX_PARTNERSHIP_PRINCIPLE}`,
    "Authority: Recommendations are invitations—not instructions.",
  ]
    .filter(Boolean)
    .join(" · ");
}
