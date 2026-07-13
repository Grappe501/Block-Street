/**
 * CAE-11.7-W3 — Communication command model (COM-SVC-001)
 */
import type { CanonicalConversationStatus, CanonicalDecisionStatus, ContextType } from "../data-model";

export type CommunicationCommandType =
  | "CreateConversation"
  | "CreateThread"
  | "PostMessage"
  | "EditMessage"
  | "RecordDecision"
  | "CreateMeeting"
  | "PublishAnnouncement"
  | "CreateDocument"
  | "ArchiveConversation"
  | "GenerateAISummary"
  | "CreateActionItem"
  | "ResolveThread";

export interface CommunicationCommandEnvelope<T = Record<string, unknown>> {
  command_id: string;
  command_type: CommunicationCommandType;
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

export interface CreateConversationPayload {
  purpose: string;
  context_type: ContextType;
  related_object_id: string;
  related_object_type: string;
  display_name: string;
  participant_human_ids: string[];
  mission_id_optional?: string | null;
  objective_id_optional?: string | null;
  visibility?: string;
}

export interface CreateThreadPayload {
  conversation_id: string;
  subject: string;
  participant_human_ids?: string[];
  parent_message_id_optional?: string | null;
}

export interface PostMessagePayload {
  conversation_id: string;
  thread_id: string;
  body: string;
  mention_human_ids?: string[];
  attachment_ids?: string[];
}

export interface EditMessagePayload {
  message_id: string;
  body: string;
  edit_reason?: string;
}

export interface RecordDecisionPayload {
  conversation_id: string;
  thread_id_optional?: string | null;
  decision_text: string;
  rationale: string;
  related_message_ids?: string[];
  action_items?: { description: string; assignee_human_id: string; due_date_optional?: string | null }[];
}

export interface CreateMeetingPayload {
  purpose: string;
  display_name: string;
  conversation_id_optional?: string | null;
  scheduled_at: string;
  participant_human_ids: string[];
  location_optional?: string | null;
  agenda_items?: string[];
}

export interface PublishAnnouncementPayload {
  display_name: string;
  audience: string;
  priority?: number;
  effective_date: string;
  expiration_date_optional?: string | null;
  related_object_id: string;
  related_object_type: string;
  body: string;
}

export interface CreateDocumentPayload {
  display_name: string;
  content: string;
  conversation_id_optional?: string | null;
  editor_human_ids?: string[];
}

export interface ArchiveConversationPayload {
  conversation_id: string;
  target_status?: CanonicalConversationStatus;
}

export interface GenerateAISummaryPayload {
  conversation_id: string;
  thread_id_optional?: string | null;
  source_message_ids: string[];
  summary_text: string;
  service_identity_id: string;
}

export interface CreateActionItemPayload {
  conversation_id: string;
  description: string;
  assignee_human_id: string;
  source_decision_id_optional?: string | null;
  due_date_optional?: string | null;
}

export interface ResolveThreadPayload {
  thread_id: string;
}

export interface CommunicationValidationError {
  code: string;
  message: string;
  field?: string;
  human_message?: string;
  technical_reason?: string;
  suggested_action?: string;
  blocking_requirement?: string;
  reference_id?: string;
}

export interface CommunicationCommandResult {
  success: boolean;
  entity_id: string | null;
  entity_type: string | null;
  previous_status_optional: string | null;
  new_status_optional: string | null;
  version: number | null;
  events: string[];
  warnings: string[];
  next_required_actions: string[];
  validation_errors: CommunicationValidationError[];
  audit_id_optional?: string | null;
}

export const COMMUNICATION_PERMISSIONS: Record<CommunicationCommandType, string> = {
  CreateConversation: "communication.conversation.create",
  CreateThread: "communication.thread.create",
  PostMessage: "communication.message.post",
  EditMessage: "communication.message.edit",
  RecordDecision: "communication.decision.record",
  CreateMeeting: "communication.meeting.create",
  PublishAnnouncement: "communication.announcement.publish",
  CreateDocument: "communication.document.create",
  ArchiveConversation: "communication.conversation.archive",
  GenerateAISummary: "communication.ai.summary",
  CreateActionItem: "communication.action_item.create",
  ResolveThread: "communication.thread.resolve",
};

export type CommunicationCommand = CommunicationCommandEnvelope;
export type CommunicationResult = CommunicationCommandResult;

export interface CommunicationAuditEntry {
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

export interface CommunicationValidationResult {
  valid: boolean;
  errors: CommunicationValidationError[];
  warnings: string[];
}

export interface TransitionDecisionPayload {
  target_status: CanonicalDecisionStatus;
}
