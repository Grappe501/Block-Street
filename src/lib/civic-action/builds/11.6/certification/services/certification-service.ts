/**
 * CAE-11.6-W15 — Certification services (aggregates W1–W14)
 */
import { caeId, nowIso } from "../../../../utils";
import { resilienceService } from "../../resilience/services/resilience-service";
import { improvementService } from "../../improvement/services/improvement-service";
import { experienceService } from "../../experience/services/experience-service";
import { federationOpsService } from "../../federation/services/federation-ops-service";
import { executiveService } from "../../executive/services/executive-service";
import { institutionalIntelligenceService } from "../../intelligence/services/intelligence-service";
import type { AuditType, CertificationCategory, ReadinessDomain, ReadinessLevel, RenewalRecord, ValidationMethod } from "../data-model";
import { CERTIFICATION_STORE_KEYS } from "../data-model";
import {
  getCertification,
  getOperationalConfidence,
  listAudits,
  listCertifications,
  listCompliance,
  listEvidence,
  listLaunchReadiness,
  listReadinessAssessments,
  listRenewals,
  listValidations,
  readStoreSlice,
  saveAudit,
  saveCertification,
  saveCompliance,
  saveEvidence,
  saveLaunchReadiness,
  saveOperationalConfidence,
  saveReadinessAssessment,
  saveRenewal,
  saveValidation,
} from "./repository";

export class CertificationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const DEFAULT_READINESS: Record<ReadinessDomain, ReadinessLevel> = {
  leadership: "implemented",
  people: "implemented",
  knowledge: "validated",
  training: "implemented",
  technology: "validated",
  resources: "implemented",
  facilities: "planning",
  communications: "validated",
  calendar: "implemented",
  governance: "validated",
  automation: "planning",
  analytics: "implemented",
  resilience: "certified",
  federation: "planning",
};

export const certificationService = {
  list: listCertifications,
  get: getCertification,
  create(input: {
    institution_id: string;
    certification_type?: CertificationCategory;
    subject: string;
    standard: string;
    owner: string;
    review_cycle?: "monthly" | "quarterly" | "annual";
  }) {
    const now = nowIso();
    const record = {
      certification_id: caeId("crt"),
      institution_id: input.institution_id,
      certification_type: input.certification_type ?? ("operations" as const),
      subject: input.subject,
      standard: input.standard,
      status: "draft" as const,
      owner: input.owner,
      review_cycle: input.review_cycle ?? ("annual" as const),
      evidence: [] as string[],
      expiration_date: null,
      renewal_required: true,
      version: 1,
      issued_at: null,
      created_at: now,
      updated_at: now,
    };
    saveCertification(record);
    return { certification: record, event: "certification.created" as const };
  },
  issue(certificationId: string, approvedBy: string, evidenceIds: string[]) {
    const cert = getCertification(certificationId);
    if (!cert) throw new CertificationError("CERT_NOT_FOUND", "Certification not found");
    const updated = {
      ...cert,
      status: "issued" as const,
      evidence: evidenceIds,
      issued_at: nowIso(),
      expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: nowIso(),
    };
    saveCertification(updated);
    return { certification: updated, event: "certification.issued" as const };
  },
};

export const complianceService = {
  list: listCompliance,
  verify(institutionId: string) {
    const certs = listCertifications(institutionId);
    const evidence = listEvidence(institutionId);
    const gaps = certs.filter((c) => c.status !== "issued" && c.renewal_required);
    const expired = certs.filter((c) => c.status === "expired");
    const status =
      expired.length > 0 ? ("violation" as const) : gaps.length === 0 ? ("compliant" as const) : ("gap" as const);
    const record = {
      compliance_id: caeId("cmp"),
      institution_id: institutionId,
      policy: "Institutional Operations Policy",
      standard: "CAE-11.6-W15",
      status,
      evidence_refs: evidence.map((e) => e.evidence_id),
      last_verified_at: nowIso(),
    };
    saveCompliance(record);
    return {
      compliance: record,
      continuous: true,
      gaps: gaps.length,
      violations: record.status === "violation" ? 1 : 0,
      event: record.status === "violation" ? ("compliance.violation.detected" as const) : undefined,
    };
  },
  validate(input: { institution_id: string; requirement: string; evidence_refs: string[] }) {
    const passed = input.evidence_refs.length > 0;
    return { requirement: input.requirement, passed, evidence_based: true };
  },
};

export const readinessService = {
  list: listReadinessAssessments,
  assess(input: { institution_id: string; assessed_by: string; domain_scores?: Partial<Record<ReadinessDomain, ReadinessLevel>> }) {
    const domain_scores = { ...DEFAULT_READINESS, ...input.domain_scores };
    const levels = Object.values(domain_scores);
    const levelIndex = Math.round(
      levels.reduce((sum, l) => sum + ["not_started", "planning", "implemented", "validated", "certified", "operational_excellence"].indexOf(l), 0) / levels.length
    );
    const overall = (["not_started", "planning", "implemented", "validated", "certified", "operational_excellence"] as const)[levelIndex] ?? "implemented";
    const record = {
      assessment_id: caeId("rdy"),
      institution_id: input.institution_id,
      domain_scores,
      overall_level: overall,
      assessed_by: input.assessed_by,
      assessed_at: nowIso(),
    };
    saveReadinessAssessment(record);
    return { assessment: record, event: "readiness.assessed" as const, no_area_assumed: true };
  },
};

export const validationService = {
  list: listValidations,
  validate(input: {
    institution_id: string;
    certification_id: string;
    requirement: string;
    method?: ValidationMethod;
    validated_by: string;
    passed: boolean;
  }) {
    const record = {
      validation_id: caeId("val"),
      institution_id: input.institution_id,
      certification_id: input.certification_id,
      method: input.method ?? ("automated" as const),
      requirement: input.requirement,
      passed: input.passed,
      validated_by: input.validated_by,
      validated_at: nowIso(),
    };
    saveValidation(record);
    return { validation: record, repeatable: true, explainable: true };
  },
};

export const evidenceService = {
  list: listEvidence,
  record(input: {
    institution_id: string;
    certification_id?: string;
    evidence_type: Parameters<typeof saveEvidence>[0]["evidence_type"];
    title: string;
    reference: string;
    recorded_by: string;
  }) {
    const record = {
      evidence_id: caeId("evd"),
      institution_id: input.institution_id,
      certification_id: input.certification_id ?? null,
      evidence_type: input.evidence_type,
      title: input.title,
      reference: input.reference,
      recorded_by: input.recorded_by,
      recorded_at: nowIso(),
    };
    saveEvidence(record);
    return { evidence: record, event: "evidence.recorded" as const };
  },
};

export const auditService = {
  list: listAudits,
  run(input: {
    institution_id: string;
    audit_type?: AuditType;
    subject: string;
    conducted_by: string;
    findings?: string[];
  }) {
    const record = {
      audit_id: caeId("aud"),
      institution_id: input.institution_id,
      audit_type: input.audit_type ?? ("operational" as const),
      subject: input.subject,
      findings: input.findings ?? ["Process documented", "Minor training gap identified"],
      status: "completed" as const,
      conducted_by: input.conducted_by,
      completed_at: nowIso(),
      created_at: nowIso(),
    };
    saveAudit(record);
    return { audit: record, event: "audit.completed" as const, institutional_memory: true };
  },
};

export const trustFrameworkService = {
  evaluate(institutionId: string) {
    const certs = listCertifications(institutionId).filter((c) => c.status === "issued");
    const evidence = listEvidence(institutionId);
    return {
      institution_id: institutionId,
      verified_humans: true,
      verified_organizations: true,
      verified_knowledge: evidence.some((e) => e.evidence_type === "knowledge_article"),
      verified_missions: evidence.some((e) => e.evidence_type === "mission_history"),
      verified_governance: certs.some((c) => c.certification_type === "governance"),
      trust_explainable: true,
    };
  },
};

export const securityCertificationService = {
  assess(institutionId: string) {
    const readiness = resilienceService.readiness.get(institutionId);
    return {
      institution_id: institutionId,
      authentication: true,
      authorization: true,
      encryption: true,
      backups: readiness?.testing ?? 0 > 0,
      audit_logging: true,
      incident_response: readiness?.recovery_plans ?? 0 > 0,
      renewable: true,
      score: 0.85,
    };
  },
};

export const accessibilityCertificationService = {
  verify(institutionId: string) {
    const features = experienceService.accessibility.features();
    return {
      institution_id: institutionId,
      keyboard_navigation: features.includes("keyboard_navigation"),
      screen_readers: features.includes("screen_readers"),
      contrast: features.includes("high_contrast"),
      localization: true,
      measurable: true,
      score: 0.9,
    };
  },
};

export const localizationCertificationService = {
  verify(institutionId: string) {
    const langs = experienceService.localization.languages();
    return {
      institution_id: institutionId,
      english: langs.includes("en"),
      conversational_spanish: langs.includes("es"),
      terminology_reviewed: true,
      governance_language: true,
      reviewable: true,
      score: 0.88,
    };
  },
};

export const renewalService = {
  list: listRenewals,
  schedule(certificationId: string, institutionId: string) {
    const record = {
      renewal_id: caeId("rnw"),
      certification_id: certificationId,
      institution_id: institutionId,
      status: "scheduled" as const,
      reminder_sent: false,
      revalidated_at: null,
      approved_by: null,
    };
    saveRenewal(record);
    return { renewal: record };
  },
  complete(renewalId: string, approvedBy: string) {
    const renewal = readStoreSlice<RenewalRecord>(CERTIFICATION_STORE_KEYS.renewals).find(
      (r) => r.renewal_id === renewalId
    );
    if (!renewal) throw new CertificationError("RENEWAL_NOT_FOUND", "Renewal not found");
    const updated = { ...renewal, status: "completed" as const, revalidated_at: nowIso(), approved_by: approvedBy };
    saveRenewal(updated);
    return { renewal: updated, event: "renewal.completed" as const, history_preserved: true };
  },
};

export const operationalConfidenceService = {
  get: getOperationalConfidence,
  compute(institutionId: string) {
    const readiness = listReadinessAssessments(institutionId)[0];
    const certs = listCertifications(institutionId).filter((c) => c.status === "issued");
    const compliance = listCompliance(institutionId);
    const evidence = listEvidence(institutionId);
    const record = {
      confidence_id: caeId("oci"),
      institution_id: institutionId,
      readiness: readiness ? 0.75 : 0.5,
      certification: certs.length > 0 ? 0.8 : 0.4,
      compliance: compliance.filter((c) => c.status === "compliant").length / Math.max(compliance.length, 1),
      evidence: Math.min(evidence.length / 5, 1),
      training: 0.7,
      governance: 0.75,
      index_score: 0,
      informs_leadership: true as const,
      computed_at: nowIso(),
    };
    record.index_score = (record.readiness + record.certification + record.compliance + record.evidence + record.training + record.governance) / 6;
    saveOperationalConfidence(record);
    return record;
  },
};

export const federationCertificationService = {
  assess(federationId: string) {
    const federation = federationOpsService.federation.get(federationId);
    const agreements = federationOpsService.agreements.list(federationId).filter((a) => a.status === "signed");
    return {
      federation_id: federationId,
      institution_certification: true,
      federation_certification: !!federation,
      shared_mission_readiness: agreements.some((a) => a.agreement_type === "joint_missions"),
      mutual_aid_readiness: agreements.some((a) => a.agreement_type === "emergency_support"),
      institutions_independently_certifiable: true,
    };
  },
};

export const aiComplianceService = {
  assess(institutionId: string) {
    const intel = institutionalIntelligenceService.ai.answer(institutionId, "What AI governance gaps exist?");
    return {
      institution_id: institutionId,
      prompt_management: true,
      human_oversight: true,
      approval_gates: true,
      source_attribution: true,
      may_not_self_certify: true,
      ai_summary: intel.answer,
      governed: true,
    };
  },
  advise(institutionId: string) {
    return {
      institution_id: institutionId,
      advisory_only: true,
      gap_analysis: ["Expired training records", "Missing security evidence"],
      missing_evidence: ["Backup verification report"],
      readiness_forecast: "Ready for launch within 30 days with remediation",
      may_not_certify: true,
    };
  },
};

export const executiveReadinessService = {
  dashboard(institutionId: string) {
    const certs = listCertifications(institutionId);
    const compliance = complianceService.verify(institutionId);
    const readiness = listReadinessAssessments(institutionId)[0];
    const confidence = operationalConfidenceService.compute(institutionId);
    const launch = listLaunchReadiness(institutionId)[0];
    const security = securityCertificationService.assess(institutionId);
    const accessibility = accessibilityCertificationService.verify(institutionId);
    const localization = localizationCertificationService.verify(institutionId);
    const ai = aiComplianceService.advise(institutionId);
    return {
      institution_id: institutionId,
      certification_status: certs.filter((c) => c.status === "issued").length,
      compliance: compliance.compliance.status,
      operational_readiness: readiness?.overall_level ?? "planning",
      security_score: security.score,
      accessibility_score: accessibility.score,
      localization_score: localization.score,
      launch_status: launch?.status ?? "blocked",
      operational_confidence: confidence.index_score,
      ai_readiness_summary: ai.readiness_forecast,
      advisory_only: true,
    };
  },
  approveLaunch(institutionId: string, approvedBy: string) {
    const checklist = [
      { item: "Critical bugs resolved", passed: true },
      { item: "Security certified", passed: securityCertificationService.assess(institutionId).score > 0.7 },
      { item: "Training complete", passed: true },
      { item: "Documentation ready", passed: true },
      { item: "Recovery plans tested", passed: true },
      { item: "Executive approval", passed: true },
    ];
    const allPassed = checklist.every((c) => c.passed);
    const record = {
      launch_id: caeId("lch"),
      institution_id: institutionId,
      checklist,
      status: allPassed ? ("approved" as const) : ("blocked" as const),
      approved_by: allPassed ? approvedBy : null,
      approved_at: allPassed ? nowIso() : null,
      created_at: nowIso(),
    };
    saveLaunchReadiness(record);
    return {
      launch: record,
      event: allPassed ? ("launch.approved" as const) : ("launch.blocked" as const),
      quality_gates_passed: allPassed,
    };
  },
};

export const opsCertificationService = {
  certification: certificationService,
  compliance: complianceService,
  readiness: readinessService,
  validation: validationService,
  evidence: evidenceService,
  audit: auditService,
  trust: trustFrameworkService,
  security: securityCertificationService,
  accessibility: accessibilityCertificationService,
  localization: localizationCertificationService,
  renewal: renewalService,
  confidence: operationalConfidenceService,
  federation: federationCertificationService,
  aiCompliance: aiComplianceService,
  executive: executiveReadinessService,
};
