/**
 * CAE-11.6-W2 — Operational mission execution data model
 */
import type {
  MISSION_DEPENDENCY_TYPES,
  MISSION_HEALTH_STATES,
  MISSION_LIFECYCLE_STATES,
  MISSION_ROLES,
  MISSION_TYPES,
} from "./constitution";

export type MissionLifecycleState = (typeof MISSION_LIFECYCLE_STATES)[number];
export type MissionType = (typeof MISSION_TYPES)[number];
export type MissionHealthState = (typeof MISSION_HEALTH_STATES)[number];
export type MissionRole = (typeof MISSION_ROLES)[number];
export type MissionDependencyType = (typeof MISSION_DEPENDENCY_TYPES)[number];

export interface OperationalMissionTraceability {
  vision_id: string | null;
  mission_statement_id: string | null;
  pillar_id: string | null;
  strategic_goal_id: string | null;
  objective_id: string | null;
  key_result_id: string | null;
  program_id: string | null;
  project_id: string | null;
}

export interface OperationalMissionRecord extends OperationalMissionTraceability {
  mission_id: string;
  institution_id: string;
  title: string;
  description: string;
  purpose: string;
  desired_outcome: string;
  status: MissionLifecycleState;
  priority: "critical" | "high" | "medium" | "low" | "future";
  classification: MissionType;
  visibility: "public" | "internal" | "restricted";
  created_by: string;
  mission_owner: string;
  executive_owner: string;
  start_date: string | null;
  target_completion: string | null;
  actual_completion: string | null;
  estimated_effort_hours: number;
  actual_effort_hours: number;
  confidence: number;
  risk_level: "low" | "medium" | "high" | "critical";
  success_definition: string;
  failure_definition: string;
  budget_reference: string | null;
  calendar_reference: string | null;
  health: MissionHealthState;
  template_id: string | null;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface MissionPhaseRecord {
  phase_id: string;
  mission_id: string;
  title: string;
  sort_order: number;
  status: "pending" | "active" | "completed";
  created_at: string;
}

export interface MissionActivityRecord {
  activity_id: string;
  mission_id: string;
  phase_id: string;
  title: string;
  status: "pending" | "active" | "completed";
  created_at: string;
}

export interface MissionTaskRecord {
  task_id: string;
  mission_id: string;
  activity_id: string | null;
  title: string;
  description: string;
  owner: string;
  status: "pending" | "in_progress" | "completed" | "blocked" | "cancelled";
  estimated_time_minutes: number;
  actual_time_minutes: number;
  priority: "critical" | "high" | "medium" | "low";
  due_date: string | null;
  dependencies: string[];
  completion_rules: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItemRecord {
  item_id: string;
  mission_id: string;
  title: string;
  required: boolean;
  completed: boolean;
  completed_by: string | null;
  completed_at: string | null;
  verification_required: boolean;
}

export interface MissionDependencyRecord {
  dependency_id: string;
  mission_id: string;
  depends_on_mission_id: string;
  dependency_type: MissionDependencyType;
  reason: string;
}

export interface MissionRoleAssignment {
  assignment_id: string;
  mission_id: string;
  human_id: string;
  role: MissionRole;
  assigned_at: string;
}

export interface MissionRiskRecord {
  risk_id: string;
  mission_id: string;
  title: string;
  description: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high" | "critical";
  owner: string;
  mitigation: string;
  status: "open" | "mitigated" | "accepted" | "closed";
}

export interface MissionEvidenceRecord {
  evidence_id: string;
  mission_id: string;
  evidence_type: "photo" | "gps" | "attendance" | "document" | "signature" | "checklist" | "note" | "video" | "ai_summary";
  title: string;
  uri_or_reference: string;
  recorded_by: string;
  recorded_at: string;
}

export interface MissionCommunicationRecord {
  communication_id: string;
  mission_id: string;
  channel: "discussion" | "announcement" | "meeting_notes" | "decision_log" | "question" | "file_share" | "activity_feed";
  subject: string;
  body: string;
  author_id: string;
  created_at: string;
}

export interface MissionDecisionRecord {
  decision_id: string;
  mission_id: string;
  question: string;
  decision: string;
  reason: string;
  evidence: string;
  decided_by: string;
  decided_at: string;
}

export interface MissionLessonRecord {
  lesson_id: string;
  mission_id: string;
  successes: string[];
  failures: string[];
  unexpected_events: string[];
  recommendations: string[];
  future_improvements: string[];
  submitted_by: string;
  submitted_at: string;
  knowledge_synced: boolean;
}

export interface MissionTransitionAudit {
  audit_id: string;
  mission_id: string;
  from_status: MissionLifecycleState;
  to_status: MissionLifecycleState;
  actor_id: string;
  reason: string;
  transitioned_at: string;
}

export interface OperationalMissionTemplateRecord {
  template_id: string;
  institution_id: string;
  category: string;
  title: string;
  estimated_duration_hours: number;
  required_roles: MissionRole[];
  required_competencies: string[];
  checklist_items: string[];
  default_phases: string[];
}

export const EXECUTION_STORE_KEYS = {
  operational_missions: "ops_operational_missions",
  mission_phases: "ops_mission_phases",
  mission_activities: "ops_mission_activities",
  mission_tasks: "ops_mission_tasks",
  checklist_items: "ops_mission_checklist_items",
  mission_dependencies: "ops_mission_dependencies",
  mission_roles: "ops_mission_role_assignments",
  mission_risks: "ops_mission_risks",
  mission_evidence: "ops_mission_evidence",
  mission_communications: "ops_mission_communications",
  mission_decisions: "ops_mission_decisions",
  mission_lessons: "ops_mission_lessons",
  mission_transitions: "ops_mission_transition_audits",
  mission_templates: "ops_mission_templates",
} as const;
