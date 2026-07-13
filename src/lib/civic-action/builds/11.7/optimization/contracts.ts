/**
 * CAE-11.7-W7 — Communication Optimization contracts (COM-OPT-001)
 * Advisory only — Humans accept every improvement.
 */

export type OptimizationConfidence = "observed" | "likely" | "strong_pattern" | "institution_standard" | "emerging";

export type OptimizationFeedbackAction =
  | "accepted"
  | "rejected"
  | "modified"
  | "deferred"
  | "already_implemented"
  | "not_applicable";

export type OptimizationCategory =
  | "conversation"
  | "meeting"
  | "decision"
  | "documentation"
  | "knowledge"
  | "template"
  | "playbook"
  | "collaboration"
  | "translation"
  | "health"
  | "lesson"
  | "governance";

export type MaturityLevel = "foundational" | "developing" | "established" | "optimized" | "adaptive";

export type OptimizationEvidence = {
  signal_id: string;
  source: string;
  summary: string;
};

export type CommunicationOptimization = {
  optimization_id: string;
  category: OptimizationCategory;
  title: string;
  title_es: string;
  what_changed: string;
  why: string;
  why_es: string;
  confidence: OptimizationConfidence;
  evidence: OptimizationEvidence[];
  expected_benefit: string;
  potential_risk: string;
  who_should_review: string;
  suggested_action: string;
  action_href_optional?: string;
  conversation_id_optional?: string;
  initiative_id_optional?: string;
  advisory_only: true;
  generated_at: string;
};

export type StructuredLesson = {
  lesson_id: string;
  source_type: "conversation" | "meeting" | "decision";
  source_id: string;
  source_name: string;
  initiative_id: string;
  observation: string;
  root_cause: string;
  recommendation: string;
  evidence: string;
  applicability: string;
  confidence: OptimizationConfidence;
  occurred_at: string;
};

export type TemplateEvolutionRecord = {
  template_id: string;
  template_name: string;
  template_type:
    | "meeting_agenda"
    | "mission_briefing"
    | "executive_brief"
    | "volunteer_welcome"
    | "decision_record"
    | "announcement";
  version: number;
  version_history: { version: number; change_summary: string; updated_at: string }[];
  source_conversation_id: string | null;
  lessons_applied: string[];
  status: "draft" | "validated" | "recommended" | "institution_standard" | "historical" | "retired";
  updated_at: string;
};

export type CommunicationHealthDimension = {
  dimension: string;
  label: string;
  state: "healthy" | "attention" | "critical";
  score_band: number;
  explanation: string;
};

export type CommunicationMaturityView = {
  institution_id: string;
  level: MaturityLevel;
  score: number;
  archived_conversations: number;
  lessons_captured: number;
  templates_evolved: number;
  playbooks_active: number;
  explanation: string;
};

export type KnowledgeEvolutionStage =
  | "captured"
  | "validated"
  | "referenced"
  | "operational_standard"
  | "institutional_standard"
  | "historical_archive";

export type KnowledgeEvolutionEntry = {
  knowledge_id: string;
  display_name: string;
  current_stage: KnowledgeEvolutionStage;
  institution_id: string;
  initiative_id: string;
  transition_notes: string[];
  advisory_only: true;
};

export type PlaybookEvolutionRecord = {
  playbook_id: string;
  playbook_name: string;
  playbook_type: "volunteer_onboarding" | "campaign_launch" | "crisis_response" | "meeting_cadence" | "decision_escalation";
  version: number;
  lessons_applied: string[];
  status: "draft" | "recommended" | "institution_standard" | "historical";
  updated_at: string;
};

export type KnowledgeStewardshipRecommendation = {
  recommendation_id: string;
  type: "outdated" | "duplicate" | "conflicting";
  knowledge_id: string;
  related_id_optional?: string;
  summary: string;
  suggested_action: string;
  human_approval_required: true;
  advisory_only: true;
};

export type SimulationRequest = {
  scenario_type: string;
  parameters: Record<string, unknown>;
  conversation_id_optional?: string;
};

export type SimulationResult = {
  simulation_id: string;
  scenario_type: string;
  outcomes: string[];
  risks: string[];
  confidence: OptimizationConfidence;
  advisory_only: true;
  note: string;
};

export type ExecutiveImprovementBrief = {
  brief_id: string;
  what_we_learned: string[];
  what_improved: string[];
  needs_attention: string[];
  recommended_changes: CommunicationOptimization[];
  training_needed: string[];
  template_updates: string[];
  playbook_updates: string[];
  reading_time_minutes: number;
};

export const OPTIMIZATION_CONTRACT_VERSION = "11.7-w7.1";

export const OPTIMIZATION_PROHIBITED_ACTIONS = [
  "send_message",
  "publish_announcement",
  "approve_decision",
  "archive_conversation",
  "delete_history",
  "modify_governance",
  "auto_implement",
  "auto_approve",
  "override_policy",
  "assign_authority",
  "merge_conversations",
  "retire_knowledge",
] as const;
