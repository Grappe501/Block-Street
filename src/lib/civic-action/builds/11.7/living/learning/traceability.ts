/**
 * CAE-11.7-W7 — Learning traceability
 */
import { LIX_LEARNING_PRINCIPLE } from "./constitution";

export function explainLearningAction(input: {
  human_id: string;
  action_type: string;
  competency_id?: string;
  evidence_based?: boolean;
}) {
  return [
    `Learning action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.competency_id ? `Competency: ${input.competency_id}` : null,
    input.evidence_based !== undefined ? `Evidence-based: ${input.evidence_based}` : null,
    `Principle: ${LIX_LEARNING_PRINCIPLE}`,
    "Authority: Humans govern certifications and evaluations.",
  ]
    .filter(Boolean)
    .join(" · ");
}
