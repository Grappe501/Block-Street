export type CertificationStatus =
  | "not_assessed"
  | "assessment_in_progress"
  | "failed"
  | "blocked"
  | "conditionally_certified"
  | "certified_for_pilot"
  | "certified_for_limited_production"
  | "fully_certified"
  | "certification_suspended"
  | "certification_revoked"
  | "recertification_required";

export type RequirementStatus = "implemented" | "tested" | "evidence_complete" | "failed" | "blocked" | "uncovered";

export interface IdentityTrustRequirement {
  id: string;
  requirement_code: string;
  wave: string;
  domain: string;
  title: string;
  requirement_text: string;
  constitutional: boolean;
  risk_level: "low" | "medium" | "high" | "critical";
  verification_method: string;
  status: RequirementStatus;
}

export interface IdentityRequirementTrace {
  id: string;
  requirement_id: string;
  policy_reference: string | null;
  service_reference: string | null;
  api_reference: string | null;
  test_reference: string | null;
  audit_event_reference: string | null;
  certification_result: "passed" | "failed" | "pending";
}

export interface IdentityTrustCertification {
  id: string;
  certification_version: string;
  platform_release: string;
  environment: string;
  scope: string;
  constitution_version: string;
  started_at: string;
  completed_at: string | null;
  status: CertificationStatus;
  certification_authority: string;
  conditions: string[];
  known_limitations: string[];
  expires_at: string | null;
  gate_results: IdentityCertificationGateResult[];
  requirement_summary: {
    total: number;
    passed: number;
    failed: number;
    uncovered: number;
  };
}

export interface IdentityCertificationGateResult {
  id: string;
  gate_code: string;
  name: string;
  domain: string;
  passed: boolean;
  detail: string;
  evidence_ids: string[];
}

export interface IdentityCertificationEvidence {
  id: string;
  certification_id: string;
  requirement_id: string | null;
  evidence_type: string;
  title: string;
  description: string;
  artifact_reference: string;
  created_by: string;
  created_at: string;
  environment: string;
  integrity_digest: string;
  review_status: "pending" | "accepted" | "rejected";
}

export interface IdentityRedTeamFinding {
  id: string;
  certification_id: string;
  threat_code: string;
  scenario: string;
  severity: "RT-0" | "RT-1" | "RT-2" | "RT-3" | "RT-4";
  attack_steps: string;
  expected_result: string;
  actual_result: string;
  status: "open" | "mitigated" | "accepted_risk" | "retest_passed";
  owner: string | null;
}

export interface IdentityMigrationCertification {
  id: string;
  certification_id: string;
  total_accounts: number;
  confirmed_humans: number;
  duplicate_accounts: number;
  service_identities: number;
  shared_accounts: number;
  test_accounts: number;
  unknown_accounts: number;
  active_orphan_accounts: number;
  passed: boolean;
  certified_at: string | null;
}

export interface IdentityLedgerReconstructionRun {
  id: string;
  certification_id: string;
  sample_size: number;
  differences_found: number;
  unexplained_differences: number;
  passed: boolean;
  run_at: string;
}

export interface IdentityContinuityDrill {
  id: string;
  scenario: string;
  environment: string;
  started_at: string;
  completed_at: string | null;
  expected_controls: string[];
  observed_result: string;
  recovery_time_ms: number | null;
  status: "scheduled" | "in_progress" | "passed" | "failed";
}

export interface IdentityLaunchStage {
  id: string;
  stage_number: number;
  name: string;
  scope: string;
  status: "pending" | "active" | "paused" | "completed" | "rolled_back";
  started_at: string | null;
  completed_at: string | null;
}

export interface IdentityLaunchPlan {
  id: string;
  name: string;
  current_stage: number;
  stages: IdentityLaunchStage[];
  status: "draft" | "approved" | "in_progress" | "completed";
  approved_by: string | null;
}

export interface IdentityConstitutionalDriftFinding {
  id: string;
  drift_type: string;
  description: string;
  severity: string;
  detected_at: string;
  status: "open" | "resolved" | "accepted";
}

export interface IdentityConstitutionalAcceptance {
  id: string;
  certification_id: string;
  decision: string;
  scope: string;
  conditions: string[];
  constitutional_exceptions: string[];
  board_members: string[];
  signed_at: string | null;
}

export interface Wave7Certification {
  wave_id: string;
  certified_at: string | null;
  all_passed: boolean;
  production_certified: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}
