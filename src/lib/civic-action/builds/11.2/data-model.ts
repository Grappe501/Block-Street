/**
 * CAE-11.2-W2 — Canonical Objective Execution Data Model (OBJ-001)
 */
import type { CanonicalInitiativeStatus } from "../11.1/data-model";

export type CanonicalObjectiveStatus =
  | "draft"
  | "proposed"
  | "approved"
  | "ready"
  | "active"
  | "on_track"
  | "needs_attention"
  | "at_risk"
  | "completed"
  | "partially_achieved"
  | "superseded"
  | "archived";

export type CanonicalMissionStatus =
  | "planned"
  | "ready"
  | "active"
  | "paused"
  | "completed"
  | "cancelled"
  | "archived";

export type CanonicalTaskStatus =
  | "draft"
  | "assigned"
  | "active"
  | "blocked"
  | "completed"
  | "cancelled"
  | "archived";

export type ObjectiveType =
  | "strategic"
  | "operational"
  | "community"
  | "legislative"
  | "educational"
  | "campaign"
  | "technology"
  | "financial"
  | "volunteer"
  | "membership"
  | "training"
  | "research"
  | "emergency";

export type OutcomeCategory =
  | "achieved"
  | "exceeded"
  | "partially_achieved"
  | "not_achieved"
  | "cancelled"
  | "replaced"
  | "continuing"
  | "unable_to_measure";

export type ReviewRhythm = "weekly" | "biweekly" | "monthly" | "quarterly" | "custom";

export type EvidenceType =
  | "photo"
  | "video"
  | "survey"
  | "attendance"
  | "document"
  | "email"
  | "financial_record"
  | "gps_checkin"
  | "meeting_minutes"
  | "approval"
  | "observation";

export type ExecutionVisibility =
  | "private"
  | "institution_internal"
  | "initiative_participants"
  | "member_public"
  | "public";

export type GovernanceClassification = 1 | 2 | 3 | 4 | 5;

export interface ExecutionEntityBase {
  canonical_id: string;
  public_id: string;
  display_name: string;
  canonical_slug: string;
  institution_id: string;
  initiative_id: string;
  parent_object_id: string | null;
  parent_object_type: string | null;
  object_type: string;
  visibility: ExecutionVisibility;
  governance_classification: GovernanceClassification;
  executive_owner_human_id: string;
  operational_owner_human_id: string;
  current_responsible_human_id: string | null;
  created_by: string;
  last_modified_by: string;
  created_at: string;
  updated_at: string;
  current_version: number;
  lifecycle_state: string;
  tags: string[];
  human_summary_optional?: string;
  machine_summary_optional?: string;
  embedding_text_optional?: string;
}

export interface ObjectiveRecord extends ExecutionEntityBase {
  object_type: "Objective";
  lifecycle_state: CanonicalObjectiveStatus;
  objective_type: ObjectiveType;
  purpose: string;
  desired_future_state: string;
  current_state: string;
  review_authority_human_id: string;
  target_start: string | null;
  target_finish: string | null;
  review_rhythm: ReviewRhythm;
  priority: number;
  strategic_alignment: string | null;
  success_definition: string;
  measurement_strategy: string;
  evidence_requirements: string;
  parent_initiative_status_at_creation: CanonicalInitiativeStatus | null;
}

export interface KeyResultRecord extends ExecutionEntityBase {
  object_type: "KeyResult";
  objective_id: string;
  description: string;
  baseline: number | null;
  target: number;
  current_value: number | null;
  measurement_unit: string;
  measurement_frequency: string;
  confidence: number;
  evidence_sources: string[];
  completion_criteria: string;
}

export interface WorkstreamRecord extends ExecutionEntityBase {
  object_type: "Workstream";
  objective_id: string;
  purpose: string;
  priority: number;
  capacity_band: string | null;
  review_rhythm: ReviewRhythm;
}

export interface MissionRecord extends ExecutionEntityBase {
  object_type: "Mission";
  lifecycle_state: CanonicalMissionStatus;
  workstream_id: string;
  objective_id: string;
  operational_lead_human_id: string;
  summary: string;
  purpose: string;
  start_date: string | null;
  finish_date: string | null;
  priority: number;
  assigned_team_ids: string[];
}

export interface MilestoneRecord extends ExecutionEntityBase {
  object_type: "Milestone";
  mission_id: string;
  title: string;
  expected_date: string | null;
  completion_date: string | null;
  completion_criteria: string;
  evidence_required: boolean;
}

export interface DeliverableRecord extends ExecutionEntityBase {
  object_type: "Deliverable";
  mission_id: string;
  deliverable_type: string;
  description: string;
  status: string;
  approval_required: boolean;
  approved_by_optional: string | null;
}

export interface TaskRecord extends ExecutionEntityBase {
  object_type: "Task";
  lifecycle_state: CanonicalTaskStatus;
  mission_id: string;
  description: string;
  priority: number;
  estimated_effort_hours: number | null;
  actual_effort_hours: number | null;
  assigned_team_ids: string[];
  completion_timestamp: string | null;
}

export interface EvidenceRecord extends ExecutionEntityBase {
  object_type: "Evidence";
  evidence_type: EvidenceType;
  description: string;
  linked_entity_id: string;
  linked_entity_type: string;
  uri_optional: string | null;
  captured_at: string;
  captured_by: string;
}

export interface OutcomeRecord extends ExecutionEntityBase {
  object_type: "Outcome";
  objective_id: string;
  observed_result: string;
  expected_result: string;
  variance: string;
  confidence: number;
  reviewer_human_id: string;
  review_date: string;
  outcome_category: OutcomeCategory;
}

export interface ReviewRecord extends ExecutionEntityBase {
  object_type: "Review";
  objective_id: string;
  review_type: string;
  scheduled_at: string;
  completed_at: string | null;
  findings: string | null;
  reviewer_human_id: string;
}

export interface LessonLearnedRecord extends ExecutionEntityBase {
  object_type: "LessonLearned";
  objective_id: string;
  observation: string;
  recommendation: string;
  applicability: string;
  confidence: number;
  category: string;
  institution_visibility: ExecutionVisibility;
}

export interface ExecutionDependencyRecord {
  dependency_id: string;
  institution_id: string;
  initiative_id: string;
  source_entity_id: string;
  source_entity_type: string;
  target_entity_id: string;
  target_entity_type: string;
  dependency_type: string;
  created_at: string;
}

export interface ExecutionRiskRecord {
  risk_id: string;
  institution_id: string;
  initiative_id: string;
  linked_entity_id: string;
  linked_entity_type: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  created_at: string;
}

export interface DecisionReferenceRecord {
  decision_id: string;
  institution_id: string;
  initiative_id: string;
  linked_entity_id: string;
  linked_entity_type: string;
  decision_summary: string;
  decided_by: string;
  decided_at: string;
}

export interface ExecutionVersionRecord {
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

export interface ExecutionHistoryEvent {
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

export interface ExecutionRelationshipRecord {
  relationship_id: string;
  institution_id: string;
  source_entity_id: string;
  source_entity_type: string;
  target_entity_id: string;
  target_entity_type: string;
  relationship_type: string;
  created_at: string;
}

export const EXECUTION_STORE_KEYS = {
  objectives: "canonical_objectives",
  key_results: "canonical_key_results",
  workstreams: "canonical_workstreams",
  missions: "canonical_missions",
  milestones: "canonical_milestones",
  deliverables: "canonical_deliverables",
  tasks: "canonical_tasks",
  evidence: "canonical_evidence",
  outcomes: "canonical_outcomes",
  reviews: "canonical_reviews",
  lessons_learned: "canonical_lessons_learned",
  dependencies: "execution_dependencies",
  risks: "execution_risks",
  decisions: "execution_decisions",
  versions: "execution_versions",
  history: "execution_history_events",
  relationships: "execution_relationships",
} as const;
