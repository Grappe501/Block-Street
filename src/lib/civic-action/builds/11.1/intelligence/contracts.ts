/**
 * CAE-11.1-W6 — Initiative Intelligence contracts (INI-INT-001)
 * Advisory only — never authoritative for lifecycle mutations.
 */

export type IntelligenceConfidence = "very_high" | "high" | "medium" | "low" | "speculative";

export type RelationshipConfidence = "known" | "verified" | "observed" | "suggested" | "historical" | "unknown";

export type RecommendationType =
  | "opportunity"
  | "warning"
  | "optimization"
  | "relationship"
  | "resource"
  | "training"
  | "historical"
  | "strategic"
  | "operational"
  | "community"
  | "executive"
  | "duplicate";

export type GraphNodeType =
  | "institution"
  | "human"
  | "initiative"
  | "objective"
  | "mission"
  | "organization"
  | "county"
  | "event"
  | "document";

export type GraphEdgeType =
  | "OWNS"
  | "PARTICIPATES_IN"
  | "SUPPORTS"
  | "BLOCKS"
  | "DEPENDS_ON"
  | "CREATED"
  | "APPROVED"
  | "LOCATED_IN"
  | "RELATED_TO"
  | "SUCCESSOR_OF";

export type IntelligenceGraphNode = {
  id: string;
  type: GraphNodeType;
  label: string;
  metadata?: Record<string, unknown>;
};

export type IntelligenceGraphEdge = {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  confidence: RelationshipConfidence;
  strength?: number;
};

export type IntelligenceEvidence = {
  signal_id: string;
  source: string;
  summary: string;
  field_optional?: string;
  event_id_optional?: string;
};

export type InitiativeRecommendation = {
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
  action_href_optional?: string;
  initiative_id_optional?: string;
  related_initiative_ids?: string[];
  dismissible: true;
  advisory_only: true;
  generated_at: string;
};

export type DuplicateCandidate = {
  initiative_id_a: string;
  initiative_id_b: string;
  name_a: string;
  name_b: string;
  similarity_score: number;
  similarity_label: string;
  shared_signals: string[];
  confidence: IntelligenceConfidence;
  compare_href: string;
};

export type OperationalRiskSignal = {
  risk_id: string;
  risk_type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  explanation: string;
  initiative_id: string;
  evidence: IntelligenceEvidence[];
  confidence: IntelligenceConfidence;
};

export type CapacitySnapshot = {
  human_id: string;
  human_label: string;
  initiative_count: number;
  active_initiative_count: number;
  approval_pending_count: number;
  overload_band: "normal" | "elevated" | "high";
  recommendation_optional?: string;
};

export type ExecutiveBrief = {
  brief_id: string;
  institution_id: string;
  generated_at: string;
  todays_priorities: InitiativeRecommendation[];
  critical_risks: OperationalRiskSignal[];
  approvals_waiting: number;
  initiatives_at_risk: number;
  suggested_decisions: string[];
  upcoming_deadlines: string[];
  reading_time_minutes: number;
};

export type CopilotQueryResult = {
  query: string;
  intent: string;
  answer: string;
  answer_es: string;
  confidence: IntelligenceConfidence;
  evidence: IntelligenceEvidence[];
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

export const INTELLIGENCE_CONTRACT_VERSION = "11.1-w6.1";

export const AI_PROHIBITED_ACTIONS = [
  "approve",
  "assign_ownership",
  "spend_money",
  "activate_initiative",
  "close_initiative",
  "invite_human",
  "delete_record",
  "override_governance",
] as const;
