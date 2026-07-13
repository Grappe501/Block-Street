/**
 * CAE-11.7-W5 — Research Network traceability
 */
import { LIX_RESEARCH_PRINCIPLE } from "./constitution";

export function explainResearchAction(input: {
  human_id: string;
  action_type: string;
  source_id?: string;
  confidence?: number;
}) {
  return [
    `Research action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.source_id ? `Source: ${input.source_id}` : null,
    input.confidence !== undefined ? `Confidence: ${input.confidence}` : null,
    `Principle: ${LIX_RESEARCH_PRINCIPLE}`,
    "Authority: Humans determine meaning and use.",
  ]
    .filter(Boolean)
    .join(" · ");
}
