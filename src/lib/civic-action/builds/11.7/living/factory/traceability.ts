/**
 * CAE-11.7-W13 — Factory traceability
 */
import { LIX_FACTORY_PRINCIPLE } from "./constitution";

export function explainFactoryAction(input: {
  human_id: string;
  action_type: string;
  capability_id?: string;
  deployment_id?: string;
}) {
  return [
    `Factory action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.capability_id ? `Capability: ${input.capability_id}` : null,
    input.deployment_id ? `Deployment: ${input.deployment_id}` : null,
    `Principle: ${LIX_FACTORY_PRINCIPLE}`,
    "Governance: Every change is reviewable, reversible, and auditable.",
  ]
    .filter(Boolean)
    .join(" · ");
}
