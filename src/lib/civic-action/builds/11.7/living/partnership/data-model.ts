/**
 * CAE-11.7-W10 — Partnership data model
 */
import type { COLLABORATION_PATTERNS } from "./constitution";

export type CollaborationPattern = (typeof COLLABORATION_PATTERNS)[number];

export const PARTNERSHIP_STORE_KEYS = {
  recommendations: "lix_partnership_recommendations",
  trust: "lix_partnership_trust",
  wisdom: "lix_partnership_wisdom",
  selfEvaluations: "lix_partnership_self_evaluations",
  feedback: "lix_partnership_feedback",
  quality: "lix_partnership_quality",
  learning: "lix_partnership_learning",
  health: "lix_partnership_health",
  outcomes: "lix_partnership_outcomes",
  memoryEvolution: "lix_partnership_memory_evolution",
  collaboration: "lix_partnership_collaboration",
  governance: "lix_partnership_governance",
  transparency: "lix_partnership_transparency",
} as const;

export interface RecommendationRecord {
  recommendation_id: string;
  human_id: string;
  institution_id: string;
  subject: string;
  recommendation: string;
  evidence: string[];
  assumptions: string[];
  confidence: number;
  alternatives: string[];
  unknowns: string[];
  human_responsibilities: string[];
  ai_limitations: string[];
  required_approvals: string[];
  invitation_not_instruction: true;
  hidden: false;
  created_at: string;
}

export interface TrustCalibrationRecord {
  trust_id: string;
  recommendation_id: string;
  institution_id: string;
  trust_score: number;
  evidence_quality: number;
  historical_accuracy: number;
  source_diversity: number;
  freshness: number;
  human_corrections: number;
  institutional_validation: number;
  per_recommendation: true;
  secret_human_score: false;
  calculated_at: string;
}

export interface WisdomRecord {
  wisdom_id: string;
  institution_id: string;
  title: string;
  lesson: string;
  sources: string[];
  experience_count: number;
  version: number;
  best_practice: boolean;
  repeated_mistake: boolean;
  updated_at: string;
}

export interface SelfEvaluationRecord {
  evaluation_id: string;
  recommendation_id: string;
  institution_id: string;
  was_correct: boolean | null;
  was_helpful: boolean | null;
  was_understandable: boolean;
  evidence_sufficient: boolean;
  confidence_appropriate: boolean;
  should_have_escalated: boolean;
  should_have_deferred: boolean;
  transparent: true;
  evaluated_at: string;
}

export interface HumanFeedbackRecord {
  feedback_id: string;
  human_id: string;
  institution_id: string;
  recommendation_id: string;
  accuracy: number;
  helpfulness: number;
  completeness: number;
  clarity: number;
  bias_concerns: string | null;
  missing_evidence: string | null;
  incorrect_assumptions: string | null;
  suggested_improvements: string | null;
  hidden_reinforcement: false;
  submitted_at: string;
}

export interface RecommendationQualityRecord {
  quality_id: string;
  institution_id: string;
  recommendation_id: string;
  acceptance_rate: number;
  modification_rate: number;
  rejection_rate: number;
  correction_frequency: number;
  evidence_completeness: number;
  hallucination_rate: number;
  escalation_accuracy: number;
  confidence_calibration: number;
  measured_at: string;
}

export interface InstitutionalLearningRecord {
  learning_id: string;
  institution_id: string;
  decision_id: string;
  outcome_summary: string;
  reflection: string;
  lessons: string[];
  best_practices_updated: string[];
  training_improvements: string[];
  future_recommendations: string[];
  recorded_at: string;
}

export interface OrganizationalHealthRecord {
  health_id: string;
  institution_id: string;
  mission_completion: number;
  knowledge_growth: number;
  training_effectiveness: number;
  volunteer_retention: number;
  operational_resilience: number;
  decision_quality: number;
  research_maturity: number;
  documentation_quality: number;
  governance_maturity: number;
  employee_score: false;
  measured_at: string;
}

export interface DecisionOutcomeRecord {
  outcome_id: string;
  institution_id: string;
  human_id: string;
  decision_id: string;
  decision_subject: string;
  expected_outcome: string;
  actual_outcome: string;
  variance: string;
  lessons_learned: string[];
  unexpected_consequences: string[];
  evidence_quality: number;
  recommendation_improvements: string[];
  recorded_at: string;
}

export interface MemoryEvolutionRecord {
  evolution_id: string;
  institution_id: string;
  memory_key: string;
  previous_version: number;
  new_version: number;
  change_type: "correction" | "new_evidence" | "historical_revision" | "retired_policy" | "archived";
  change_summary: string;
  silent_deletion: false;
  changed_by: string;
  changed_at: string;
}

export interface CollaborationRecord {
  collaboration_id: string;
  institution_id: string;
  human_id: string;
  pattern: CollaborationPattern;
  context: string;
  ai_adapts: true;
  replaces_leadership: false;
  active_at: string;
}

export interface GovernanceEvolutionRecord {
  governance_id: string;
  institution_id: string;
  change_type: "policy" | "constitution" | "procedure" | "delegation" | "approval_workflow";
  title: string;
  summary: string;
  version: number;
  approved_by: string;
  historically_traceable: true;
  changed_at: string;
}

export interface TransparencyAuditRecord {
  audit_id: string;
  institution_id: string;
  subject_type: "recommendation" | "decision" | "correction" | "approval" | "governance";
  subject_id: string;
  why_recommendation: string;
  why_confidence: string;
  why_sources: string;
  who_approved: string | null;
  who_changed: string | null;
  when_changed: string;
  why_changed: string;
  explainable: true;
  recorded_at: string;
}
