/**
 * CAE-11.7-W4 — Communication UI view models (COM-UX-001)
 */
import type { CanonicalConversationStatus } from "../data-model";
import type { CommunicationCommandType } from "../services/commands";

export type CommunicationExperienceRole =
  | "executive"
  | "operational_owner"
  | "mission_lead"
  | "contributor"
  | "volunteer"
  | "viewer";

export type CommunicationUiAction = {
  action_key: CommunicationCommandType | string;
  label: string;
  description: string;
  available: boolean;
  blocked_reason_optional?: string;
  requires_confirmation: boolean;
  endpoint_or_command: string;
  permission_key: string;
};

export type HumanBlockedState = {
  title: string;
  explanation: string;
  items: string[];
  responsible_role?: string;
  next_action?: string;
  support_path?: string;
};

export type ConversationCardView = {
  conversation_id: string;
  display_name: string;
  purpose_summary: string;
  lifecycle_state: CanonicalConversationStatus;
  status_label: string;
  participant_count: number;
  unread_mentions: number;
  href: string;
  mission_id_optional: string | null;
};

export type CollaborationWorkbenchShellView = {
  institution_name: string;
  viewer_role: CommunicationExperienceRole;
  viewer_role_label: string;
  nav_sections: { key: string; label: string; href: string }[];
  active_section_key: string;
};

export type CommunicationsHomeView = {
  shell: CollaborationWorkbenchShellView;
  collaboration_questions: { question: string; answer: string }[];
  todays_brief_href: string;
  priority_conversations: ConversationCardView[];
  mentions: { id: string; text: string; href: string; when: string }[];
  pending_decisions: { id: string; text: string; href: string; status_label: string }[];
  upcoming_meetings: { id: string; title: string; when: string | null; href: string }[];
  action_items: { id: string; description: string; due_date: string | null; href: string }[];
  mission_updates: { id: string; text: string; href: string }[];
  ai_summary_placeholder: string;
  governed_actions: CommunicationUiAction[];
  role_focus: string[];
  empty_state: { title: string; body: string; action_label: string } | null;
};

export type DailyBriefView = {
  shell: CollaborationWorkbenchShellView;
  date_label: string;
  highlights: { id: string; title: string; body: string; tone?: "default" | "warning" | "info" }[];
  conversations_count: number;
  decisions_count: number;
  meetings_count: number;
  action_items_count: number;
  empty_message: string;
};

export type MissionConversationView = {
  shell: CollaborationWorkbenchShellView;
  conversation_id: string;
  mission_id: string;
  display_name: string;
  purpose: string;
  lifecycle_state: CanonicalConversationStatus;
  lifecycle_label: string;
  archived_banner: string | null;
  threads: { id: string; subject: string; message_count: number; resolved: boolean; href: string }[];
  timeline: TimelineEntryView[];
  governed_actions: CommunicationUiAction[];
  ai_suggestion_prompts: string[];
  participants: { human_id: string; label: string; role: string }[];
};

export type TimelineEntryView = {
  id: string;
  author_label: string;
  body: string;
  when: string;
  entity_type: "Message" | "Decision" | "Meeting" | "Document";
};

export type MeetingWorkspaceView = {
  shell: CollaborationWorkbenchShellView;
  meeting_id: string;
  display_name: string;
  purpose: string;
  status_label: string;
  scheduled_at: string | null;
  location: string | null;
  agenda_items: string[];
  minutes_text: string | null;
  action_items: { id: string; description: string; assignee_label: string }[];
  governed_actions: CommunicationUiAction[];
};

export type DecisionWorkspaceView = {
  shell: CollaborationWorkbenchShellView;
  decision_id: string;
  decision_text: string;
  rationale: string;
  status_label: string;
  decided_by_label: string;
  related_messages: { id: string; excerpt: string }[];
  action_items: { id: string; description: string }[];
  governed_actions: CommunicationUiAction[];
};

export type DocumentWorkspaceView = {
  shell: CollaborationWorkbenchShellView;
  document_id: string;
  display_name: string;
  status_label: string;
  content_preview: string;
  editors: string[];
  reviewers: string[];
  governed_actions: CommunicationUiAction[];
};

export type KnowledgeExplorerView = {
  shell: CollaborationWorkbenchShellView;
  entries: { id: string; knowledge_text: string; source_label: string; captured_by_label: string; when: string }[];
  empty_message: string;
};

export type NotificationCenterView = {
  shell: CollaborationWorkbenchShellView;
  notifications: { id: string; title: string; body: string; when: string; read: boolean; href?: string }[];
  unread_count: number;
};

export type CommunicationSearchView = {
  shell: CollaborationWorkbenchShellView;
  query: string;
  parsed_semantic_intent: string;
  results: { id: string; title: string; excerpt: string; entity_type: string; href: string; score: number }[];
  placeholder: string;
};

export type OfflineCacheManifestView = {
  cached_at: string;
  views: { key: string; label: string; stale_after_minutes: number }[];
  sync_status: "fresh" | "stale" | "offline";
  title: string;
  body: string;
};
