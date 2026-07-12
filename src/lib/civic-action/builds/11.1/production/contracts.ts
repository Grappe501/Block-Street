/**
 * CAE-11.1-W8 — Production readiness contracts (INI-PRD-001)
 */
export type ReadinessStatus = "pass" | "attention" | "fail" | "not_applicable";

export type ProductionCertificationLevel =
  | "ready_for_pilot"
  | "ready_for_organization"
  | "ready_for_multi_organization"
  | "ready_for_statewide_deployment";

export type ReadinessCheck = {
  check_id: string;
  category: string;
  title: string;
  status: ReadinessStatus;
  detail: string;
  blocking: boolean;
};

export type LaunchDecision = "go" | "no_go" | "conditional_go";

export type LaunchControlView = {
  launch_id: string;
  decision: LaunchDecision;
  critical_issues: string[];
  checklist_complete_pct: number;
  deployment_checklist: ReadinessCheck[];
  executive_sign_off_required: boolean;
  rollback_available: true;
  generated_at: string;
};

export type ProductionCertificationView = {
  level: ProductionCertificationLevel;
  label: string;
  achieved: boolean;
  blockers: string[];
  evidence: string[];
};

export type OperatorTrainingModule = {
  module_id: string;
  role: string;
  title: string;
  duration_minutes: number;
  topics: string[];
  certification_required: boolean;
};

export type VerificationSchedule = {
  schedule_id: string;
  cadence: "daily" | "weekly" | "monthly" | "quarterly" | "annual";
  title: string;
  owner_role: string;
  checks: string[];
};

export type ExecutiveSignOffRecord = {
  sign_off_id: string;
  sign_off_type: "release" | "pilot" | "organization" | "statewide";
  actor_human_id: string;
  institution_id: string;
  decision: "approved" | "rejected" | "deferred";
  recorded_at: string;
  notes_optional?: string;
};

export const PRODUCTION_CONTRACT_VERSION = "11.1-w8.1";

export const BUILD_111_WAVES = [
  "W1",
  "W2",
  "W3",
  "W4",
  "W5",
  "W6",
  "W7",
  "W8",
] as const;
