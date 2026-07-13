/**
 * CAE-11.6-W7 — Communications data model
 */
import type { CONVERSATION_LIFECYCLE, CONVERSATION_TYPES } from "./constitution";

export type ConversationType = (typeof CONVERSATION_TYPES)[number];
export type ConversationLifecycle = (typeof CONVERSATION_LIFECYCLE)[number];

export interface ConversationRecord {
  conversation_id: string;
  institution_id: string;
  conversation_type: ConversationType;
  title: string;
  description: string;
  status: ConversationLifecycle;
  visibility: "public" | "institution" | "mission" | "team" | "private" | "executive_only";
  owner_human_id: string;
  participant_human_ids: string[];
  mission_id: string | null;
  organization_unit_id: string | null;
  calendar_reference: string | null;
  created_at: string;
  updated_at: string;
}

export interface ThreadRecord {
  thread_id: string;
  conversation_id: string;
  institution_id: string;
  title: string;
  created_by: string;
  status: "open" | "resolved" | "archived";
  priority: "low" | "normal" | "high" | "critical";
  tags: string[];
  resolved: boolean;
  knowledge_candidate: boolean;
  created_at: string;
}

export interface MessageRecord {
  message_id: string;
  thread_id: string;
  conversation_id: string;
  institution_id: string;
  author_human_id: string;
  timestamp: string;
  body: string;
  attachments: string[];
  mentions: string[];
  reactions: Record<string, string[]>;
  reply_to_message_id: string | null;
  edited: boolean;
  edit_versions: { body: string; edited_at: string }[];
  language: string;
  translation_status: "none" | "pending" | "completed" | "human_reviewed";
  ai_summary_reference: string | null;
  classification: "discussion" | "decision" | "action" | "announcement" | "system";
  visibility: "thread" | "conversation" | "institution";
}

export interface AnnouncementRecord {
  announcement_id: string;
  institution_id: string;
  title: string;
  body: string;
  scope: "institution" | "department" | "mission" | "team" | "committee" | "emergency" | "executive";
  scope_id: string | null;
  requires_acknowledgment: boolean;
  published_by: string;
  published_at: string;
  status: "draft" | "published" | "archived";
}

export interface BroadcastRecord {
  broadcast_id: string;
  institution_id: string;
  announcement_id: string | null;
  message_id: string | null;
  channels: ("email" | "sms" | "push" | "in_app" | "voice" | "printed")[];
  delivery_status: "pending" | "sent" | "failed";
  sent_at: string | null;
  recipient_count: number;
}

export interface MeetingWorkspaceRecord {
  meeting_id: string;
  institution_id: string;
  conversation_id: string;
  calendar_event_id: string | null;
  title: string;
  agenda: string[];
  participant_human_ids: string[];
  attendance: string[];
  decisions: string[];
  action_item_ids: string[];
  ai_summary: string | null;
  minutes: string | null;
  status: "scheduled" | "active" | "completed";
  created_at: string;
}

export interface DecisionLedgerRecord {
  decision_id: string;
  institution_id: string;
  conversation_id: string;
  thread_id: string;
  message_id: string | null;
  decision: string;
  reason: string;
  evidence: string[];
  approved_by: string;
  effective_date: string;
  affected_mission_ids: string[];
  recorded_at: string;
}

export interface ActionItemRecord {
  action_id: string;
  institution_id: string;
  source_message_id: string;
  conversation_id: string;
  title: string;
  description: string;
  assigned_to: string | null;
  mission_id: string | null;
  status: "proposed" | "approved" | "in_progress" | "completed";
  requires_approval: boolean;
  created_at: string;
}

export interface CommunicationAnalyticsRecord {
  analytics_id: string;
  institution_id: string;
  response_time_avg_hours: number;
  participation_rate: number;
  announcement_reach: number;
  mission_engagement: number;
  knowledge_candidates: number;
  computed_at: string;
}

export const COMMUNICATIONS_STORE_KEYS = {
  conversations: "ops_conversations",
  threads: "ops_comm_threads",
  messages: "ops_comm_messages",
  announcements: "ops_announcements",
  broadcasts: "ops_broadcasts",
  meetings: "ops_meeting_workspaces",
  decisions: "ops_decision_ledger",
  action_items: "ops_comm_action_items",
  analytics: "ops_comm_analytics",
} as const;
