import type { CalendarVolunteerReview } from "./types";
import { evaluateScheduleConflict, evaluateTrainingStatus } from "./eligibility";
import { recordAudit } from "./audit";
import { getReviewById, listReviews, saveReview } from "./store";
import { listInterests } from "../staffing/store";
import { getShiftById } from "../staffing/store";
import { calculateShiftCoverage } from "../staffing/coverage";

export type ReviewQueueItem = CalendarVolunteerReview & {
  volunteerDisplayName: string;
  eventTitle: string;
  preferredRole?: string | null;
  preferredShift?: string | null;
  coverageSummary?: string | null;
  suggestedNextAction: string;
  priorityScore: number;
};

const DISPLAY_NAMES: Record<string, string> = {
  "usr-demo-001": "Demo Volunteer",
  "usr-demo-002": "Alex M.",
  "usr-demo-003": "Jordan K.",
};

export function volunteerSafeDisplayName(userId: string): string {
  return DISPLAY_NAMES[userId] ?? `Volunteer ${userId.slice(-4)}`;
}

export function ensureReviewForInterest(interestId: string): CalendarVolunteerReview | null {
  const existing = listReviews({ interestId })[0];
  if (existing) return existing;
  const interest = listInterests().find((i) => i.interestId === interestId);
  if (!interest) return null;
  const now = new Date().toISOString();
  const shift = interest.shiftId ? getShiftById(interest.shiftId) : null;
  const trainingKeys = shift?.trainingRequirementKeys ?? [];
  const review: CalendarVolunteerReview = {
    reviewId: `rev-${interestId}`,
    interestId: interest.interestId,
    eventId: interest.eventId,
    shiftId: interest.shiftId,
    requirementId: interest.requirementId,
    volunteerUserId: interest.userId,
    reviewStatus: "not_reviewed",
    roleEligibility: "unknown",
    trainingStatus: evaluateTrainingStatus(interest.userId, trainingKeys),
    scheduleStatus:
      shift && interest.userId
        ? evaluateScheduleConflict(interest.userId, shift.startAt, shift.endAt, shift.shiftId) === "hard_conflict"
          ? "hard_conflict"
          : evaluateScheduleConflict(interest.userId, shift.startAt, shift.endAt, shift.shiftId) === "possible_conflict"
            ? "possible_conflict"
            : "clear"
        : "unknown",
    createdAt: now,
    updatedAt: now,
  };
  return saveReview(review);
}

export function submitReview(input: {
  reviewId: string;
  reviewStatus: CalendarVolunteerReview["reviewStatus"];
  roleEligibility: CalendarVolunteerReview["roleEligibility"];
  reviewerUserId?: string | null;
  reviewerRoleKey?: string | null;
  internalNotes?: string | null;
  volunteerSafeExplanation?: string | null;
}): CalendarVolunteerReview | null {
  const existing = getReviewById(input.reviewId);
  if (!existing) return null;
  const now = new Date().toISOString();
  const updated: CalendarVolunteerReview = {
    ...existing,
    reviewStatus: input.reviewStatus,
    roleEligibility: input.roleEligibility,
    reviewerUserId: input.reviewerUserId ?? null,
    reviewerRoleKey: input.reviewerRoleKey ?? null,
    internalNotes: input.internalNotes ?? null,
    volunteerSafeExplanation: input.volunteerSafeExplanation ?? null,
    reviewedAt: now,
    updatedAt: now,
  };
  recordAudit({
    entityType: "review",
    entityId: updated.reviewId,
    eventId: updated.eventId,
    shiftId: updated.shiftId,
    volunteerUserId: updated.volunteerUserId,
    action: "review_submitted",
    previousStatus: existing.reviewStatus,
    nextStatus: updated.reviewStatus,
    actorUserId: input.reviewerUserId ?? null,
    actorRoleKey: input.reviewerRoleKey ?? null,
  });
  return saveReview(updated);
}

function reviewPriority(review: CalendarVolunteerReview): number {
  let score = 0;
  if (review.shiftId) {
    const shift = getShiftById(review.shiftId);
    if (shift) {
      const cov = calculateShiftCoverage(shift);
      if (cov.coverageStatus === "critical_gap") score += 1000;
      if (cov.minimumGap > 0) score += 500;
    }
  }
  if (review.trainingStatus === "eligible") score += 200;
  if (review.roleEligibility === "eligible") score += 150;
  if (review.reviewStatus === "not_reviewed") score += 100 - Math.min(99, Math.floor((Date.now() - new Date(review.createdAt).getTime()) / 86400000));
  return score;
}

export function listReviewQueue(filter?: { eventId?: string; shiftId?: string }): ReviewQueueItem[] {
  const interests = listInterests(filter);
  const items: ReviewQueueItem[] = [];
  for (const interest of interests) {
    const review = ensureReviewForInterest(interest.interestId);
    if (!review || review.reviewStatus === "withdrawn") continue;
    const shift = review.shiftId ? getShiftById(review.shiftId) : null;
    const cov = shift ? calculateShiftCoverage(shift) : null;
    let suggestedNextAction = "Review interest";
    if (review.reviewStatus === "eligible") suggestedNextAction = "Prepare shift offer";
    else if (review.roleEligibility === "capacity_full") suggestedNextAction = "Add to waitlist";
    else if (review.scheduleStatus === "hard_conflict") suggestedNextAction = "Resolve conflict or override";
    else if (review.trainingStatus === "missing") suggestedNextAction = "Conditional eligibility or training";
    items.push({
      ...review,
      volunteerDisplayName: volunteerSafeDisplayName(review.volunteerUserId),
      eventTitle: review.eventId,
      preferredRole: interest.rolePreferenceKeys[0] ?? shift?.roleKey ?? null,
      preferredShift: shift?.name ?? review.shiftId ?? null,
      coverageSummary: cov ? `${cov.confirmedCount}/${cov.minimumNeeded} min` : null,
      suggestedNextAction,
      priorityScore: reviewPriority(review),
    });
  }
  return items.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function projectVolunteerSafeReview(review: CalendarVolunteerReview): Omit<CalendarVolunteerReview, "internalNotes"> & { internalNotes?: never } {
  const { internalNotes: _omit, ...safe } = review;
  return safe;
}
