/**
 * CAE-11.7-W8 — Launch control center (Go/No-Go, no auto-deploy)
 */
import { caeId, nowIso } from "../../../utils";
import type { LaunchControlView, LaunchDecision, ReadinessCheck } from "./contracts";
import { validateCommunicationProductionConfiguration } from "./config-validation";
import { assessCommunicationMigrationBootstrap } from "./migration-bootstrap";
import { runCommunicationCertificationSuite } from "./certification-suite";
import { assessCommunicationOperationalReadiness } from "./operational-readiness";
import { hasCommunicationApprovedSignOff } from "./sign-off-store";

export function buildCommunicationDeploymentChecklist(): ReadinessCheck[] {
  return [
    ...validateCommunicationProductionConfiguration(),
    ...assessCommunicationMigrationBootstrap(),
    ...assessCommunicationOperationalReadiness(),
  ];
}

export function buildCommunicationLaunchControl(institutionId: string): LaunchControlView {
  const checklist = buildCommunicationDeploymentChecklist();
  const cert = runCommunicationCertificationSuite();
  const critical_issues: string[] = [];

  const failedBlocking = checklist.filter((c) => c.blocking && c.status === "fail");
  for (const f of failedBlocking) critical_issues.push(`${f.title}: ${f.detail}`);

  const failedWaves = cert.waves.filter((w) => !w.all_passed);
  for (const w of failedWaves) {
    critical_issues.push(`Wave ${w.wave} certification incomplete (${w.gate_pass_count}/${w.gate_total} gates)`);
  }

  const failedConstitutional = cert.constitutional_checks.filter((c) => c.blocking && c.status === "fail");
  for (const c of failedConstitutional) critical_issues.push(`Constitutional: ${c.title}`);

  const complete = checklist.filter((c) => c.status === "pass").length;
  const checklist_complete_pct = checklist.length ? Math.round((complete / checklist.length) * 100) : 0;

  let decision: LaunchDecision = "go";
  if (critical_issues.length > 0) decision = "no_go";
  else if (checklist_complete_pct < 85 || !cert.suite_passed) decision = "conditional_go";

  const executive_sign_off_required = decision !== "go" || !hasCommunicationApprovedSignOff(institutionId, "release");

  return {
    launch_id: caeId("launch"),
    decision,
    critical_issues,
    checklist_complete_pct,
    deployment_checklist: checklist,
    executive_sign_off_required,
    rollback_available: true,
    generated_at: nowIso(),
  };
}
