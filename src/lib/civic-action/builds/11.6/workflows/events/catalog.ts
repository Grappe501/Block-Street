/**
 * CAE-11.6-W9 — Workflow events
 */
export const WORKFLOW_EVENT_CATALOG = [
  { event: "workflow.created", domain: "workflow", description: "Workflow created in draft" },
  { event: "workflow.published", domain: "workflow", description: "Workflow published and immutable" },
  { event: "workflow.executed", domain: "execution", description: "Workflow execution started" },
  { event: "workflow.completed", domain: "execution", description: "Workflow execution completed" },
  { event: "workflow.failed", domain: "execution", description: "Workflow execution failed" },
  { event: "approval.requested", domain: "approval", description: "Human approval gate requested" },
  { event: "approval.completed", domain: "approval", description: "Approval gate resolved" },
  { event: "automation.escalated", domain: "escalation", description: "Workflow escalated to Human" },
  { event: "AI.workflow.generated", domain: "ai", description: "AI recommended or generated workflow" },
  { event: "workflow.archived", domain: "workflow", description: "Workflow archived" },
] as const;
