/**
 * CAE-11.6-W15 — Certification & operational readiness data model
 */
import type {
  AUDIT_TYPES,
  CERTIFICATION_CATEGORIES,
  READINESS_DOMAINS,
  READINESS_LEVELS,
  VALIDATION_METHODS,
} from "./constitution";

export type CertificationCategory = (typeof CERTIFICATION_CATEGORIES)[number];
export type ReadinessLevel = (typeof READINESS_LEVELS)[number];
export type ReadinessDomain = (typeof READINESS_DOMAINS)[number];
export type ValidationMethod = (typeof VALIDATION_METHODS)[number];
export type AuditType = (typeof AUDIT_TYPES)[number];

export interface CertificationRecord {
  certification_id: string;
  institution_id: string;
  certification_type: CertificationCategory;
  subject: string;
  standard: string;
  status: "draft" | "pending" | "issued" | "expired" | "revoked";
  owner: string;
  review_cycle: "monthly" | "quarterly" | "annual";
  evidence: string[];
  expiration_date: string | null;
  renewal_required: boolean;
  version: number;
  issued_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EvidenceRecord {
  evidence_id: string;
  institution_id: string;
  certification_id: string | null;
  evidence_type: "document" | "audit_log" | "training_record" | "mission_history" | "knowledge_article" | "approval" | "system_test" | "report";
  title: string;
  reference: string;
  recorded_by: string;
  recorded_at: string;
}

export interface ComplianceRecord {
  compliance_id: string;
  institution_id: string;
  policy: string;
  standard: string;
  status: "compliant" | "gap" | "violation";
  evidence_refs: string[];
  last_verified_at: string;
}

export interface ReadinessAssessmentRecord {
  assessment_id: string;
  institution_id: string;
  domain_scores: Record<ReadinessDomain, ReadinessLevel>;
  overall_level: ReadinessLevel;
  assessed_by: string;
  assessed_at: string;
}

export interface ValidationRecord {
  validation_id: string;
  institution_id: string;
  certification_id: string;
  method: ValidationMethod;
  requirement: string;
  passed: boolean;
  validated_by: string;
  validated_at: string;
}

export interface AuditRecord {
  audit_id: string;
  institution_id: string;
  audit_type: AuditType;
  subject: string;
  findings: string[];
  status: "in_progress" | "completed";
  conducted_by: string;
  completed_at: string | null;
  created_at: string;
}

export interface LaunchReadinessRecord {
  launch_id: string;
  institution_id: string;
  checklist: { item: string; passed: boolean }[];
  status: "blocked" | "ready" | "approved";
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface RenewalRecord {
  renewal_id: string;
  certification_id: string;
  institution_id: string;
  status: "scheduled" | "in_progress" | "completed";
  reminder_sent: boolean;
  revalidated_at: string | null;
  approved_by: string | null;
}

export interface OperationalConfidenceRecord {
  confidence_id: string;
  institution_id: string;
  index_score: number;
  readiness: number;
  certification: number;
  compliance: number;
  evidence: number;
  training: number;
  governance: number;
  informs_leadership: true;
  computed_at: string;
}

export const CERTIFICATION_STORE_KEYS = {
  certifications: "ops_certification_records",
  evidence: "ops_certification_evidence",
  compliance: "ops_certification_compliance",
  readiness: "ops_certification_readiness",
  validations: "ops_certification_validations",
  audits: "ops_certification_audits",
  launch: "ops_certification_launch",
  renewals: "ops_certification_renewals",
  confidence: "ops_certification_confidence",
} as const;
