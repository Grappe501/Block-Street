/**
 * CAE-11.7-W4 — Organizer data model
 */
import type { CHECKLIST_TYPES, DEPENDENCY_TYPES, PLAN_TYPES } from "./constitution";

export type PlanType = (typeof PLAN_TYPES)[number];
export type DependencyType = (typeof DEPENDENCY_TYPES)[number];
export type ChecklistType = (typeof CHECKLIST_TYPES)[number];

export const ORGANIZER_STORE_KEYS = {
  dailyPlans: "lix_organizer_daily_plans",
  missionPlans: "lix_organizer_mission_plans",
  tasks: "lix_organizer_tasks",
  dependencies: "lix_organizer_dependencies",
  checklists: "lix_organizer_checklists",
  teamStatus: "lix_organizer_team_status",
  resources: "lix_organizer_resources",
  travel: "lix_organizer_travel",
  communications: "lix_organizer_communications",
  deadlines: "lix_organizer_deadlines",
  reviews: "lix_organizer_reviews",
  recommendations: "lix_organizer_recommendations",
} as const;

export interface PlanSectionRecord {
  section_id: string;
  title: string;
  items: string[];
  editable: true;
}

export interface DailyPlanRecord {
  daily_plan_id: string;
  localbrain_id: string;
  human_id: string;
  institution_id: string;
  plan_type: PlanType;
  title: string;
  sections: PlanSectionRecord[];
  human_editable: true;
  auto_executed: false;
  prepared_at: string;
  status: "draft" | "active" | "completed";
}

export interface MissionPlanRecord {
  mission_plan_id: string;
  mission_id: string;
  human_id: string;
  institution_id: string;
  localbrain_id: string;
  blocked_work: string[];
  missing_approvals: string[];
  resource_shortages: string[];
  deadline_conflicts: string[];
  duplicate_effort: string[];
  idle_work: string[];
  critical_path_changes: string[];
  prepared_at: string;
}

export interface TaskCoordinationRecord {
  task_id: string;
  human_id: string;
  title: string;
  owner_id: string;
  mission_id: string;
  priority: string;
  dependencies: string[];
  resources: string[];
  evidence: string[];
  estimated_effort_hours: number;
  deadline: string | null;
  status: string;
  completion_criteria: string;
  recommended_sequence: number;
}

export interface DependencyRecord {
  dependency_id: string;
  human_id: string;
  institution_id: string;
  dependency_type: DependencyType;
  blocked_item: string;
  blocking_item: string;
  reason: string;
  status: "blocked" | "resolved" | "monitoring";
  explainable: true;
}

export interface ChecklistRecord {
  checklist_id: string;
  human_id: string;
  institution_id: string;
  checklist_type: ChecklistType;
  title: string;
  items: { item_id: string; label: string; completed: boolean }[];
  reusable: boolean;
  mission_id: string | null;
}

export interface TeamMemberStatusRecord {
  human_id: string;
  name: string;
  availability: "available" | "busy" | "overloaded" | "away";
  open_tasks: number;
  waiting_on_count: number;
  skills: string[];
  worth_score: null;
}

export interface TeamStatusRecord {
  team_status_id: string;
  institution_id: string;
  mission_id: string | null;
  members: TeamMemberStatusRecord[];
  operational_readiness_only: true;
  updated_at: string;
}

export interface ResourceStatusRecord {
  resource_status_id: string;
  institution_id: string;
  resource_type: string;
  resource_id: string;
  name: string;
  status: "available" | "reserved" | "shortage" | "unavailable";
  needed_by: string | null;
}

export interface TravelPlanRecord {
  travel_plan_id: string;
  human_id: string;
  institution_id: string;
  destination: string;
  departure_at: string;
  arrival_at: string;
  travel_buffer_minutes: number;
  packing_list: string[];
  venue_info: string;
  parking: string;
  emergency_contacts: string[];
  continuous_location_tracking: false;
  prepared_at: string;
}

export interface CommunicationCoordinationRecord {
  communication_id: string;
  human_id: string;
  institution_id: string;
  pending_replies: string[];
  who_needs_updates: string[];
  draft_reminders: string[];
  send_autonomous: false;
}

export interface DeadlineRecord {
  deadline_id: string;
  human_id: string;
  institution_id: string;
  title: string;
  due_at: string;
  deadline_type: "hard" | "soft";
  dependency_ids: string[];
  suggested_action: "accelerate" | "delegate" | "delay" | "escalate" | null;
  reason: string;
  confidence: number;
}

export interface DailyReviewRecord {
  review_id: string;
  human_id: string;
  institution_id: string;
  localbrain_id: string;
  completed_work: string[];
  incomplete_work: string[];
  commitments: string[];
  lessons_learned: string[];
  mission_health: string;
  tomorrow_preparation: string[];
  knowledge_candidates: string[];
  completed_at: string;
}

export interface OrganizerRecommendationRecord {
  recommendation_id: string;
  human_id: string;
  institution_id: string;
  subject: string;
  recommended_action: string;
  why: string;
  evidence: string[];
  confidence: number;
  dismissible: true;
  editable: true;
  mutates_canonical: false;
  status: "recommended" | "dismissed" | "accepted";
}
