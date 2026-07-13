/**
 * CAE-11.7-W9 — Multi-Agent traceability
 */
import { LIX_AGENT_PRINCIPLE } from "./constitution";

export function explainAgentAction(input: {
  human_id: string;
  action_type: string;
  agent_id?: string;
  task_id?: string;
}) {
  return [
    `Agent action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.agent_id ? `Agent: ${input.agent_id}` : null,
    input.task_id ? `Task: ${input.task_id}` : null,
    `Principle: ${LIX_AGENT_PRINCIPLE}`,
    "Authority: One Human decision-maker.",
  ]
    .filter(Boolean)
    .join(" · ");
}
