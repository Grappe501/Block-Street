/**
 * CAE-11.7-W14 — Digital Twin traceability
 */
import { LIX_TWIN_PRINCIPLE } from "./constitution";

export function explainTwinAction(input: {
  human_id: string;
  action_type: string;
  twin_id?: string;
  simulation_id?: string;
}) {
  return [
    `Twin action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.twin_id ? `Twin: ${input.twin_id}` : null,
    input.simulation_id ? `Simulation: ${input.simulation_id}` : null,
    `Principle: ${LIX_TWIN_PRINCIPLE}`,
    "Isolation: Simulation never alters production systems.",
  ]
    .filter(Boolean)
    .join(" · ");
}
