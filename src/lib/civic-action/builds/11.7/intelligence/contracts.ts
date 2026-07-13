/**
 * CAE-11.7-W6 — Communication Intelligence contracts (COM-INT-001)
 * Advisory only — never authoritative for communication mutations.
 */

export type IntelligenceConfidence = "very_high" | "high" | "medium" | "low" | "speculative";

export type RecommendationType =
  | "opportunity"
  | "warning"
  | "optimization"
  | "relationship"
  | "knowledge"
  | "translation"
  | "meeting"
  | "decision"
  | "duplicate"
  | "reminder"
  | "health"
  | "executive";

export type IntelligenceEvidence = {
  signal_id: string;
  source: string;
  summary: string;
  field_optional?: string;
  event_id_optional?: string;
};

export type CommunicationRecommendation = {
  recommendation_id: string;
  recommendation_type: RecommendationType;
  title: string;
  title_es: string;
  why: string;
  why_es: string;
  confidence: IntelligenceConfidence;
  confidence_score: number;
  evidence: IntelligenceEvidence[];
  uncertainty_notes: string[];
  suggested_action: string;
  suggested_action_es: string;
  expected_benefit_optional?: string;
  possible_downside_optional?: string;
  action_href_optional?: string;
  conversation_id_optional?: string;
  initiative_id_optional?: string;
  related_conversation_ids?: string[];
  dismissible: true;
  advisory_only: true;
  generated_at: string;
};

export type DuplicateConversationCandidate = {
  conversation_id_a: string;
  conversation_id_b: string;
  name_a: string;
  name_b: string;
  similarity_score: number;
  similarity_label: string;
  shared_signals: string[];
  confidence: IntelligenceConfidence;
  compare_href: string;
};

export type CommunicationHealthSnapshot = {
  snapshot_id: string;
  institution_id: string;
  initiative_id_optional?: string;
  generated_at: string;
  response_time_score: number;
  decision_latency_score: number;
  meeting_efficiency_score: number;
  overall_health_band: "healthy" | "watch" | "strained";
  unanswered_questions: number;
  stalled_threads: number;
  pending_decisions: number;
  advisory_only: true;
};

export type ExecutiveCommunicationBrief = {
  brief_id: string;
  institution_id: string;
  initiative_id_optional?: string;
  generated_at: string;
  todays_priorities: CommunicationRecommendation[];
  conversations_at_risk: number;
  communication_momentum: string;
  critical_health_signals: string[];
  pending_decisions: string[];
  suggested_conversations: string[];
  upcoming_meetings: string[];
  knowledge_gaps: string[];
  reading_time_minutes: number;
};

export type KnowledgeGraphNode = {
  node_id: string;
  node_type: "conversation" | "mission" | "decision" | "document" | "meeting" | "knowledge" | "initiative" | "person";
  label: string;
  institution_id: string;
  initiative_id: string;
};

export type KnowledgeGraphEdge = {
  edge_id: string;
  source_id: string;
  source_type: string;
  target_id: string;
  target_type: string;
  relationship: string;
  institution_id: string;
  initiative_id: string;
};

export type KnowledgeGraphView = {
  graph_id: string;
  anchor_id: string;
  anchor_type: string;
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  node_count: number;
  edge_count: number;
  advisory_only: true;
};

export type CopilotResponse = {
  query: string;
  intent: string;
  answer: string;
  answer_es: string;
  confidence: IntelligenceConfidence;
  evidence: IntelligenceEvidence[];
  alternative_interpretation_optional?: string;
  who_should_review_optional?: string;
  advisory_only: true;
  governance_note: string;
};

export type RecommendationFeedbackAction =
  | "accept"
  | "dismiss"
  | "already_handled"
  | "not_relevant"
  | "wrong"
  | "helpful";

export type RecommendationFeedback = {
  feedback_id: string;
  recommendation_id: string;
  action: RecommendationFeedbackAction;
  actor_human_id: string;
  institution_id: string;
  recorded_at: string;
  notes_optional?: string;
};

export type CommunicationPortfolioIntelligence = {
  institution_id: string;
  initiative_id_optional?: string;
  total_conversations: number;
  active_conversations: number;
  unresolved_threads: number;
  pending_decisions: number;
  health_summary: string;
  advisory_only: true;
};

export const INTELLIGENCE_CONTRACT_VERSION = "11.7-w6.1";

export const AI_PROHIBITED_ACTIONS = [
  "approve",
  "send_message",
  "post_message",
  "record_decision",
  "decide",
  "archive_conversation",
  "publish_announcement",
  "assign_action_item",
  "schedule_meeting_authoritative",
  "delete_record",
  "override_governance",
  "invite_human",
  "moderate_message_authoritative",
  "publish_document_authoritative",
] as const;
