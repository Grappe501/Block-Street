/**
 * CAE-11.6-W15 — Certification tests
 */
import { opsCertificationService } from "./services/certification-service";
import { seedCertificationIfEmpty } from "./services/seed";
import { getCertificationConstitution, OPS_CERTIFICATION_PRINCIPLE, REQUIRED_CERTIFICATION_SERVICES } from "./constitution";
import { checkOpsW15Invariants } from "./invariants";
import { explainCertificationAction } from "./traceability";
import { CERTIFICATION_EVENT_CATALOG } from "./events/catalog";

export type OpsW15TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW15CertificationTests(): OpsW15TestResult[] {
  seedCertificationIfEmpty();
  const results: OpsW15TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getCertificationConstitution();
  results.push({ name: "certification_principle", passed: constitution.governing_principle === OPS_CERTIFICATION_PRINCIPLE });

  results.push({
    name: "required_certification_services",
    passed: REQUIRED_CERTIFICATION_SERVICES.length === 15,
    detail: `${REQUIRED_CERTIFICATION_SERVICES.length} services`,
  });

  results.push({ name: "w15_invariants", passed: checkOpsW15Invariants().every((i) => i.passed) });

  const certs = opsCertificationService.certification.list(institutionId);
  results.push({
    name: "certification_registry",
    passed: certs.length >= 1,
    detail: `${certs.length} certifications`,
  });

  const created = opsCertificationService.certification.create({
    institution_id: institutionId,
    subject: "Security Operations Certification",
    standard: "CAE-11.6 Security Standard v1",
    owner: "usr-001",
    certification_type: "security",
  });
  results.push({
    name: "create_certification",
    passed: created.event === "certification.created",
    detail: created.certification.certification_type,
  });

  const evidence = opsCertificationService.evidence.record({
    institution_id: institutionId,
    certification_id: created.certification.certification_id,
    evidence_type: "system_test",
    title: "Security Penetration Test Report",
    reference: "sec-test-2026-q1",
    recorded_by: "usr-001",
  });
  results.push({
    name: "record_evidence",
    passed: evidence.event === "evidence.recorded",
    detail: evidence.evidence.title,
  });

  const issued = opsCertificationService.certification.issue(
    created.certification.certification_id,
    "usr-001",
    [evidence.evidence.evidence_id]
  );
  results.push({
    name: "issue_certification",
    passed: issued.event === "certification.issued",
    detail: issued.certification.status,
  });

  const validation = opsCertificationService.validation.validate({
    institution_id: institutionId,
    certification_id: created.certification.certification_id,
    requirement: "Security controls implemented",
    validated_by: "usr-001",
    passed: true,
    method: "automated",
  });
  results.push({
    name: "validate_requirement",
    passed: validation.validation.passed && validation.repeatable,
    detail: validation.validation.method,
  });

  const readiness = opsCertificationService.readiness.assess({
    institution_id: institutionId,
    assessed_by: "usr-001",
    domain_scores: { resilience: "certified", technology: "validated" },
  });
  results.push({
    name: "assess_readiness",
    passed: readiness.event === "readiness.assessed" && readiness.no_area_assumed,
    detail: readiness.assessment.overall_level,
  });

  const compliance = opsCertificationService.compliance.verify(institutionId);
  results.push({
    name: "verify_compliance",
    passed: compliance.continuous && compliance.compliance.evidence_refs.length >= 1,
    detail: compliance.compliance.status,
  });

  const audit = opsCertificationService.audit.run({
    institution_id: institutionId,
    subject: "Q1 Operational Audit",
    conducted_by: "usr-001",
    audit_type: "operational",
  });
  results.push({
    name: "run_audit",
    passed: audit.event === "audit.completed",
    detail: audit.audit.audit_type,
  });

  const trust = opsCertificationService.trust.evaluate(institutionId);
  results.push({
    name: "trust_framework",
    passed: trust.trust_explainable && trust.verified_organizations,
    detail: "explainable",
  });

  const security = opsCertificationService.security.assess(institutionId);
  results.push({
    name: "security_certification",
    passed: security.renewable && security.score > 0.7,
    detail: `score ${security.score}`,
  });

  const accessibility = opsCertificationService.accessibility.verify(institutionId);
  results.push({
    name: "accessibility_certification",
    passed: accessibility.measurable && accessibility.keyboard_navigation,
    detail: `score ${accessibility.score}`,
  });

  const localization = opsCertificationService.localization.verify(institutionId);
  results.push({
    name: "localization_certification",
    passed: localization.conversational_spanish && localization.reviewable,
    detail: `score ${localization.score}`,
  });

  const renewal = opsCertificationService.renewal.schedule(created.certification.certification_id, institutionId);
  const renewed = opsCertificationService.renewal.complete(renewal.renewal.renewal_id, "usr-001");
  results.push({
    name: "renew_certification",
    passed: renewed.event === "renewal.completed" && renewed.history_preserved,
    detail: renewed.renewal.status,
  });

  const confidence = opsCertificationService.confidence.compute(institutionId);
  results.push({
    name: "operational_confidence",
    passed: confidence.informs_leadership && confidence.index_score > 0,
    detail: `index ${confidence.index_score.toFixed(2)}`,
  });

  const federation = opsCertificationService.federation.assess("fed-block-street-001");
  results.push({
    name: "federation_certification",
    passed: federation.institutions_independently_certifiable,
    detail: federation.federation_certification ? "certified" : "pending",
  });

  const ai = opsCertificationService.aiCompliance.advise(institutionId);
  results.push({
    name: "ai_compliance_advisor",
    passed: ai.advisory_only && ai.may_not_certify,
    detail: ai.gap_analysis[0],
  });

  const launch = opsCertificationService.executive.approveLaunch(institutionId, "usr-001");
  results.push({
    name: "approve_launch",
    passed: launch.event === "launch.approved" || launch.event === "launch.blocked",
    detail: launch.launch.status,
  });

  const dashboard = opsCertificationService.executive.dashboard(institutionId);
  results.push({
    name: "executive_readiness_dashboard",
    passed: dashboard.advisory_only && !!dashboard.operational_readiness,
    detail: dashboard.launch_status,
  });

  const trace = explainCertificationAction({
    institution_id: institutionId,
    action_type: "issue_certification",
    certification_id: issued.certification.certification_id,
    evidence_refs: [evidence.evidence.evidence_id],
  });
  results.push({
    name: "certification_traceability",
    passed: trace.includes(institutionId) && trace.includes("Certification"),
  });

  results.push({
    name: "certification_event_catalog",
    passed: CERTIFICATION_EVENT_CATALOG.length === 10,
    detail: `${CERTIFICATION_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW15TestsPassed(): boolean {
  return runOpsW15CertificationTests().every((t) => t.passed);
}
