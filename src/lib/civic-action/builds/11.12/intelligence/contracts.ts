/**
 * CAE-11.12-W6 — Knowledge Intelligence contracts (KNW-INT-001)
 * Advisory only — never authoritative for canonical knowledge mutations.
 */

export type IntelligenceConfidence = "very_high" | "high" | "medium" | "low" | "speculative";

export type IntelligenceResultState =
  | "complete"
  | "complete_with_limitations"
  | "insufficient_evidence"
  | "conflicting_evidence"
  | "human_review_required"
  | "permission_restricted"
  | "unavailable"
  | "failed";

export type IntelligenceRequestType =
  | "knowledge_query"
  | "knowledge_related"
  | "knowledge_impact"
  | "knowledge_health"
  | "knowledge_gaps"
  | "learning_recommendations"
  | "learning_next_step"
  | "capability_coverage"
  | "role_readiness"
  | "certification_readiness"
  | "research_synthesize"
  | "memory_query"
  | "tutor_turn"
  | "executive_brief"
  | "copilot_query";

export type IntelligenceEvidenceReference = {
  signal_id: string;
  source_type: string;
  entity_id: string;
  entity_type: string;
  summary: string;
  canonical_version?: number;
  publication_state?: string;
};

export type IntelligenceRequest = {
  intelligence_request_id: string;
  request_type: IntelligenceRequestType;
  institution_id: string;
  requesting_human_id: string;
  service_identity_id_optional?: string | null;
  purpose: string;
  target_entity_type_optional?: string | null;
  target_entity_id_optional?: string | null;
  course_id_optional?: string | null;
  lesson_id_optional?: string | null;
  competency_id_optional?: string | null;
  language: "en" | "es";
  requested_depth: "summary" | "standard" | "deep";
  privacy_context?: string;
  query_optional?: string;
  request_id: string;
  correlation_id: string;
  created_at: string;
};

export type IntelligenceResult = {
  intelligence_result_id: string;
  request_type: IntelligenceRequestType;
  result_state: IntelligenceResultState;
  answer_or_recommendation: string;
  reasoning_summary: string;
  evidence_references: IntelligenceEvidenceReference[];
  canonical_versions_used: { entity_id: string; entity_type: string; version: number }[];
  confidence: IntelligenceConfidence;
  assumptions: string[];
  limitations: string[];
  conflicting_evidence: string[];
  freshness_status: "current" | "mixed" | "historical" | "unknown";
  human_review_required: boolean;
  permitted_next_actions: string[];
  generated_at: string;
  model_reference_optional?: string;
  request_id: string;
  correlation_id: string;
  advisory_only: true;
  canonical_mutation_allowed: false;
  ai_generated: true;
};

export type IntelligenceRecommendation = {
  recommendation_id: string;
  recommendation_type: string;
  institution_id: string;
  subject_type: string;
  subject_id: string;
  recommendation: string;
  reason: string;
  evidence_references: IntelligenceEvidenceReference[];
  canonical_versions: { entity_id: string; version: number }[];
  confidence: IntelligenceConfidence;
  expected_benefit: string;
  possible_downside: string;
  alternatives: string[];
  limitations: string[];
  human_action_required: string;
  status: "active" | "accepted" | "dismissed" | "deferred" | "expired" | "superseded";
  dismissible: true;
  advisory_only: true;
  generated_at: string;
};

export type KnowledgeHealthSnapshot = {
  snapshot_id: string;
  institution_id: string;
  generated_at: string;
  healthy_count: number;
  review_due_count: number;
  weak_evidence_count: number;
  conflicting_count: number;
  stale_translation_count: number;
  overall_band: "healthy" | "watch" | "at_risk";
  advisory_only: true;
};

export type KnowledgeGapCandidate = {
  gap_id: string;
  gap_type: string;
  description: string;
  evidence: string[];
  affected_roles: string[];
  frequency: number;
  impact: "low" | "medium" | "high";
  confidence: IntelligenceConfidence;
  recommended_response: string;
  human_review_required: true;
  advisory_only: true;
};

export type GraphImpactAnalysis = {
  analysis_id: string;
  anchor_entity_id: string;
  anchor_entity_type: string;
  affected_courses: string[];
  affected_assessments: string[];
  affected_certifications: string[];
  affected_translations: string[];
  review_recommendations: string[];
  advisory_only: true;
};

export type RoleReadinessResult = {
  readiness: "ready" | "ready_with_conditions" | "development_needed" | "missing_required" | "human_review_required";
  evidence_summary: string;
  missing_requirements: string[];
  next_actions: string[];
  advisory_only: true;
};

export type TutorIntelligenceResponse = {
  response: string;
  teaching_strategy: string;
  source_references: IntelligenceEvidenceReference[];
  canonical_versions: { entity_id: string; version: number }[];
  confidence: IntelligenceConfidence;
  assumptions: string[];
  limitations: string[];
  practice_option: string | null;
  recommended_next_step: string | null;
  human_support_option: string | null;
  cannot_answer_reason_optional: string | null;
  advisory_only: true;
  canonical_mutation_allowed: false;
};

export type AIIncidentRecord = {
  incident_id: string;
  institution_id: string;
  request_id: string;
  issue_type: string;
  severity: "low" | "medium" | "high" | "critical";
  output_summary: string;
  containment: string;
  review_status: "open" | "under_review" | "resolved";
  recorded_at: string;
};

export type RecommendationFeedbackAction =
  | "helpful"
  | "not_helpful"
  | "incorrect"
  | "missing_context"
  | "already_handled"
  | "accepted"
  | "modified"
  | "dismissed"
  | "needs_human_review";

export const INTELLIGENCE_CONTRACT_VERSION = "11.12-w6.1";

export const AI_PROHIBITED_ACTIONS = [
  "publish_knowledge",
  "approve_artifact",
  "validate_claim",
  "verify_competency",
  "award_certification",
  "revoke_certification",
  "finalize_assessment",
  "override_governance",
  "mutate_canonical_record",
  "infer_trust_score",
  "infer_loyalty_score",
  "infer_psychological_trait",
  "expose_answer_key",
  "expose_protected_assessment",
  "auto_merge_duplicates",
  "auto_approve_relationship",
] as const;
