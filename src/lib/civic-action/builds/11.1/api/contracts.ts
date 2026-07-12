/**
 * CAE-11.1-W5 — Initiative API contracts (INI-API-001)
 */
import type { CanonicalInitiativeStatus, CanonicalInitiativeType, InitiativeVisibility } from "../data-model";
import type { InitiativeCommandType } from "../services/commands";

export type InitiativeViewLevel = "public" | "member" | "participant" | "owner" | "approver" | "administrator" | "auditor";

export type InitiativeApiContext = {
  actor_human_id: string;
  service_identity_id_optional: string | null;
  institution_id: string;
  institution_membership_id: string;
  initiative_id_optional: string | null;
  request_id: string;
  correlation_id: string;
  idempotency_key_optional: string | null;
  locale: "en" | "es";
  timezone: string;
  effective_permissions: string[];
};

export type InitiativeApiErrorBody = {
  code: string;
  message: string;
  requirement_ids: string[];
  field_errors?: Record<string, string>;
  current_state_optional?: CanonicalInitiativeStatus;
  requested_state_optional?: CanonicalInitiativeStatus;
  retryable: boolean;
  human_blocked?: {
    title: string;
    explanation: string;
    items: string[];
    next_action?: string;
  };
};

export type InitiativeApiMeta = {
  request_id: string;
  correlation_id: string;
  contract_version: string;
  warnings?: string[];
  cursor?: string | null;
  has_more?: boolean;
};

export type InitiativeView = {
  id: string;
  name: string;
  public_name: string | null;
  slug: string;
  type: CanonicalInitiativeType;
  status: CanonicalInitiativeStatus;
  status_label: string;
  governance_class: number;
  visibility: InitiativeVisibility;
  governing_institution_id: string;
  portfolio_category: string | null;
  purpose_summary: string;
  public_description: string | null;
  operational_owner_summary: string | null;
  executive_owner_summary: string | null;
  scope_summary: string | null;
  timeline_summary: string | null;
  readiness_summary: string | null;
  current_charter_version: number | null;
  created_at: string;
  updated_at: string;
  view_level: InitiativeViewLevel;
  permissions: string[];
  available_actions: string[];
  next_required_actions: string[];
};

export type InitiativeListQuery = {
  institution_id?: string;
  status?: string;
  initiative_type?: string;
  owner_human_id?: string;
  search?: string;
  cursor?: string;
  limit?: number;
};

export type InitiativePermissionsView = {
  initiative_id: string;
  available_actions: string[];
  available_commands: InitiativeCommandType[];
  view_level: InitiativeViewLevel;
  note: string;
};

export const INITIATIVE_API_CONTRACT_VERSION = "11.1-w5.1";

export const LIFECYCLE_ACTION_ROUTES: Record<string, InitiativeCommandType> = {
  "submit-for-review": "SubmitInitiativeForReviewCommand",
  "return-for-revision": "ReturnInitiativeForRevisionCommand",
  approve: "ApproveInitiativeCommand",
  "start-preparation": "StartPreparationCommand",
  activate: "ActivateInitiativeCommand",
  "mark-at-risk": "MarkInitiativeAtRiskCommand",
  "clear-risk": "ClearInitiativeRiskCommand",
  pause: "PauseInitiativeCommand",
  resume: "ResumeInitiativeCommand",
  "begin-closeout": "BeginInitiativeCloseoutCommand",
  complete: "CompleteInitiativeCommand",
  archive: "ArchiveInitiativeCommand",
};

export const HIGH_IMPACT_ACTIONS = new Set([
  "activate",
  "approve",
  "archive",
  "complete",
  "pause",
]);
