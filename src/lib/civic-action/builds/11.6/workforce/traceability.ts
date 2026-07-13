/**
 * CAE-11.6-W3 — Assignment traceability
 */
import type { WorkAssignmentRecord } from "./data-model";
import { OPS_WORKFORCE_PRINCIPLE } from "./constitution";

export function validateAssignmentTraceability(assignment: Pick<WorkAssignmentRecord, "mission_id" | "institution_id">): boolean {
  return !!(assignment.mission_id && assignment.institution_id);
}

export function explainAssignment(assignment: WorkAssignmentRecord): string {
  const parts = [`Mission ${assignment.mission_id}`];
  if (assignment.objective_id) parts.push(`Objective ${assignment.objective_id}`);
  if (assignment.strategic_goal_id) parts.push(`Goal ${assignment.strategic_goal_id}`);
  return `Assignment supports: ${parts.join(" → ")}`;
}

export function getWorkforceTraceabilityProtocol() {
  return {
    protocol: "11.6-W3",
    principle: OPS_WORKFORCE_PRINCIPLE,
    required_fields: ["mission_id", "institution_id", "human_id", "assigned_by"],
  };
}
