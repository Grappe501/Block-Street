export type PilotPhase = "A" | "B" | "C" | "D";
export type PilotStatus =
  | "draft"
  | "planning"
  | "ready"
  | "active"
  | "paused"
  | "blocked"
  | "review"
  | "retest_required"
  | "accepted"
  | "accepted_with_conditions"
  | "extended"
  | "rejected"
  | "closed";

export type PilotRiskLevel = "PL1" | "PL2" | "PL3" | "PL4";
export type SessionStatus = "scheduled" | "in_progress" | "completed" | "abandoned" | "interrupted" | "invalidated" | "needs_retest";
export type HelpSeverity = "H1" | "H2" | "H3" | "H4";
export type IssueSeverity = "P0" | "P1" | "P2" | "P3" | "P4";
export type GateOutcome = "passed" | "passed_with_conditions" | "retest_required" | "pilot_extension_required" | "blocked" | "failed";

export interface PilotProgram {
  id: string;
  institution_id: string;
  name: string;
  description: string;
  phase: PilotPhase;
  scope: string;
  pilot_owner_user_id: string;
  observation_lead_user_id: string;
  status: PilotStatus;
  risk_level: PilotRiskLevel;
  start_at: string | null;
  end_at: string | null;
  success_criteria: string;
  launch_target: string | null;
  created_at: string;
}

export interface PilotWorkflow {
  id: string;
  pilot_program_id: string;
  name: string;
  description: string;
  target_role: string;
  category: string;
  critical: boolean;
  acceptance_threshold_human_help: number;
  acceptance_threshold_success_rate: number;
  version: number;
}

export interface PilotCohort {
  id: string;
  pilot_program_id: string;
  name: string;
  cohort_type: string;
  participant_count: number;
  status: string;
  start_at: string | null;
}

export interface PilotParticipant {
  id: string;
  pilot_cohort_id: string;
  user_id: string;
  role_id: string;
  experience_level: string;
  device_profile: string;
  participant_status: string;
}

export interface PilotSession {
  id: string;
  pilot_program_id: string;
  pilot_workflow_id: string;
  participant_id: string;
  observer_id: string;
  device_type: string;
  environment: string;
  status: SessionStatus;
  outcome: string | null;
  human_help_count: number;
  hesitation_count: number;
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface HumanHelpEvent {
  id: string;
  pilot_session_id: string;
  help_type: string;
  severity: HelpSeverity;
  workflow_step: string;
  question_asked: string;
  help_provided: string;
  preventable: boolean;
  timestamp: string;
}

export interface PilotObservation {
  id: string;
  pilot_session_id: string;
  observation_type: string;
  workflow_step: string;
  participant_statement: string;
  severity: string;
  observer_notes: string;
  timestamp: string;
}

export interface PilotIssue {
  id: string;
  pilot_program_id: string;
  pilot_session_id: string | null;
  workflow_id: string | null;
  issue_domain: string;
  severity: IssueSeverity;
  title: string;
  description: string;
  root_cause: string;
  status: string;
  owner: string;
  created_at: string;
}

export interface PilotCorrectiveAction {
  id: string;
  pilot_issue_id: string;
  action_type: string;
  owner: string;
  status: string;
  verification_method: string;
}

export interface PilotRetest {
  id: string;
  pilot_issue_id: string;
  original_session_id: string;
  new_session_id: string | null;
  result: string;
  human_help_delta: number;
  verified_by: string | null;
  verified_at: string | null;
}

export interface PilotAcceptanceGate {
  id: string;
  pilot_program_id: string;
  gate_type: string;
  phase: PilotPhase;
  criteria: string;
  status: GateOutcome;
  evidence: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  conditions: string | null;
}

export interface LaunchRecommendation {
  id: string;
  pilot_program_id: string;
  institution_id: string;
  readiness_summary: string;
  critical_blockers: string[];
  conditions: string[];
  accepted_risks: string[];
  recommended_launch_scope: string;
  recommended_support_level: string;
  decision: string;
  created_at: string;
}

export interface PilotHealth {
  active_programs: number;
  sessions_today: number;
  workflow_success_rate: number;
  average_human_help: number;
  h4_takeovers: number;
  p0_issues: number;
  p1_issues: number;
  retests_pending: number;
  engineering_interventions: number;
  launch_recommendations_pending: number;
}

export interface PilotAuditEvent {
  id: string;
  pilot_program_id: string;
  institution_id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  previous_state: string;
  new_state: string;
  reason: string | null;
  timestamp: string;
  correlation_id: string;
  result: string;
}
