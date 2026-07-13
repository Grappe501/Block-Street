/**
 * CAE-11.7-W2 — Context traceability
 */
import { LIX_CONTEXT_PRINCIPLE } from "./constitution";

export function explainContextAction(input: {
  human_id: string;
  action_type: string;
  context_id?: string;
  source?: string;
  confidence?: number;
}): string {
  return [
    `Action ${input.action_type}`,
    `Human ${input.human_id}`,
    input.context_id ? `Context ${input.context_id}` : "No context",
    input.source ? `Source ${input.source}` : "No source",
    input.confidence !== undefined ? `Confidence ${input.confidence}` : "",
    `Principle: ${LIX_CONTEXT_PRINCIPLE}`,
  ]
    .filter(Boolean)
    .join(" → ");
}
