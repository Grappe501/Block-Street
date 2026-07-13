/**
 * CAE-11.6-W3 — Workforce canonical data model
 */
import type {
  ASSIGNMENT_STATUSES,
  ASSIGNMENT_TYPES,
  CAPACITY_UNITS,
  WORKFORCE_STATUSES,
  WORKLOAD_LEVELS,
} from "./constitution";

export type WorkforceStatus = (typeof WORKFORCE_STATUSES)[number];
export type WorkloadLevel = (typeof WORKLOAD_LEVELS)[number];
export type AssignmentType = (typeof ASSIGNMENT_TYPES)[number];
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];
export type CapacityUnit = (typeof CAPACITY_UNITS)[number];

export interface HumanWorkProfileRecord {
  human_work_profile_id: string;
  human_id: string;
  institution_id: string;
  primary_role: string;
  secondary_roles: string[];
  department: string;
  team: string;
  employment_type: "staff" | "volunteer" | "contractor" | "board";
  volunteer_type: string | null;
  availability_profile_id: string | null;
  preferred_work_types: string[];
  current_capacity: number;
  maximum_capacity: number;
  capacity_unit: CapacityUnit;
  workload_level: WorkloadLevel;
  workforce_status: WorkforceStatus;
  time_zone: string;
  languages: string[];
  certifications: string[];
  competencies: string[];
  interests: string[];
  growth_goals: string[];
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface VolunteerProfileExtension {
  human_id: string;
  preferred_service_types: string[];
  preferred_schedule: string;
  maximum_hours: number;
  travel_radius_miles: number;
  organization_affiliations: string[];
  community_interests: string[];
  recognition_preferences: string[];
}

export interface AvailabilityProfileRecord {
  availability_profile_id: string;
  human_id: string;
  institution_id: string;
  schedule_type: "daily" | "weekly" | "seasonal" | "special_events" | "recurring" | "emergency";
  weekly_hours_available: number;
  emergency_available: boolean;
  temporary_override_until: string | null;
  calendar_sync_enabled: boolean;
  updated_at: string;
}

export interface CapacitySnapshotRecord {
  capacity_snapshot_id: string;
  human_id: string;
  institution_id: string;
  active_missions: number;
  open_tasks: number;
  scheduled_events: number;
  training_hours: number;
  current_capacity: number;
  maximum_capacity: number;
  workload_level: WorkloadLevel;
  computed_at: string;
}

export interface WorkAssignmentRecord {
  assignment_id: string;
  institution_id: string;
  mission_id: string;
  task_id: string | null;
  human_id: string;
  assigned_role: AssignmentType;
  assigned_by: string;
  assignment_reason: string;
  priority: "critical" | "high" | "medium" | "low";
  estimated_effort: number;
  actual_effort: number;
  required_competencies: string[];
  required_certifications: string[];
  status: AssignmentStatus;
  accepted_at: string | null;
  completed_at: string | null;
  strategic_goal_id: string | null;
  objective_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DelegationRecord {
  delegation_id: string;
  assignment_id: string;
  delegated_by: string;
  delegated_to: string;
  reason: string;
  duration_end: string;
  authority_scope: string;
  approved_by: string | null;
  status: "pending" | "approved" | "active" | "completed" | "revoked";
  created_at: string;
}

export interface RecognitionRecord {
  recognition_id: string;
  institution_id: string;
  human_id: string;
  recognition_type: "mission_completion" | "volunteer_service" | "training" | "mentoring" | "innovation" | "collaboration" | "leadership" | "years_of_service";
  title: string;
  description: string;
  mission_id: string | null;
  awarded_by: string;
  awarded_at: string;
}

export interface GrowthGoalRecord {
  growth_goal_id: string;
  human_id: string;
  institution_id: string;
  goal: string;
  target_competency: string | null;
  status: "active" | "achieved" | "paused";
  updated_at: string;
}

export interface BurnoutIndicatorRecord {
  indicator_id: string;
  human_id: string;
  institution_id: string;
  indicators: string[];
  severity: "watch" | "elevated" | "critical";
  advisory_only: boolean;
  private: boolean;
  computed_at: string;
}

export const WORKFORCE_STORE_KEYS = {
  work_profiles: "ops_work_profiles",
  volunteer_profiles: "ops_volunteer_profiles",
  availability_profiles: "ops_availability_profiles",
  capacity_snapshots: "ops_capacity_snapshots",
  work_assignments: "ops_work_assignments",
  delegations: "ops_work_delegations",
  recognitions: "ops_work_recognitions",
  growth_goals: "ops_growth_goals",
  burnout_indicators: "ops_burnout_indicators",
} as const;
