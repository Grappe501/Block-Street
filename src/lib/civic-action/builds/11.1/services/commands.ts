/**
 * CAE-11.1-W3 — Initiative command model (INI-SVC-001)
 */
import type { CanonicalInitiativeStatus, GovernanceClass, InitiativeVisibility } from "../data-model";

export type InitiativeCommandType =
  | "CreateInitiativeDraftCommand"
  | "UpdateInitiativeDraftCommand"
  | "SubmitInitiativeForReviewCommand"
  | "ApproveInitiativeCommand"
  | "ReturnInitiativeForRevisionCommand"
  | "StartPreparationCommand"
  | "ActivateInitiativeCommand"
  | "PauseInitiativeCommand"
  | "ResumeInitiativeCommand"
  | "MarkInitiativeAtRiskCommand"
  | "ClearInitiativeRiskCommand"
  | "RequestScopeChangeCommand"
  | "ApproveScopeChangeCommand"
  | "TransferOperationalOwnershipCommand"
  | "AddInitiativeDependencyCommand"
  | "RemoveInitiativeDependencyCommand"
  | "RequestInitiativeCancellationCommand"
  | "ApproveInitiativeCancellationCommand"
  | "BeginInitiativeCloseoutCommand"
  | "CompleteInitiativeCommand"
  | "ArchiveInitiativeCommand"
  | "CreateSuccessorInitiativeCommand"
  | "RestoreInitiativeCommand";

export interface InitiativeCommandEnvelope<T = Record<string, unknown>> {
  command_id: string;
  command_type: InitiativeCommandType;
  actor_human_id: string;
  service_identity_id_optional?: string | null;
  institution_id: string;
  active_membership_id: string;
  initiative_id_optional?: string | null;
  expected_version_optional?: number | null;
  requested_at: string;
  request_id: string;
  correlation_id: string;
  idempotency_key?: string | null;
  reason_optional?: string | null;
  payload: T;
}

export interface CreateDraftPayload {
  governing_institution_id: string;
  initiative_name: string;
  initiative_type: string;
  initial_problem_or_opportunity: string;
  proposed_operational_owner_optional?: string | null;
  visibility: InitiativeVisibility;
}

export interface TransitionPayload {
  target_status: CanonicalInitiativeStatus;
  reason?: string;
}

export interface TransferOwnerPayload {
  proposed_operational_owner_human_id: string;
  reason: string;
}

export interface AddDependencyPayload {
  dependency_type: string;
  target_type: string;
  target_id: string;
  description: string;
  blocks_activation?: boolean;
}

export interface CompleteInitiativePayload {
  completion_classification: string;
  objectives_summary: string;
  unfinished_work?: string;
  lessons?: string;
}

export interface InitiativeCommandResult {
  success: boolean;
  initiative_id: string | null;
  previous_status_optional: CanonicalInitiativeStatus | null;
  new_status_optional: CanonicalInitiativeStatus | null;
  version: number | null;
  events: string[];
  warnings: string[];
  next_required_actions: string[];
  validation_errors: { code: string; message: string; field?: string }[];
}

export const INITIATIVE_PERMISSIONS = {
  "CreateInitiativeDraftCommand": "initiative.draft.create",
  "UpdateInitiativeDraftCommand": "initiative.draft.edit",
  "SubmitInitiativeForReviewCommand": "initiative.review.submit",
  "ReturnInitiativeForRevisionCommand": "initiative.review.return",
  "ApproveInitiativeCommand": "initiative.approve",
  "StartPreparationCommand": "initiative.activate",
  "ActivateInitiativeCommand": "initiative.activate",
  "PauseInitiativeCommand": "initiative.pause",
  "ResumeInitiativeCommand": "initiative.resume",
  "MarkInitiativeAtRiskCommand": "initiative.risk.set",
  "ClearInitiativeRiskCommand": "initiative.risk.set",
  "RequestScopeChangeCommand": "initiative.scope.request_change",
  "ApproveScopeChangeCommand": "initiative.scope.approve_change",
  "TransferOperationalOwnershipCommand": "initiative.owner.transfer",
  "AddInitiativeDependencyCommand": "initiative.dependency.manage",
  "RemoveInitiativeDependencyCommand": "initiative.dependency.manage",
  "RequestInitiativeCancellationCommand": "initiative.cancel.request",
  "ApproveInitiativeCancellationCommand": "initiative.cancel.approve",
  "BeginInitiativeCloseoutCommand": "initiative.closeout.begin",
  "CompleteInitiativeCommand": "initiative.complete",
  "ArchiveInitiativeCommand": "initiative.archive",
  "CreateSuccessorInitiativeCommand": "initiative.draft.create",
  "RestoreInitiativeCommand": "initiative.restore",
} as const;
