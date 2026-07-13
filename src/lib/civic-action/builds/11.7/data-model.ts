/**
 * CAE-11.7-W2/W3 — Canonical Communication Data Model (COM-002)
 */
export type CommunicationVisibility =
  | "private"
  | "institution_internal"
  | "initiative_participants"
  | "member_public"
  | "public";

export type GovernanceClassification = 1 | 2 | 3 | 4 | 5;

export type CanonicalConversationStatus = "draft" | "open" | "active" | "resolved" | "archived";

export type CanonicalThreadStatus = "open" | "resolved" | "archived";

export type CanonicalDecisionStatus = "draft" | "proposed" | "approved" | "historical";

export type CanonicalDocumentStatus = "draft" | "review" | "published" | "archived";

export type CanonicalMeetingStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "archived";

export type ContextType = "initiative" | "objective" | "mission" | "organization" | "institution";

export interface CommunicationEntityBase {
  canonical_id: string;
  public_id: string;
  display_name: string;
  canonical_slug: string;
  institution_id: string;
  initiative_id: string;
  parent_object_id: string | null;
  parent_object_type: string | null;
  object_type: string;
  visibility: CommunicationVisibility;
  governance_classification: GovernanceClassification;
  owner_human_id: string;
  created_by: string;
  last_modified_by: string;
  created_at: string;
  updated_at: string;
  current_version: number;
  lifecycle_state: string;
  tags: string[];
  human_summary_optional?: string;
  machine_summary_optional?: string;
}

export interface ConversationRecord extends CommunicationEntityBase {
  object_type: "Conversation";
  lifecycle_state: CanonicalConversationStatus;
  purpose: string;
  context_type: ContextType;
  related_object_id: string;
  related_object_type: string;
  participant_human_ids: string[];
  moderator_human_ids: string[];
  mission_id_optional: string | null;
  objective_id_optional: string | null;
  pinned_message_ids: string[];
  ai_summary_id_optional: string | null;
}

export interface ThreadRecord extends CommunicationEntityBase {
  object_type: "Thread";
  lifecycle_state: CanonicalThreadStatus;
  conversation_id: string;
  subject: string;
  participant_human_ids: string[];
  parent_message_id_optional: string | null;
  resolved: boolean;
  related_decision_ids: string[];
}

export interface MessageRecord extends CommunicationEntityBase {
  object_type: "Message";
  lifecycle_state: "active" | "edited" | "moderated" | "archived";
  conversation_id: string;
  thread_id: string;
  author_human_id: string;
  body: string;
  attachment_ids: string[];
  mention_human_ids: string[];
  reference_object_ids: string[];
  edited_at_optional: string | null;
  edit_reason_optional: string | null;
  is_ai_generated: boolean;
}

export interface DecisionRecord extends CommunicationEntityBase {
  object_type: "Decision";
  lifecycle_state: CanonicalDecisionStatus;
  conversation_id: string;
  thread_id_optional: string | null;
  decision_text: string;
  rationale: string;
  decided_by_human_id: string;
  approved_by_human_id_optional: string | null;
  related_message_ids: string[];
  action_item_ids: string[];
}

export interface MeetingRecord extends CommunicationEntityBase {
  object_type: "Meeting";
  lifecycle_state: CanonicalMeetingStatus;
  purpose: string;
  conversation_id_optional: string | null;
  scheduled_at: string | null;
  location_optional: string | null;
  participant_human_ids: string[];
  agenda_items: string[];
  minutes_text_optional: string | null;
  recording_uri_optional: string | null;
  action_item_ids: string[];
}

export interface DocumentRecord extends CommunicationEntityBase {
  object_type: "Document";
  lifecycle_state: CanonicalDocumentStatus;
  conversation_id_optional: string | null;
  content: string;
  editor_human_ids: string[];
  reviewer_human_ids: string[];
  published_at_optional: string | null;
}

export interface ActionItemRecord extends CommunicationEntityBase {
  object_type: "ActionItem";
  lifecycle_state: "open" | "assigned" | "completed" | "cancelled" | "archived";
  conversation_id: string;
  source_decision_id_optional: string | null;
  source_meeting_id_optional: string | null;
  description: string;
  assignee_human_id: string;
  due_date_optional: string | null;
  mission_sync_status: "pending" | "queued" | "synced" | "failed";
}

export interface KnowledgeRecord extends CommunicationEntityBase {
  object_type: "Knowledge";
  lifecycle_state: "active" | "archived";
  source_conversation_id: string;
  source_entity_id: string;
  source_entity_type: string;
  knowledge_text: string;
  captured_by_human_id: string;
}

export interface AISummaryRecord extends CommunicationEntityBase {
  object_type: "AISummary";
  lifecycle_state: "active" | "superseded" | "archived";
  conversation_id: string;
  thread_id_optional: string | null;
  summary_text: string;
  generated_by_service_id: string;
  requested_by_human_id: string;
  source_message_ids: string[];
  does_not_impersonate_human: true;
}

export interface AnnouncementRecord extends CommunicationEntityBase {
  object_type: "Announcement";
  lifecycle_state: "draft" | "published" | "expired" | "archived";
  audience: string;
  priority: number;
  effective_date: string;
  expiration_date_optional: string | null;
  related_object_id: string;
  related_object_type: string;
  body: string;
  delivery_status: "pending" | "delivered" | "failed";
}

export interface CommunicationVersionRecord {
  version_id: string;
  entity_id: string;
  entity_type: string;
  version_number: number;
  changed_by: string;
  changed_at: string;
  reason: string;
  affected_fields: string[];
  previous_version_id: string | null;
  snapshot: Record<string, unknown>;
}

export interface CommunicationHistoryEvent {
  event_id: string;
  entity_id: string;
  entity_type: string;
  event_type: string;
  institution_id: string;
  initiative_id: string;
  actor_human_id: string;
  occurred_at: string;
  payload: Record<string, unknown>;
}

export const COMMUNICATION_STORE_KEYS = {
  conversations: "communication_conversations",
  threads: "communication_threads",
  messages: "communication_messages",
  decisions: "communication_decisions",
  meetings: "communication_meetings",
  documents: "communication_documents",
  action_items: "communication_action_items",
  knowledge: "communication_knowledge",
  ai_summaries: "communication_ai_summaries",
  announcements: "communication_announcements",
  versions: "communication_versions",
  history: "communication_history_events",
} as const;
