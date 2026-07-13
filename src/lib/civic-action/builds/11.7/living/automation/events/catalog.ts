/**
 * CAE-11.7-W12 — Automation events
 */
export const AUTOMATION_EVENT_CATALOG = [
  { event: "workflow.started", domain: "workflow", description: "Governed workflow execution began" },
  { event: "workflow.paused", domain: "workflow", description: "Workflow paused by Human or exception" },
  { event: "workflow.completed", domain: "workflow", description: "Workflow completed with audit trail" },
  { event: "workflow.failed", domain: "workflow", description: "Workflow failed with recovery options" },
  { event: "approval.requested", domain: "approval", description: "Human approval gate triggered" },
  { event: "approval.granted", domain: "approval", description: "Human granted workflow approval" },
  { event: "approval.denied", domain: "approval", description: "Human denied workflow approval" },
  { event: "automation.escalated", domain: "recovery", description: "Workflow escalated to Human review" },
  { event: "automation.recovered", domain: "recovery", description: "Workflow recovered after exception" },
  { event: "workflow.cancelled", domain: "intervention", description: "Human cancelled running workflow" },
] as const;
