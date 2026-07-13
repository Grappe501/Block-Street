/**
 * CAE-11.7-W4 — Organizer traceability
 */
import { LIX_ORGANIZER_PRINCIPLE } from "./constitution";

export function explainOrganizerAction(input: {
  human_id: string;
  action_type: string;
  institution_id?: string;
  confidence?: number;
}) {
  return [
    `Organizer action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.institution_id ? `Institution: ${input.institution_id}` : null,
    input.confidence !== undefined ? `Confidence: ${input.confidence}` : null,
    `Principle: ${LIX_ORGANIZER_PRINCIPLE}`,
    "Authority: Human performs work; organizer coordinates only.",
  ]
    .filter(Boolean)
    .join(" · ");
}
