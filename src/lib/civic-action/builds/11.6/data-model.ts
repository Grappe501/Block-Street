/**
 * CAE-11.6-W1 — Strategic planning canonical data model (OPS-001)
 */
import type { PLANNING_HORIZONS, INSTITUTIONAL_PRIORITIES, DEPENDENCY_TYPES, REVIEW_CYCLES } from "./constitution";

export type PlanningHorizon = (typeof PLANNING_HORIZONS)[number];
export type InstitutionalPriority = (typeof INSTITUTIONAL_PRIORITIES)[number];
export type DependencyType = (typeof DEPENDENCY_TYPES)[number];
export type ReviewCycle = (typeof REVIEW_CYCLES)[number];

export type StrategicStatus = "draft" | "proposed" | "approved" | "active" | "on_hold" | "completed" | "archived";

export interface StrategicEntityBase {
  canonical_id: string;
  public_id: string;
  institution_id: string;
  display_name: string;
  lifecycle_state: StrategicStatus;
  planning_horizon: PlanningHorizon;
  priority: InstitutionalPriority;
  created_by: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface TraceabilityFields {
  vision_id: string | null;
  mission_id: string | null;
  pillar_id: string | null;
  goal_id: string | null;
  objective_id: string | null;
  key_result_id: string | null;
}

export interface PurposeRecord extends StrategicEntityBase {
  object_type: "Purpose";
  title: string;
  statement: string;
  approved_version: number;
  effective_date: string;
  approved_by: string | null;
}

export interface CoreValueRecord extends StrategicEntityBase {
  object_type: "CoreValue";
  title: string;
  description: string;
  behavior_examples: string[];
  sort_order: number;
}

export interface VisionRecord extends StrategicEntityBase {
  object_type: "Vision";
  statement: string;
  effective_date: string;
}

export interface MissionStatementRecord extends StrategicEntityBase {
  object_type: "MissionStatement";
  statement: string;
  institution_scope: string;
  effective_date: string;
}

export interface StrategicPillarRecord extends StrategicEntityBase {
  object_type: "StrategicPillar";
  title: string;
  description: string;
  owner_human_id: string;
}

export interface StrategicGoalRecord extends StrategicEntityBase {
  object_type: "StrategicGoal";
  pillar_id: string;
  title: string;
  description: string;
  start_date: string;
  target_date: string;
  owner_human_id: string;
}

export interface StrategicObjectiveRecord extends StrategicEntityBase {
  object_type: "StrategicObjective";
  goal_id: string;
  title: string;
  description: string;
  measurement_type: string;
  owner_human_id: string;
}

export interface StrategicKeyResultRecord extends StrategicEntityBase {
  object_type: "StrategicKeyResult";
  objective_id: string;
  metric: string;
  baseline: number;
  target: number;
  current_value: number;
  confidence: number;
}

export interface ProgramRecord extends StrategicEntityBase {
  object_type: "Program";
  title: string;
  description: string;
  owning_objective_id: string;
  executive_owner_human_id: string;
  budget_optional: number | null;
  timeline_start: string;
  timeline_end: string;
}

export interface ProjectRecord extends StrategicEntityBase {
  object_type: "Project";
  program_id: string;
  title: string;
  scope: string;
  owner_human_id: string;
  budget_optional: number | null;
  timeline_start: string;
  timeline_end: string;
}

export interface MissionTemplateRecord extends StrategicEntityBase {
  object_type: "MissionTemplate";
  category: string;
  estimated_duration_hours: number;
  required_roles: string[];
  required_competencies: string[];
  checklist_items: string[];
}

export interface AssumptionRecord extends StrategicEntityBase {
  object_type: "Assumption";
  statement: string;
  confidence: number;
  owner_human_id: string;
  last_review_at: string;
  linked_goal_id: string | null;
}

export interface StrategicRiskRecord extends StrategicEntityBase {
  object_type: "StrategicRisk";
  title: string;
  description: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high" | "critical";
  owner_human_id: string;
  mitigation: string;
  linked_goal_id: string | null;
}

export interface SuccessCriteriaRecord extends StrategicEntityBase {
  object_type: "SuccessCriteria";
  goal_id: string;
  criteria: string;
  measurement: string;
  review_frequency: ReviewCycle;
}

export interface StrategicDependencyRecord {
  canonical_id: string;
  from_entity_id: string;
  to_entity_id: string;
  dependency_type: DependencyType;
  institution_id: string;
}

export interface StrategicReviewRecord extends StrategicEntityBase {
  object_type: "StrategicReview";
  review_cycle: ReviewCycle;
  what_changed: string;
  new_risks: string[];
  completed_objectives: string[];
  missed_objectives: string[];
  lessons_learned: string[];
  recommendations: string[];
  completed_at: string;
}

export const STRATEGY_STORE_KEYS = {
  purposes: "strategy_purposes",
  core_values: "strategy_core_values",
  visions: "strategy_visions",
  mission_statements: "strategy_mission_statements",
  pillars: "strategy_pillars",
  goals: "strategy_goals",
  objectives: "strategy_objectives",
  key_results: "strategy_key_results",
  programs: "strategy_programs",
  projects: "strategy_projects",
  mission_templates: "strategy_mission_templates",
  assumptions: "strategy_assumptions",
  risks: "strategy_risks",
  success_criteria: "strategy_success_criteria",
  dependencies: "strategy_dependencies",
  reviews: "strategy_reviews",
} as const;
