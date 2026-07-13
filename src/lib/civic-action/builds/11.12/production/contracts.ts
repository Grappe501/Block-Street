/**
 * CAE-11.12-W8 — Production certification contracts (KNW-PRD-001)
 */
export type ReadinessStatus = "pass" | "attention" | "fail" | "not_applicable";

export type ProductionCertificationLevel =
  | "ready_for_pilot"
  | "ready_for_limited_production"
  | "ready_for_organization"
  | "ready_for_general_availability";

export type CertificationRunStatus =
  | "not_started"
  | "running"
  | "passed"
  | "passed_with_approved_exceptions"
  | "failed"
  | "blocked"
  | "expired"
  | "superseded";

export type LaunchRecommendation =
  | "go_general_availability"
  | "go_limited_production"
  | "go_pilot_only"
  | "conditional_go"
  | "no_go_remediation"
  | "no_go_critical_risk";

export type LaunchDecision = "go" | "no_go" | "conditional_go";

export type ReadinessCheck = {
  check_id: string;
  category: string;
  title: string;
  status: ReadinessStatus;
  detail: string;
  blocking: boolean;
};

export type LaunchControlView = {
  launch_id: string;
  decision: LaunchDecision;
  launch_recommendation: LaunchRecommendation;
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
  sign_off_type: "release" | "pilot" | "limited_production" | "general_availability";
  actor_human_id: string;
  institution_id: string;
  decision: "approved" | "rejected" | "deferred";
  recorded_at: string;
  notes_optional?: string;
};

export type ReleaseIdentity = {
  release_id: string;
  application_version: string;
  git_commit_hash: string;
  branch: string;
  contract_versions: Record<string, string>;
  environment: string;
  deployment_target: string;
  certification_started_at: string;
};

export type CertificationGateResult = {
  gate_id: string;
  domain: string;
  title: string;
  status: ReadinessStatus;
  severity: "critical" | "high" | "medium" | "low";
  blocking: boolean;
  evidence: string[];
  detail: string;
};

export type CertificationRunRecord = {
  certification_run_id: string;
  release_id: string;
  environment: string;
  certification_scope: string;
  started_by_human_id: string;
  started_at: string;
  completed_at_optional: string | null;
  status: CertificationRunStatus;
  gate_results: CertificationGateResult[];
  evidence_bundle_id: string | null;
  launch_recommendation: LaunchRecommendation | null;
  approved_by_human_ids: string[];
};

export type ProductionCertificate = {
  certificate_id: string;
  release_id: string;
  environment: string;
  approved_launch_scope: string;
  certified_scale: string;
  issued_at: string;
  expires_at_or_review_due: string;
  approvers: string[];
  evidence_bundle_id: string;
  rollback_reference: string;
};

export const KNOWLEDGE_PRODUCTION_CONTRACT_VERSION = "11.12-w8.1";
export const BUILD_1112_WAVES = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const;

export const PRODUCTION_INVARIANTS = [
  "CAE-11.12-W8-PROD-001",
  "CAE-11.12-W8-PROD-002",
  "CAE-11.12-W8-PROD-003",
  "CAE-11.12-W8-PROD-004",
  "CAE-11.12-W8-PROD-005",
  "CAE-11.12-W8-PROD-006",
  "CAE-11.12-W8-PROD-007",
  "CAE-11.12-W8-PROD-008",
] as const;
