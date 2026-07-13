/**
 * CAE-11.6-W13 — Institutional measurement & improvement data model
 */
import type {
  IMPROVEMENT_CYCLE,
  MATURITY_DOMAINS,
  MEASUREMENT_CATEGORIES,
  OUTCOME_TYPES,
  ROOT_CAUSE_METHODS,
} from "./constitution";

export type MeasurementCategory = (typeof MEASUREMENT_CATEGORIES)[number];
export type OutcomeType = (typeof OUTCOME_TYPES)[number];
export type ImprovementCyclePhase = (typeof IMPROVEMENT_CYCLE)[number];
export type RootCauseMethod = (typeof ROOT_CAUSE_METHODS)[number];
export type MaturityDomain = (typeof MATURITY_DOMAINS)[number];

export interface MeasurementRecord {
  measurement_id: string;
  institution_id: string;
  measurement_type: MeasurementCategory;
  subject: string;
  objective: string;
  metric: string;
  baseline: number;
  target: number;
  current_value: number;
  confidence: number;
  review_cycle: "weekly" | "monthly" | "quarterly" | "annual";
  owner: string;
  status: "active" | "paused" | "archived";
  version: number;
  created_at: string;
  updated_at: string;
}

export interface KPIRecord {
  kpi_id: string;
  institution_id: string;
  definition: string;
  purpose: string;
  formula: string;
  owner: string;
  review_frequency: string;
  target: number;
  baseline: number;
  evidence_sources: string[];
  historical_trend: { period: string; value: number }[];
  version: number;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
}

export interface OutcomeRecord {
  outcome_id: string;
  institution_id: string;
  outcome_type: OutcomeType;
  subject: string;
  description: string;
  measured_value: number;
  evidence_refs: string[];
  impact_score: number;
  recorded_at: string;
}

export interface BenchmarkRecord {
  benchmark_id: string;
  institution_id: string;
  comparison_type: "historical" | "target" | "peer" | "department" | "region" | "federation" | "campaign" | "election";
  subject: string;
  baseline_value: number;
  comparison_value: number;
  context: string;
  completed_at: string;
}

export interface ImprovementCycleRecord {
  cycle_id: string;
  institution_id: string;
  phase: ImprovementCyclePhase;
  observation: string;
  recommendation: string;
  status: "active" | "approved" | "implemented" | "evaluated";
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface RootCauseRecord {
  analysis_id: string;
  institution_id: string;
  method: RootCauseMethod;
  issue: string;
  root_causes: string[];
  symptoms: string[];
  recommendations: string[];
  conducted_by: string;
  conducted_at: string;
}

export interface BestPracticeRecord {
  practice_id: string;
  institution_id: string;
  category: "mission" | "workflow" | "training" | "leadership" | "communication" | "volunteer" | "technology";
  title: string;
  description: string;
  evidence_refs: string[];
  registered_by: string;
  registered_at: string;
}

export interface ExperimentRecord {
  experiment_id: string;
  institution_id: string;
  title: string;
  hypothesis: string;
  method: string;
  status: "planned" | "active" | "completed" | "cancelled";
  results: string | null;
  lessons: string | null;
  decision: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface InnovationRecord {
  innovation_id: string;
  institution_id: string;
  title: string;
  idea: string;
  status: "idea" | "pilot" | "implemented" | "adopted";
  results: string | null;
  lessons: string | null;
  adoption_level: number;
  recorded_at: string;
}

export interface MaturityAssessmentRecord {
  assessment_id: string;
  institution_id: string;
  domain_scores: Record<MaturityDomain, number>;
  overall_maturity: number;
  assessed_by: string;
  assessed_at: string;
}

export interface CommunityImpactRecord {
  impact_id: string;
  institution_id: string;
  citizens_served: number;
  communities_reached: number;
  volunteer_hours: number;
  training_delivered: number;
  policies_improved: number;
  mission_outcomes: number;
  program_participation: number;
  period: string;
  recorded_at: string;
}

export interface QualityReviewRecord {
  review_id: string;
  institution_id: string;
  review_type: "mission" | "workflow" | "knowledge" | "training" | "technology" | "communication" | "governance";
  subject: string;
  findings: string[];
  evidence_refs: string[];
  reviewed_by: string;
  reviewed_at: string;
}

export interface ImprovementBacklogRecord {
  backlog_id: string;
  institution_id: string;
  title: string;
  category: "strategic" | "program" | "project" | "mission" | "workflow" | "knowledge" | "technology";
  priority: "low" | "medium" | "high" | "critical";
  source: string;
  status: "proposed" | "approved" | "in_progress" | "completed";
  approved_by: string | null;
  created_at: string;
}

export interface ImprovementBriefingRecord {
  briefing_id: string;
  institution_id: string;
  title: string;
  institution_health: string;
  improvement_opportunities: string[];
  long_term_trends: string[];
  ai_summary: string;
  advisory_only: true;
  generated_at: string;
}

export const IMPROVEMENT_STORE_KEYS = {
  measurements: "ops_improvement_measurements",
  kpis: "ops_improvement_kpis",
  outcomes: "ops_improvement_outcomes",
  benchmarks: "ops_improvement_benchmarks",
  cycles: "ops_improvement_cycles",
  root_cause: "ops_improvement_root_cause",
  best_practices: "ops_improvement_best_practices",
  experiments: "ops_improvement_experiments",
  innovations: "ops_improvement_innovations",
  maturity: "ops_improvement_maturity",
  community_impact: "ops_improvement_community_impact",
  quality: "ops_improvement_quality",
  backlog: "ops_improvement_backlog",
  briefings: "ops_improvement_briefings",
} as const;
