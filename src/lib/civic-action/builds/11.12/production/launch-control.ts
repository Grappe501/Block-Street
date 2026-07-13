/**
 * CAE-11.12-W8 — Launch control (Go/No-Go, no auto-deploy)
 */
import { caeId, nowIso } from "../../../utils";
import type { LaunchControlView, LaunchDecision, LaunchRecommendation } from "./contracts";
import { validateKnowledgeProductionConfiguration } from "./config-validation";
import { assessKnowledgeMigrationBootstrap } from "./migration-bootstrap";
import { runKnowledgeCertificationSuite } from "./certification-suite";
import { assessKnowledgeOperationalReadiness } from "./operational-readiness";
import { runKnowledgeCertificationGates, criticalGatesPassed } from "./certification-registry";
import { runKnowledgeTraceabilityCertification } from "./traceability-certification";
import { hasKnowledgeApprovedSignOff } from "./sign-off-store";

export function buildKnowledgeDeploymentChecklist() {
  return [
    ...validateKnowledgeProductionConfiguration(),
    ...assessKnowledgeMigrationBootstrap(),
    ...assessKnowledgeOperationalReadiness(),
  ];
}

function deriveLaunchRecommendation(
  decision: LaunchDecision,
  criticalIssues: string[],
  suitePassed: boolean
): LaunchRecommendation {
  if (decision === "no_go") {
    return criticalIssues.some((i) => i.toLowerCase().includes("critical")) ? "no_go_critical_risk" : "no_go_remediation";
  }
  if (decision === "conditional_go") return "conditional_go";
  if (!suitePassed) return "go_pilot_only";
  return "go_limited_production";
}

export function buildKnowledgeLaunchControl(institutionId: string): LaunchControlView {
  const checklist = buildKnowledgeDeploymentChecklist();
  const cert = runKnowledgeCertificationSuite();
  const gates = runKnowledgeCertificationGates();
  const trace = runKnowledgeTraceabilityCertification();
  const critical_issues: string[] = [];

  for (const f of checklist.filter((c) => c.blocking && c.status === "fail")) {
    critical_issues.push(`${f.title}: ${f.detail}`);
  }

  for (const w of cert.waves.filter((w) => !w.all_passed)) {
    critical_issues.push(`Wave ${w.wave} certification incomplete (${w.gate_pass_count}/${w.gate_total} gates)`);
  }

  for (const c of cert.constitutional_checks.filter((c) => c.blocking && c.status === "fail")) {
    critical_issues.push(`Constitutional: ${c.title}`);
  }

  for (const g of gates.filter((g) => g.blocking && g.status === "fail")) {
    critical_issues.push(`Gate ${g.gate_id}: ${g.title}`);
  }

  if (trace.untested_critical > 0) {
    critical_issues.push(`${trace.untested_critical} critical requirements lack executable enforcement`);
  }

  const complete = checklist.filter((c) => c.status === "pass").length;
  const checklist_complete_pct = checklist.length ? Math.round((complete / checklist.length) * 100) : 0;

  let decision: LaunchDecision = "go";
  if (critical_issues.length > 0 || !criticalGatesPassed()) decision = "no_go";
  else if (checklist_complete_pct < 85 || !cert.suite_passed) decision = "conditional_go";

  const launch_recommendation = deriveLaunchRecommendation(decision, critical_issues, cert.suite_passed);
  const executive_sign_off_required =
    decision !== "go" || !hasKnowledgeApprovedSignOff(institutionId, "limited_production");

  return {
    launch_id: caeId("launch"),
    decision,
    launch_recommendation,
    critical_issues,
    checklist_complete_pct,
    deployment_checklist: checklist,
    executive_sign_off_required,
    rollback_available: true,
    generated_at: nowIso(),
  };
}
