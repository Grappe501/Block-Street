/**
 * CAE-11.2-W5 — Objective API contracts (OBJ-API-001)
 */
import type { CanonicalObjectiveStatus, ObjectiveType } from "../data-model";
import type { ExecutionCommandType } from "../services/commands";

export type ObjectiveViewLevel =
  | "public"
  | "member"
  | "contributor"
  | "owner"
  | "executive"
  | "administrator"
  | "auditor";

export type ObjectiveApiContext = {
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

export type ObjectiveApiErrorBody = {
  code: string;
  message: string;
  requirement_ids: string[];
  field_errors?: Record<string, string>;
  current_state_optional?: CanonicalObjectiveStatus;
  requested_state_optional?: CanonicalObjectiveStatus;
  retryable: boolean;
  human_blocked?: {
    title: string;
    explanation: string;
    items: string[];
    next_action?: string;
  };
};

export type ObjectiveApiMeta = {
  request_id: string;
  correlation_id: string;
  contract_version: string;
  warnings?: string[];
  cursor?: string | null;
  has_more?: boolean;
};

export type ObjectiveView = {
  id: string;
  initiative_id: string;
  institution_id: string;
  display_name: string;
  objective_type: ObjectiveType;
  type_label: string;
  lifecycle_state: CanonicalObjectiveStatus;
  status_label: string;
  health_label: string;
  purpose_summary: string;
  desired_future_state: string;
  current_state: string;
  executive_owner_summary: string | null;
  operational_owner_summary: string | null;
  progress_percent: number | null;
  created_at: string;
  updated_at: string;
  view_level: ObjectiveViewLevel;
  permissions: string[];
  available_actions: string[];
  next_required_actions: string[];
};

export type ObjectiveListQuery = {
  initiative_id?: string;
  institution_id?: string;
  status?: string;
  objective_type?: string;
  owner_human_id?: string;
  search?: string;
  cursor?: string;
  limit?: number;
};

export type ObjectivePermissionsView = {
  objective_id: string;
  initiative_id: string;
  available_actions: string[];
  available_commands: ExecutionCommandType[];
  view_level: ObjectiveViewLevel;
  note: string;
};

export const OBJECTIVE_API_CONTRACT_VERSION = "11.2-w5.1";

export const LIFECYCLE_ACTION_ROUTES: Record<string, ExecutionCommandType> = {
  propose: "ProposeObjective",
  approve: "ApproveObjective",
  activate: "ActivateObjective",
  archive: "ArchiveObjective",
};

export const HIGH_IMPACT_ACTIONS = new Set(["activate", "approve", "archive"]);

export const IDEMPOTENT_COMMANDS = new Set<ExecutionCommandType>([
  "AssignMission",
  "AttachEvidence",
  "AssignTask",
]);
