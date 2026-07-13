/**
 * CAE-11.6-W15 — Certification persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  AuditRecord,
  CertificationRecord,
  ComplianceRecord,
  EvidenceRecord,
  LaunchReadinessRecord,
  OperationalConfidenceRecord,
  ReadinessAssessmentRecord,
  RenewalRecord,
  ValidationRecord,
} from "../data-model";
import { CERTIFICATION_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

function listByInstitution<T extends { institution_id: string }>(key: string, institutionId: string) {
  return readStoreSlice<T>(key).filter((r) => r.institution_id === institutionId);
}

export function listCertifications(institutionId: string) {
  return listByInstitution<CertificationRecord>(CERTIFICATION_STORE_KEYS.certifications, institutionId);
}

export function getCertification(certificationId: string) {
  return readStoreSlice<CertificationRecord>(CERTIFICATION_STORE_KEYS.certifications).find(
    (c) => c.certification_id === certificationId
  ) ?? null;
}

export function saveCertification(record: CertificationRecord) {
  upsertById(CERTIFICATION_STORE_KEYS.certifications, record, "certification_id");
}

export function listEvidence(institutionId: string) {
  return listByInstitution<EvidenceRecord>(CERTIFICATION_STORE_KEYS.evidence, institutionId);
}

export function saveEvidence(record: EvidenceRecord) {
  upsertById(CERTIFICATION_STORE_KEYS.evidence, record, "evidence_id");
}

export function listCompliance(institutionId: string) {
  return listByInstitution<ComplianceRecord>(CERTIFICATION_STORE_KEYS.compliance, institutionId);
}

export function saveCompliance(record: ComplianceRecord) {
  upsertById(CERTIFICATION_STORE_KEYS.compliance, record, "compliance_id");
}

export function listReadinessAssessments(institutionId: string) {
  return listByInstitution<ReadinessAssessmentRecord>(CERTIFICATION_STORE_KEYS.readiness, institutionId);
}

export function saveReadinessAssessment(record: ReadinessAssessmentRecord) {
  upsertById(CERTIFICATION_STORE_KEYS.readiness, record, "assessment_id");
}

export function listValidations(institutionId: string) {
  return listByInstitution<ValidationRecord>(CERTIFICATION_STORE_KEYS.validations, institutionId);
}

export function saveValidation(record: ValidationRecord) {
  upsertById(CERTIFICATION_STORE_KEYS.validations, record, "validation_id");
}

export function listAudits(institutionId: string) {
  return listByInstitution<AuditRecord>(CERTIFICATION_STORE_KEYS.audits, institutionId);
}

export function saveAudit(record: AuditRecord) {
  upsertById(CERTIFICATION_STORE_KEYS.audits, record, "audit_id");
}

export function listLaunchReadiness(institutionId: string) {
  return listByInstitution<LaunchReadinessRecord>(CERTIFICATION_STORE_KEYS.launch, institutionId);
}

export function saveLaunchReadiness(record: LaunchReadinessRecord) {
  upsertById(CERTIFICATION_STORE_KEYS.launch, record, "launch_id");
}

export function listRenewals(institutionId: string) {
  return listByInstitution<RenewalRecord>(CERTIFICATION_STORE_KEYS.renewals, institutionId);
}

export function saveRenewal(record: RenewalRecord) {
  upsertById(CERTIFICATION_STORE_KEYS.renewals, record, "renewal_id");
}

export function getOperationalConfidence(institutionId: string) {
  return listByInstitution<OperationalConfidenceRecord>(CERTIFICATION_STORE_KEYS.confidence, institutionId)[0] ?? null;
}

export function saveOperationalConfidence(record: OperationalConfidenceRecord) {
  upsertById(CERTIFICATION_STORE_KEYS.confidence, record, "confidence_id");
}
