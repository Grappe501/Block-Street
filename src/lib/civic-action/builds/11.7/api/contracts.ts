/**
 * CAE-11.7-W5 — Communication API contracts (COM-API-001)
 */
import type { CanonicalConversationStatus, ContextType } from "../data-model";
import type { CommunicationCommandType } from "../services/commands";

export type CommunicationViewLevel =
  | "public"
  | "member"
  | "contributor"
  | "owner"
  | "executive"
  | "administrator"
  | "auditor";

export type CommunicationApiContext = {
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

export type CommunicationApiErrorBody = {
  code: string;
  message: string;
  requirement_ids: string[];
  field_errors?: Record<string, string>;
  current_state_optional?: string;
  requested_state_optional?: string;
  retryable: boolean;
  human_blocked?: {
    title: string;
    explanation: string;
    items: string[];
    next_action?: string;
  };
};

export type CommunicationApiMeta = {
  request_id: string;
  correlation_id: string;
  contract_version: string;
  warnings?: string[];
  cursor?: string | null;
  has_more?: boolean;
};

export type ConversationView = {
  id: string;
  initiative_id: string;
  institution_id: string;
  display_name: string;
  context_type: ContextType;
  lifecycle_state: CanonicalConversationStatus;
  status_label: string;
  purpose_summary: string;
  owner_summary: string | null;
  participant_count: number;
  thread_count: number;
  mission_id_optional: string | null;
  created_at: string;
  updated_at: string;
  view_level: CommunicationViewLevel;
  permissions: string[];
  available_actions: string[];
};

export type ConversationListQuery = {
  initiative_id?: string;
  institution_id?: string;
  status?: string;
  context_type?: string;
  mission_id?: string;
  search?: string;
  cursor?: string;
  limit?: number;
};

export type MessageListQuery = {
  conversation_id?: string;
  thread_id?: string;
  initiative_id?: string;
  cursor?: string;
  limit?: number;
};

export const COMMUNICATION_API_CONTRACT_VERSION = "11.7-w5.1";

export const LIFECYCLE_ACTION_ROUTES: Record<string, CommunicationCommandType> = {
  archive: "ArchiveConversation",
  restore: "ArchiveConversation",
  "resolve-thread": "ResolveThread",
  "record-decision": "RecordDecision",
  "publish-announcement": "PublishAnnouncement",
};

export const HIGH_IMPACT_ACTIONS = new Set(["archive", "record-decision", "publish-announcement"]);

export const IDEMPOTENT_COMMANDS = new Set<CommunicationCommandType>([
  "PostMessage",
  "EditMessage",
  "CreateActionItem",
  "CreateThread",
]);
