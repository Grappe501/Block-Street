/**
 * CAE-11.7-W15 — Kernel traceability
 */
import { LIX_KERNEL_PRINCIPLE } from "./constitution";

export function explainKernelAction(input: {
  human_id: string;
  action_type: string;
  execution_id?: string;
  institution_id?: string;
}) {
  return [
    `Kernel action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.institution_id ? `Institution: ${input.institution_id}` : null,
    input.execution_id ? `Execution: ${input.execution_id}` : null,
    `Principle: ${LIX_KERNEL_PRINCIPLE}`,
    "Enforcement: Every action evaluates identity, permission, policy, and audit.",
  ]
    .filter(Boolean)
    .join(" · ");
}
