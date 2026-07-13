/**
 * CAE-11.12-W2 — Canonical model validation (no business logic)
 */
import type {
  CertificationAwardRecord,
  CitationRecord,
  KnowledgeArtifactRecord,
  KnowledgeClaimRecord,
  LearningCompletionRecord,
} from "./data-model";
import {
  childExceedsParent,
  isArtifactTransitionAllowed,
  isClaimTransitionAllowed,
  isCourseTransitionAllowed,
} from "./state-machines";
import type { CanonicalArtifactStatus, CanonicalClaimStatus, CanonicalCourseStatus } from "./data-model";

export interface ValidationIssue {
  code: string;
  field?: string;
  message: string;
}

export function validateKnowledgeArtifact(record: KnowledgeArtifactRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!record.canonical_id) issues.push({ code: "KNW-V-001", field: "canonical_id", message: "Permanent canonical ID required" });
  if (!record.institution_id) issues.push({ code: "KNW-V-002", field: "institution_id", message: "Institution ID required" });
  if (!record.collection_id) issues.push({ code: "KNW-V-003", field: "collection_id", message: "Orphan artifact prohibited — collection required" });
  if (!record.domain_id) issues.push({ code: "KNW-V-004", field: "domain_id", message: "Knowledge domain required" });
  if (!record.body?.trim()) issues.push({ code: "KNW-V-005", field: "body", message: "Artifact body required" });
  if (record.is_ai_generated && record.content_origin === "human") {
    issues.push({ code: "KNW-V-006", message: "AI-generated content must be labeled with content_origin" });
  }
  return issues;
}

export function validateClaim(claim: KnowledgeClaimRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!claim.canonical_id) issues.push({ code: "KNW-V-010", message: "Claim canonical ID required" });
  if (!claim.artifact_id) issues.push({ code: "KNW-V-011", field: "artifact_id", message: "Orphan claim prohibited — artifact required" });
  if (!claim.claim_text?.trim()) issues.push({ code: "KNW-V-012", field: "claim_text", message: "Claim text required" });
  if (claim.lifecycle_state === "validated" && claim.evidence_status !== "verified" && claim.evidence_status !== "attached") {
    issues.push({ code: "KNW-V-013", message: "Validated claim requires evidence_status attached or verified" });
  }
  if (claim.lifecycle_state === "validated" && claim.requires_evidence && claim.evidence_status === "none") {
    issues.push({ code: "KNW-V-014", message: "Claim marked requires_evidence cannot be validated without evidence" });
  }
  return issues;
}

export function validateCitation(citation: CitationRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!citation.canonical_id) issues.push({ code: "KNW-V-020", message: "Citation canonical ID required" });
  if (!citation.claim_id) issues.push({ code: "KNW-V-021", field: "claim_id", message: "Orphan citation prohibited — claim required" });
  if (!citation.source_id) issues.push({ code: "KNW-V-022", field: "source_id", message: "Orphan citation prohibited — source required" });
  if (!citation.artifact_id) issues.push({ code: "KNW-V-023", field: "artifact_id", message: "Citation must trace to artifact" });
  return issues;
}

export function validateCourseCompletion(
  completion: LearningCompletionRecord,
  courseVersion?: number | null
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!completion.canonical_id) issues.push({ code: "KNW-V-030", message: "Completion canonical ID required" });
  if (!completion.course_id) issues.push({ code: "KNW-V-031", field: "course_id", message: "Course ID required for completion" });
  if (!completion.bound_course_version || completion.bound_course_version < 1) {
    issues.push({ code: "KNW-V-032", field: "bound_course_version", message: "Completion must bind to course version" });
  }
  if (!completion.bound_artifact_version || completion.bound_artifact_version < 1) {
    issues.push({ code: "KNW-V-033", field: "bound_artifact_version", message: "Completion must bind to artifact version" });
  }
  if (courseVersion != null && completion.bound_course_version !== courseVersion) {
    issues.push({ code: "KNW-V-034", message: "Completion version mismatch with current course version" });
  }
  return issues;
}

export function validateCertificationAward(
  award: CertificationAwardRecord,
  requirementsMet?: boolean
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!award.canonical_id) issues.push({ code: "KNW-V-040", message: "Award canonical ID required" });
  if (!award.certification_id) issues.push({ code: "KNW-V-041", field: "certification_id", message: "Certification ID required" });
  if (!award.human_id) issues.push({ code: "KNW-V-042", field: "human_id", message: "Human recipient required" });
  if (award.lifecycle_state === "awarded" && !award.requirements_met) {
    issues.push({ code: "KNW-V-043", message: "Certification award requires requirements_met" });
  }
  if (award.lifecycle_state === "awarded" && requirementsMet === false) {
    issues.push({ code: "KNW-V-044", message: "Cannot award certification when requirements are unmet" });
  }
  if (award.lifecycle_state === "awarded" && !award.awarded_by_human_id) {
    issues.push({ code: "KNW-V-045", message: "Human authority required for certification award" });
  }
  return issues;
}

export function validateArtifactTransition(from: CanonicalArtifactStatus, to: CanonicalArtifactStatus): ValidationIssue[] {
  if (!isArtifactTransitionAllowed(from, to)) {
    return [{ code: "KNW-V-050", message: `Illegal Artifact transition ${from} → ${to}` }];
  }
  return [];
}

export function validateClaimTransition(from: CanonicalClaimStatus, to: CanonicalClaimStatus): ValidationIssue[] {
  if (!isClaimTransitionAllowed(from, to)) {
    return [{ code: "KNW-V-051", message: `Illegal Claim transition ${from} → ${to}` }];
  }
  if (to === "validated" && from !== "evidence_attached") {
    return [{ code: "KNW-V-052", message: "Claim must have evidence_attached before validated" }];
  }
  return [];
}

export function validateCourseTransition(from: CanonicalCourseStatus, to: CanonicalCourseStatus): ValidationIssue[] {
  if (!isCourseTransitionAllowed(from, to)) {
    return [{ code: "KNW-V-053", message: `Illegal Course transition ${from} → ${to}` }];
  }
  return [];
}

export function validateParentChildState(childState: string, parentState: string, context: string): ValidationIssue[] {
  if (childExceedsParent(childState, parentState)) {
    return [{ code: "KNW-V-060", message: `${context}: child state ${childState} exceeds parent state ${parentState}` }];
  }
  return [];
}

export function getValidationRules() {
  return {
    protocol: "11.12-W2",
    deletion: "soft_archive_only",
    orphan_knowledge: "prohibited",
    orphan_citation: "prohibited",
    id_recycling: "prohibited",
    claim_requires_evidence: "validated_requires_attached_or_verified",
    ai_content_labeling: "required",
    version_immutability: "knowledge_versions_and_history_immutable",
  };
}
