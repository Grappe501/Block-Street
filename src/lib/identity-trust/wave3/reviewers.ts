import { loadHumanIdentities } from "../data";
import {
  loadIdentityReviewerQualifications,
  loadWave3Flags,
  loadWave3Policy,
  persistIdentityReviewerQualifications,
  loadIdentityReviewerConflicts,
  persistIdentityReviewerConflicts,
} from "./data";
import type { IdentityReviewerConflict, IdentityReviewerQualification } from "./types";
import { itlId, nowIso } from "../utils";
import { getIdentityCase } from "./cases";

export function getReviewerQualification(humanId: string): IdentityReviewerQualification | null {
  return loadIdentityReviewerQualifications().find((q) => q.human_id === humanId && q.status === "active") ?? null;
}

export function completeReviewerGovernanceTraining(
  humanId: string,
  reviewerType: IdentityReviewerQualification["reviewer_type"] = "institution",
  institutionId?: string
): IdentityReviewerQualification {
  const flags = loadWave3Flags();
  if (!flags.IDENTITY_REVIEWER_QUALIFICATION_REQUIRED) {
    throw new Error("Reviewer qualification is not required.");
  }

  const human = loadHumanIdentities().find((h) => h.user_id === humanId);
  if (!human || human.trust_level < 2) {
    throw new Error("Reviewer must have Verified identity or platform authorization.");
  }

  const qual: IdentityReviewerQualification = {
    id: itlId("irevqual"),
    human_id: humanId,
    reviewer_type: reviewerType,
    institution_id: institutionId ?? human.institution_id,
    training_version: "w3-gov-v1",
    qualified_at: nowIso(),
    expires_at: null,
    status: "active",
    restriction_reason: null,
  };

  const all = loadIdentityReviewerQualifications().filter((q) => q.human_id !== humanId);
  all.push(qual);
  persistIdentityReviewerQualifications(all);
  return qual;
}

export function checkReviewerConflict(caseId: string, reviewerId: string): { conflict: boolean; reason?: string } {
  const c = getIdentityCase(caseId);
  if (!c) return { conflict: true, reason: "Case not found." };
  if (c.subject_human_id === reviewerId) return { conflict: true, reason: "Subject cannot review own case." };
  if (c.reporting_human_id === reviewerId) return { conflict: true, reason: "Reporter conflict." };

  const existing = loadIdentityReviewerConflicts().find(
    (x) => x.case_id === caseId && x.reviewer_human_id === reviewerId && x.decision === "recused"
  );
  if (existing) return { conflict: true, reason: existing.description };

  return { conflict: false };
}

export function recordReviewerRecusal(input: {
  case_id: string;
  reviewer_human_id: string;
  conflict_type: string;
  description: string;
  decided_by: string;
}): IdentityReviewerConflict {
  const record: IdentityReviewerConflict = {
    id: itlId("iconf"),
    case_id: input.case_id,
    reviewer_human_id: input.reviewer_human_id,
    conflict_type: input.conflict_type,
    description: input.description,
    disclosed_at: nowIso(),
    decision: "recused",
    decided_by: input.decided_by,
  };

  const conflicts = loadIdentityReviewerConflicts();
  conflicts.push(record);
  persistIdentityReviewerConflicts(conflicts);
  return record;
}

export function isQualifiedReviewer(humanId: string): boolean {
  const flags = loadWave3Flags();
  if (!flags.IDENTITY_REVIEWER_QUALIFICATION_REQUIRED) return true;
  return Boolean(getReviewerQualification(humanId));
}

export function getReviewBoards() {
  return loadWave3Policy().boards;
}
