/**
 * CAE-11.2-W3 — Execution command model (OBJ-SVC-001)
 */
import type { CanonicalMissionStatus, CanonicalObjectiveStatus, CanonicalTaskStatus, EvidenceType, ObjectiveType, OutcomeCategory } from "../data-model";

export type ExecutionCommandType =
  | "CreateObjective"
  | "ProposeObjective"
  | "ApproveObjective"
  | "ActivateObjective"
  | "ArchiveObjective"
  | "CreateMission"
  | "AssignMission"
  | "StartMission"
  | "CompleteMission"
  | "CreateTask"
  | "AssignTask"
  | "CompleteTask"
  | "AttachEvidence"
  | "RecordOutcome";

export interface ExecutionCommandEnvelope<T = Record<string, unknown>> {
  command_id: string;
  command_type: ExecutionCommandType;
  actor_human_id: string;
  service_identity_id_optional?: string | null;
  institution_id: string;
  active_membership_id: string;
  initiative_id: string;
  entity_id_optional?: string | null;
  expected_version_optional?: number | null;
  requested_at: string;
  request_id: string;
  correlation_id: string;
  idempotency_key?: string | null;
  reason_optional?: string | null;
  request_source?: "human" | "api" | "automation" | "ai_suggestion";
  payload: T;
}

export interface CreateObjectivePayload {
  initiative_id: string;
  display_name: string;
  objective_type: ObjectiveType;
  purpose: string;
  desired_future_state: string;
  current_state: string;
  executive_owner_human_id: string;
  operational_owner_human_id: string;
  review_authority_human_id: string;
  success_definition: string;
  measurement_strategy: string;
  evidence_requirements: string;
  review_rhythm?: string;
}

export interface TransitionObjectivePayload {
  target_status: CanonicalObjectiveStatus;
}

export interface CreateMissionPayload {
  objective_id: string;
  workstream_id: string;
  display_name: string;
  summary: string;
  purpose: string;
  operational_lead_human_id: string;
}

export interface AssignMissionPayload {
  operational_lead_human_id: string;
  assigned_team_ids?: string[];
}

export interface CreateTaskPayload {
  mission_id: string;
  description: string;
  priority?: number;
}

export interface AssignTaskPayload {
  owner_human_id: string;
  assigned_team_ids?: string[];
}

export interface AttachEvidencePayload {
  linked_entity_id: string;
  linked_entity_type: string;
  evidence_type: EvidenceType;
  description: string;
  uri_optional?: string | null;
}

export interface RecordOutcomePayload {
  objective_id: string;
  observed_result: string;
  expected_result: string;
  variance: string;
  outcome_category: OutcomeCategory;
  confidence: number;
}

export interface ExecutionValidationError {
  code: string;
  message: string;
  field?: string;
  human_message?: string;
  technical_reason?: string;
  suggested_action?: string;
  blocking_requirement?: string;
  reference_id?: string;
}

export interface ExecutionCommandResult {
  success: boolean;
  entity_id: string | null;
  entity_type: string | null;
  previous_status_optional: string | null;
  new_status_optional: string | null;
  version: number | null;
  events: string[];
  warnings: string[];
  next_required_actions: string[];
  validation_errors: ExecutionValidationError[];
  audit_id_optional?: string | null;
}

export const EXECUTION_PERMISSIONS: Record<ExecutionCommandType, string> = {
  CreateObjective: "execution.objective.create",
  ProposeObjective: "execution.objective.propose",
  ApproveObjective: "execution.objective.approve",
  ActivateObjective: "execution.objective.activate",
  ArchiveObjective: "execution.objective.archive",
  CreateMission: "execution.mission.create",
  AssignMission: "execution.mission.assign",
  StartMission: "execution.mission.start",
  CompleteMission: "execution.mission.complete",
  CreateTask: "execution.task.create",
  AssignTask: "execution.task.assign",
  CompleteTask: "execution.task.complete",
  AttachEvidence: "execution.evidence.attach",
  RecordOutcome: "execution.outcome.record",
};

/** Stable contracts required by protocol */
export type ExecutionCommand = ExecutionCommandEnvelope;
export type ExecutionResult = ExecutionCommandResult;

export interface ExecutionEvent {
  event_id: string;
  event_type: string;
  entity_id: string;
  entity_type: string;
  occurred_at: string;
}

export interface ExecutionVersion {
  version_id: string;
  entity_id: string;
  version_number: number;
}

export interface ExecutionPolicy {
  policy_id: string;
  rule: string;
  enforcement: "block" | "warn";
}

export interface ExecutionLifecycle {
  entity_type: string;
  from: string;
  to: string;
  allowed: boolean;
}

export interface ExecutionValidationResult {
  valid: boolean;
  errors: ExecutionValidationError[];
  warnings: string[];
}

export interface ExecutionAuditEntry {
  audit_id: string;
  who: string;
  what: string;
  when: string;
  where: string;
  previous_state: Record<string, unknown> | null;
  new_state: Record<string, unknown>;
  reason: string | null;
  authority: string;
  request_source: string;
}
