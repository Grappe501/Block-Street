/**
 * CAE-11.7-W12 — Automation traceability
 */
import { LIX_AUTOMATION_PRINCIPLE } from "./constitution";

export function explainAutomationAction(input: {
  human_id: string;
  action_type: string;
  workflow_id?: string;
  run_id?: string;
}) {
  return [
    `Automation action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.workflow_id ? `Workflow: ${input.workflow_id}` : null,
    input.run_id ? `Run: ${input.run_id}` : null,
    `Principle: ${LIX_AUTOMATION_PRINCIPLE}`,
    "Oversight: Every automation remains interruptible and auditable.",
  ]
    .filter(Boolean)
    .join(" · ");
}
