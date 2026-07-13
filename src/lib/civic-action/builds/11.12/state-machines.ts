/**
 * CAE-11.12-W2 — Knowledge lifecycle state machines + transition helpers
 */
import type {
  CanonicalArtifactStatus,
  CanonicalCertificationStatus,
  CanonicalClaimStatus,
  CanonicalCompetencyStatus,
  CanonicalCourseStatus,
} from "./data-model";

export const ARTIFACT_TRANSITIONS: Record<CanonicalArtifactStatus, CanonicalArtifactStatus[]> = {
  draft: ["review", "archived"],
  review: ["validated", "draft", "archived"],
  validated: ["published", "review", "archived"],
  published: ["operational", "historical", "archived"],
  operational: ["historical", "archived"],
  historical: ["archived"],
  archived: [],
};

export const COURSE_TRANSITIONS: Record<CanonicalCourseStatus, CanonicalCourseStatus[]> = {
  draft: ["review", "archived"],
  review: ["published", "draft", "archived"],
  published: ["active", "retired", "archived"],
  active: ["retired", "archived"],
  retired: ["archived"],
  archived: [],
};

export const CERTIFICATION_TRANSITIONS: Record<CanonicalCertificationStatus, CanonicalCertificationStatus[]> = {
  draft: ["review", "archived"],
  review: ["active", "draft", "archived"],
  active: ["suspended", "expired", "archived"],
  suspended: ["active", "expired", "archived"],
  expired: ["archived"],
  archived: [],
};

export const COMPETENCY_TRANSITIONS: Record<CanonicalCompetencyStatus, CanonicalCompetencyStatus[]> = {
  draft: ["defined", "archived"],
  defined: ["active", "draft", "archived"],
  active: ["deprecated", "archived"],
  deprecated: ["archived"],
  archived: [],
};

export const CLAIM_TRANSITIONS: Record<CanonicalClaimStatus, CanonicalClaimStatus[]> = {
  draft: ["pending_evidence", "archived"],
  pending_evidence: ["evidence_attached", "archived"],
  evidence_attached: ["validated", "disputed", "archived"],
  validated: ["disputed", "retracted", "archived"],
  disputed: ["validated", "retracted", "archived"],
  retracted: ["archived"],
  archived: [],
};

export const ILLEGAL_CHILD_PARENT: {
  child: string;
  child_state: string;
  parent: string;
  parent_state: string;
  reason: string;
}[] = [
  {
    child: "Lesson",
    child_state: "active",
    parent: "Course",
    parent_state: "draft",
    reason: "Lesson cannot be Active if Course remains Draft",
  },
  {
    child: "KnowledgeClaim",
    child_state: "validated",
    parent: "KnowledgeArtifact",
    parent_state: "draft",
    reason: "Claim cannot be Validated if Artifact is Draft",
  },
  {
    child: "CertificationAward",
    child_state: "awarded",
    parent: "Certification",
    parent_state: "draft",
    reason: "Award cannot be granted if Certification is Draft",
  },
  {
    child: "LearningCompletion",
    child_state: "completed",
    parent: "Course",
    parent_state: "draft",
    reason: "Completion cannot bind to Draft Course",
  },
];

const PARENT_RANK: Record<string, number> = {
  draft: 0,
  pending_evidence: 1,
  defined: 1,
  review: 2,
  evidence_attached: 2,
  validated: 3,
  published: 3,
  active: 4,
  operational: 5,
  completed: 5,
  awarded: 5,
  historical: 6,
  retired: 6,
  deprecated: 6,
  expired: 6,
  suspended: 6,
  disputed: 6,
  retracted: 7,
  archived: 8,
};

export function childExceedsParent(childState: string, parentState: string): boolean {
  const c = PARENT_RANK[childState] ?? 0;
  const p = PARENT_RANK[parentState] ?? 0;
  return c > p && childState !== parentState;
}

export function isArtifactTransitionAllowed(from: CanonicalArtifactStatus, to: CanonicalArtifactStatus): boolean {
  if (from === to) return true;
  return ARTIFACT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isCourseTransitionAllowed(from: CanonicalCourseStatus, to: CanonicalCourseStatus): boolean {
  if (from === to) return true;
  return COURSE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isCertificationTransitionAllowed(
  from: CanonicalCertificationStatus,
  to: CanonicalCertificationStatus
): boolean {
  if (from === to) return true;
  return CERTIFICATION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isCompetencyTransitionAllowed(from: CanonicalCompetencyStatus, to: CanonicalCompetencyStatus): boolean {
  if (from === to) return true;
  return COMPETENCY_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isClaimTransitionAllowed(from: CanonicalClaimStatus, to: CanonicalClaimStatus): boolean {
  if (from === to) return true;
  return CLAIM_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getStateMachineDefinition() {
  return {
    protocol: "11.12-W2",
    entities: {
      KnowledgeArtifact: { states: Object.keys(ARTIFACT_TRANSITIONS), transitions: ARTIFACT_TRANSITIONS },
      Course: { states: Object.keys(COURSE_TRANSITIONS), transitions: COURSE_TRANSITIONS },
      Certification: { states: Object.keys(CERTIFICATION_TRANSITIONS), transitions: CERTIFICATION_TRANSITIONS },
      Competency: { states: Object.keys(COMPETENCY_TRANSITIONS), transitions: COMPETENCY_TRANSITIONS },
      KnowledgeClaim: { states: Object.keys(CLAIM_TRANSITIONS), transitions: CLAIM_TRANSITIONS },
    },
    illegal_child_parent: ILLEGAL_CHILD_PARENT,
    principle: "Children cannot exceed parent lifecycle; claims require evidence before validation",
  };
}
