/**
 * CAE-11.7-W6 — Conversation data model
 */
import type { CONVERSATION_CHANNELS, RECORDING_STATES } from "./constitution";

export type RecordingState = (typeof RECORDING_STATES)[number];
export type ConversationChannel = (typeof CONVERSATION_CHANNELS)[number];

export const CONVERSATION_STORE_KEYS = {
  conversations: "lix_conversations",
  consents: "lix_conversation_consents",
  recordings: "lix_conversation_recordings",
  speakers: "lix_conversation_speakers",
  transcripts: "lix_conversation_transcripts",
  translations: "lix_conversation_translations",
  meetings: "lix_meeting_memory",
  decisions: "lix_conversation_decisions",
  commitments: "lix_conversation_commitments",
  actions: "lix_conversation_actions",
  dialogue: "lix_dialogue_graph",
  search: "lix_conversation_search_index",
} as const;

export interface ConversationRecord {
  conversation_id: string;
  human_id: string;
  institution_id: string;
  localbrain_id: string;
  mission_id: string | null;
  channel: ConversationChannel;
  title: string;
  started_at: string;
  ended_at: string | null;
  consent_status: RecordingState;
  recording_status: RecordingState;
  participants: string[];
  source: string;
  evidence_links: string[];
  version: number;
  anonymous: false;
}

export interface ConsentRecord {
  consent_id: string;
  conversation_id: string;
  human_id: string;
  institution_id: string;
  status: "granted" | "denied" | "required" | "revoked";
  jurisdiction_rules: string[];
  retention_policy: string;
  recorded_at: string;
}

export interface RecordingRecord {
  recording_id: string;
  conversation_id: string;
  human_id: string;
  institution_id: string;
  recording_state: RecordingState;
  authorized_by: string;
  captured_at: string;
  secret: false;
}

export interface SpeakerRecord {
  speaker_id: string;
  conversation_id: string;
  identity_id: string | null;
  display_name: string;
  institution_id: string;
  role: string | null;
  confidence: number;
  invented: false;
  speaking_intervals: { start: string; end: string }[];
  participation_summary: string;
}

export interface TranscriptRecord {
  transcript_id: string;
  conversation_id: string;
  human_id: string;
  institution_id: string;
  transcript_type: "verbatim" | "readable" | "corrected" | "timestamped" | "speaker_separated";
  content: string;
  confidence: number;
  version: number;
  original_preserved: true;
  generated_at: string;
}

export interface TranslationRecord {
  translation_id: string;
  transcript_id: string;
  conversation_id: string;
  original_language: string;
  translated_language: string;
  parallel_content: { original: string; translated: string }[];
  confidence: number;
  reviewer_corrections: string[];
  generated_at: string;
}

export interface MeetingMemoryRecord {
  meeting_id: string;
  conversation_id: string;
  human_id: string;
  institution_id: string;
  title: string;
  agenda: string[];
  attendance: string[];
  discussion_timeline: { time: string; topic: string; speaker: string }[];
  evidence_used: string[];
  documents_referenced: string[];
  questions: string[];
  decisions: string[];
  votes: string[];
  follow_up: string[];
  lessons_learned: string[];
  institutional_context: string;
  searchable: true;
}

export interface ConversationDecisionRecord {
  decision_id: string;
  conversation_id: string;
  human_id: string;
  institution_id: string;
  decision_type: "formal" | "consensus" | "deferred" | "rejected" | "pending_approval";
  summary: string;
  evidence: string[];
  confidence: number;
  human_confirmed: boolean;
  canonical: false;
  detected_at: string;
}

export interface ConversationCommitmentRecord {
  commitment_id: string;
  conversation_id: string;
  human_id: string;
  institution_id: string;
  assignee_id: string | null;
  commitment_text: string;
  deadline: string | null;
  evidence: string[];
  confidence: number;
  human_confirmed: boolean;
  canonical: false;
  detected_at: string;
}

export interface ActionSuggestionRecord {
  action_id: string;
  conversation_id: string;
  human_id: string;
  institution_id: string;
  action_type: "task" | "delegation" | "checklist" | "follow_up" | "document_update" | "research_request" | "training_request";
  title: string;
  description: string;
  confidence: number;
  auto_executed: false;
  status: "suggested" | "accepted" | "dismissed";
}

export interface DialogueGraphNode {
  node_id: string;
  institution_id: string;
  node_type: "person" | "meeting" | "topic" | "policy" | "research" | "mission" | "organization" | "project" | "document" | "question" | "evidence";
  label: string;
  reference_id: string;
  linked_nodes: string[];
  created_at: string;
}

export interface ConversationSearchRecord {
  search_id: string;
  human_id: string;
  institution_id: string;
  query: string;
  results: { conversation_id: string; excerpt: string; confidence: number; evidence: string[] }[];
  searched_at: string;
}
