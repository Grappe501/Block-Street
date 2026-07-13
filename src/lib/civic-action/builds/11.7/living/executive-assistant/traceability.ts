/**
 * CAE-11.7-W3 — Executive Assistant traceability
 */
import { LIX_EXECUTIVE_PRINCIPLE } from "./constitution";

export function explainExecutiveAction(input: {
  human_id: string;
  action_type: string;
  institution_id?: string;
  confidence?: number;
}) {
  return [
    `Executive action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.institution_id ? `Institution: ${input.institution_id}` : null,
    input.confidence !== undefined ? `Confidence: ${input.confidence}` : null,
    `Principle: ${LIX_EXECUTIVE_PRINCIPLE}`,
    "Authority: Human retains decision; assistant prepares only.",
  ]
    .filter(Boolean)
    .join(" · ");
}
