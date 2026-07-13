/**
 * CAE-11.12-W8 — Go/No-Go dashboard aggregation
 */
import { nowIso } from "../../../utils";
import { buildKnowledgeLaunchControl } from "./launch-control";
import { runKnowledgeCertificationGates } from "./certification-registry";
import { runKnowledgeTraceabilityCertification } from "./traceability-certification";
import { runKnowledgeCertificationSuite } from "./certification-suite";
import { evaluateKnowledgeProductionCertifications } from "./production-certification";
import { buildKnowledgeReleaseIdentity } from "./release-identity";
import { getCertificationStatus, listCertificationRuns } from "./certification-run";
import { listKnowledgeExecutiveSignOffs } from "./sign-off-store";
import type { ProductionCertificate } from "./contracts";
import { caeId } from "../../../utils";

export function buildGoNoGoDashboard(institutionId: string) {
  const launch = buildKnowledgeLaunchControl(institutionId);
  const gates = runKnowledgeCertificationGates();
  const trace = runKnowledgeTraceabilityCertification();
  const suite = runKnowledgeCertificationSuite();
  const levels = evaluateKnowledgeProductionCertifications(institutionId);
  const release = buildKnowledgeReleaseIdentity();
  const status = getCertificationStatus();

  return {
    overall_certification_status: launch.decision,
    launch_recommendation: launch.launch_recommendation,
    critical_gates: gates.filter((g) => g.severity === "critical"),
    failed_gates: gates.filter((g) => g.status === "fail"),
    warnings: gates.filter((g) => g.status === "attention"),
    traceability: {
      coverage_pct: trace.coverage_pct,
      deferred: trace.deferred_count,
      failed: trace.failed_requirements,
    },
    waves_summary: suite.waves,
    production_levels: levels,
    release_identity: release,
    latest_certification_run: status.latest_run,
    sign_offs: listKnowledgeExecutiveSignOffs(institutionId),
    residual_risks: buildResidualRisks(launch, gates),
    required_approvers: ["executive", "knowledge_steward", "platform_administrator"],
    generated_at: nowIso(),
  };
}

function buildResidualRisks(
  launch: ReturnType<typeof buildKnowledgeLaunchControl>,
  gates: ReturnType<typeof runKnowledgeCertificationGates>
) {
  const risks: { risk_id: string; description: string; severity: string; launch_scope: string }[] = [];

  for (const g of gates.filter((g) => g.status === "attention")) {
    risks.push({
      risk_id: g.gate_id,
      description: g.detail,
      severity: g.severity,
      launch_scope: "pilot",
    });
  }

  if (launch.checklist_complete_pct < 100) {
    risks.push({
      risk_id: "checklist-incomplete",
      description: `Deployment checklist ${launch.checklist_complete_pct}% complete`,
      severity: "medium",
      launch_scope: "limited_production",
    });
  }

  return risks;
}

export function issueProductionCertificate(input: {
  institution_id: string;
  approvers: string[];
  approved_launch_scope: string;
  certified_scale: string;
}): ProductionCertificate {
  const release = buildKnowledgeReleaseIdentity();
  const runs = listCertificationRuns(1);
  const latest = runs[runs.length - 1];

  return {
    certificate_id: caeId("pcert"),
    release_id: release.release_id,
    environment: release.environment,
    approved_launch_scope: input.approved_launch_scope,
    certified_scale: input.certified_scale,
    issued_at: nowIso(),
    expires_at_or_review_due: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    approvers: input.approvers,
    evidence_bundle_id: latest?.evidence_bundle_id ?? "pending",
    rollback_reference: "docs/phase-11/11.12-adaptive-learning/08_PRODUCTION_READINESS_CERTIFICATION.md#rollback",
  };
}
