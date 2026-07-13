/**
 * CAE-11.6-W11 — Resilience & continuity data model
 */
import type { CRITICAL_FUNCTIONS, INCIDENT_LEVELS, RECOVERY_PHASES, RISK_CLASSIFICATIONS } from "./constitution";

export type CriticalFunction = (typeof CRITICAL_FUNCTIONS)[number];
export type RiskClassification = (typeof RISK_CLASSIFICATIONS)[number];
export type IncidentLevel = (typeof INCIDENT_LEVELS)[number]["level"];
export type RecoveryPhase = (typeof RECOVERY_PHASES)[number];

export interface ContinuityPlanRecord {
  continuity_plan_id: string;
  institution_id: string;
  critical_function: CriticalFunction;
  owner: string;
  risk_level: "low" | "medium" | "high" | "critical";
  activation_threshold: string;
  recovery_objective: string;
  recovery_time_target: string;
  alternate_resources: string[];
  alternate_personnel: string[];
  communications_plan: string;
  dependencies: string[];
  status: "draft" | "active" | "testing" | "archived";
  version: number;
  created_at: string;
  updated_at: string;
}

export interface IncidentRecord {
  incident_id: string;
  institution_id: string;
  title: string;
  description: string;
  incident_level: IncidentLevel;
  risk_classifications: RiskClassification[];
  status: "active" | "stabilized" | "recovering" | "closed";
  incident_commander: string;
  activated_at: string;
  closed_at: string | null;
  affected_functions: CriticalFunction[];
  timeline_entries: string[];
}

export interface EmergencyOperationsCenterRecord {
  eoc_id: string;
  institution_id: string;
  incident_id: string;
  title: string;
  status: "active" | "closed";
  opened_by: string;
  opened_at: string;
  closed_at: string | null;
}

export interface RecoveryRecord {
  recovery_id: string;
  institution_id: string;
  incident_id: string;
  phase: RecoveryPhase;
  status: "in_progress" | "completed";
  started_at: string;
  completed_at: string | null;
  actions_taken: string[];
}

export interface MutualAidRecord {
  aid_id: string;
  institution_id: string;
  incident_id: string;
  aid_type: "personnel" | "resources" | "facilities" | "communications" | "technical" | "knowledge";
  description: string;
  status: "requested" | "fulfilled" | "declined";
  requested_by: string;
  created_at: string;
}

export interface ResilienceExerciseRecord {
  exercise_id: string;
  institution_id: string;
  exercise_type: "tabletop" | "simulation" | "recovery_drill" | "communication_drill" | "leadership" | "technology" | "election" | "mission_continuity";
  title: string;
  findings: string[];
  status: "scheduled" | "completed";
  conducted_at: string;
}

export interface BackupVerificationRecord {
  verification_id: string;
  institution_id: string;
  backup_type: string;
  verified: boolean;
  integrity_ok: boolean;
  verified_at: string;
  verified_by: string;
}

export interface ReadinessIndexRecord {
  readiness_id: string;
  institution_id: string;
  leadership: number;
  technology: number;
  resources: number;
  facilities: number;
  communications: number;
  training: number;
  knowledge: number;
  recovery_plans: number;
  testing: number;
  operational_capacity: number;
  composite_readiness: number;
  planning_only: true;
  computed_at: string;
}

export interface LessonLearnedRecord {
  lesson_id: string;
  institution_id: string;
  incident_id: string | null;
  exercise_id: string | null;
  timeline: string;
  successes: string[];
  failures: string[];
  recommendations: string[];
  policy_updates: string[];
  recorded_at: string;
}

export const RESILIENCE_STORE_KEYS = {
  continuity_plans: "ops_continuity_plans",
  incidents: "ops_incidents",
  eoc: "ops_emergency_operations_centers",
  recovery: "ops_recovery",
  mutual_aid: "ops_mutual_aid",
  exercises: "ops_resilience_exercises",
  backups: "ops_backup_verifications",
  readiness: "ops_readiness_index",
  lessons: "ops_lessons_learned",
} as const;
