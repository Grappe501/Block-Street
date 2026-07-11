import type { CreateRequestInput, RiskLevel } from "./types";

export function classifyRisk(input: CreateRequestInput): {
  risk_level: RiskLevel;
  risk_factors: string[];
  required_controls: string[];
  required_approvals: string[];
  required_training: string[];
  required_security_review: boolean;
  required_data_review: boolean;
} {
  const factors: string[] = [];
  const controls: string[] = ["least_privilege", "mfa_elevated_roles"];
  const approvals: string[] = ["administrative_owner"];
  const training: string[] = ["platform_member"];
  let level: RiskLevel = "P1";

  const users = input.intended_users ?? 50;
  const regions = input.intended_regions ?? [];
  const dataTypes = input.anticipated_data_types ?? [];
  const integrations = input.requested_integrations ?? [];

  if (users > 500) {
    factors.push("large_user_scale");
    level = "P3";
  } else if (users > 100) {
    factors.push("moderate_user_scale");
    level = level === "P1" ? "P2" : level;
  }

  if (regions.length > 1 || regions.some((r) => r.toLowerCase().includes("statewide"))) {
    factors.push("geographic_scope");
    level = "P3";
  }

  if (dataTypes.some((d) => /student|youth|minor/i.test(d))) {
    factors.push("student_or_youth_data");
    level = "P4";
    controls.push("data_classification_required", "consent_controls");
    approvals.push("security_owner", "data_owner");
    training.push("data_steward");
  }

  if (dataTypes.some((d) => /restricted|financial|political/i.test(d))) {
    factors.push("sensitive_data");
    level = level === "P4" ? "P4" : "P3";
    controls.push("export_dual_control");
    approvals.push("security_owner");
  }

  if (integrations.length > 0) {
    factors.push("external_integrations");
    level = level === "P1" ? "P2" : level;
    controls.push("integration_approval_required");
    approvals.push("security_owner");
  }

  if (input.institution_type === "statewide_coalition" || input.institution_type === "multi_campus_network") {
    factors.push("institutional_complexity");
    if (level === "P1") level = "P2";
    if (input.institution_type === "statewide_coalition") level = "P3";
  }

  if (input.requested_modules?.includes("ai_assistance")) {
    factors.push("ai_capabilities");
    controls.push("ai_draft_only");
    approvals.push("security_owner");
  }

  return {
    risk_level: level,
    risk_factors: factors,
    required_controls: [...new Set(controls)],
    required_approvals: [...new Set(approvals)],
    required_training: [...new Set(training)],
    required_security_review: level === "P3" || level === "P4",
    required_data_review: factors.includes("student_or_youth_data") || factors.includes("sensitive_data"),
  };
}
