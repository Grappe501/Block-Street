/**
 * CAE-11.7-W1 — LocalBrain traceability
 */
import { LIX_LOCALBRAIN_PRINCIPLE } from "./constitution";

export function explainLocalBrainAction(input: {
  human_id: string;
  action_type: string;
  localbrain_id?: string;
  memory_id?: string;
}): string {
  return [
    `Action ${input.action_type}`,
    `Human ${input.human_id}`,
    input.localbrain_id ? `LocalBrain ${input.localbrain_id}` : "No LocalBrain",
    input.memory_id ? `Memory ${input.memory_id}` : "No memory",
    `Principle: ${LIX_LOCALBRAIN_PRINCIPLE}`,
  ].join(" → ");
}

export function getLocalBrainTraceabilityProtocol() {
  return {
    protocol: "11.7-W1",
    principle: LIX_LOCALBRAIN_PRINCIPLE,
    required_fields: ["human_id", "action_type"],
  };
}
