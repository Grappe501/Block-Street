import type {
  CalendarEventStaffingSummary,
  CalendarShiftCoverage,
  CalendarVolunteerShift,
  CoverageStatus,
  EventStaffingOverallStatus,
} from "./types";
import { trainingEligibilityLabel } from "./eligibility";
import {
  listConfirmations,
  listInterests,
  listLeadAssignments,
  listRequirements,
  listShifts,
} from "./store";
import { aggregateRequirementCounts } from "./requirements";
import { countConfirmedCoverageForShift, getShiftPipelineCounts } from "../assignments/coverage-integration";
import { countSoftBetaConfirmedForShift } from "../assignments/assignments";
import { listAssignments } from "../assignments/store";

function deriveCoverageStatus(
  minimumGap: number,
  targetGap: number,
  confirmedCount: number,
  leadRequired: boolean,
  leadCovered: boolean,
  criticality: string,
  maximumAllowed?: number | null,
): CoverageStatus {
  if (confirmedCount === 0 && minimumGap === 0 && targetGap === 0) return "not_required";
  if (maximumAllowed != null && confirmedCount > maximumAllowed) return "overstaffed";
  if ((criticality === "critical" || criticality === "required") && minimumGap > 0 && (leadRequired && !leadCovered)) {
    return "critical_gap";
  }
  if (minimumGap > 0) return criticality === "critical" ? "critical_gap" : "under_minimum";
  if (targetGap > 0) return "minimum_covered";
  if (confirmedCount >= 0 && targetGap === 0) return "target_covered";
  return "not_planned";
}

export function calculateShiftCoverage(shift: CalendarVolunteerShift, criticality = "required"): CalendarShiftCoverage {
  const shiftInterests = listInterests({ shiftId: shift.shiftId });
  const eventInterests = listInterests({ eventId: shift.eventId }).filter((i) => !i.shiftId);
  const allInterests = [...shiftInterests, ...eventInterests];
  const interestedCount = allInterests.filter((i) => i.interestStatus === "interested" || i.interestStatus === "under_review").length;
  const suggestedCount = allInterests.filter((i) => i.interestStatus === "suggested").length;
  const eligibleInterestCount = allInterests.filter((i) => i.trainingEligibility === "eligible").length;
  const confirmations = listConfirmations(shift.shiftId);
  const softBetaConfirmedCount = countSoftBetaConfirmedForShift(shift.shiftId);
  const durableConfirmedCount = 0;
  const confirmedCount = countConfirmedCoverageForShift(shift.shiftId);
  const pipeline = getShiftPipelineCounts(shift.shiftId, interestedCount);
  const leads = listLeadAssignments(shift.shiftId);
  const acceptedLeadCount = leads.filter((l) => l.status === "accepted").length;
  const leadCovered = !shift.leadRequired || acceptedLeadCount > 0;
  const minimumGap = Math.max(0, shift.minimumNeeded - confirmedCount);
  const targetGap = Math.max(0, shift.targetNeeded - confirmedCount);
  const trainingEligibleCount =
    confirmations.filter((c) => trainingEligibilityLabel(c.userId, shift.trainingRequirementKeys) === "eligible").length +
    listAssignments({ shiftId: shift.shiftId, activeOnly: true }).filter(
      (a) => trainingEligibilityLabel(a.volunteerUserId, shift.trainingRequirementKeys) === "eligible",
    ).length;
  const trainingGap = Math.max(0, shift.minimumNeeded - trainingEligibleCount);

  const reasons: string[] = [];
  if (interestedCount > 0 && confirmedCount === 0) reasons.push("Interest ≠ confirmation");
  if (suggestedCount > 0) reasons.push("Suggested placement ≠ confirmation");
  if (shift.leadRequired && acceptedLeadCount === 0) reasons.push("Required lead not accepted");
  if (trainingGap > 0) reasons.push("Training gap may block safe staffing");

  const coverageStatus = shift.status === "canceled"
    ? "not_required"
    : deriveCoverageStatus(minimumGap, targetGap, confirmedCount, shift.leadRequired, leadCovered, criticality, shift.maximumAllowed);

  return {
    shiftId: shift.shiftId,
    requirementId: shift.requirementId,
    minimumNeeded: shift.minimumNeeded,
    targetNeeded: shift.targetNeeded,
    maximumAllowed: shift.maximumAllowed,
    interestedCount,
    eligibleInterestCount,
    suggestedCount,
    acceptedLeadCount,
    confirmedCount,
    minimumGap,
    targetGap,
    leadRequired: shift.leadRequired,
    leadCovered,
    trainingEligibleCount,
    trainingGap,
    coverageStatus,
    confidence: confirmedCount > 0 ? "medium" : "low",
    reasons,
    softBetaConfirmedCount,
    durableConfirmedCount,
    offeredCount: pipeline.offeredCount,
    waitlistCount: pipeline.waitlistCount,
    reviewedCount: pipeline.reviewedCount,
  };
}

export function calculateEventStaffingSummary(eventId: string): CalendarEventStaffingSummary {
  const reqs = listRequirements(eventId).filter((r) => r.status === "active");
  const shiftList = listShifts(eventId);
  const { requiredPositions, targetPositions } = aggregateRequirementCounts(reqs);

  const coverages = shiftList.map((s) => {
    const req = reqs.find((r) => r.requirementId === s.requirementId);
    return calculateShiftCoverage(s, req?.criticality ?? "required");
  });

  const confirmedPositions = coverages.reduce((s, c) => s + c.confirmedCount, 0);
  const eligibleInterestCount = coverages.reduce((s, c) => s + c.eligibleInterestCount, 0);
  const totalInterestCount = coverages.reduce((s, c) => s + c.interestedCount, 0);
  const requirementsBelowMinimum = coverages.filter((c) => c.minimumGap > 0).length;
  const criticalRequirementsBelowMinimum = coverages.filter((c) =>
    c.coverageStatus === "critical_gap",
  ).length;
  const shiftsMissingLead = coverages.filter((c) => c.leadRequired && !c.leadCovered).length;
  const shiftsWithTrainingGap = coverages.filter((c) => c.trainingGap > 0).length;

  let overallStatus: EventStaffingOverallStatus = "no_plan";
  if (reqs.length === 0) overallStatus = "no_plan";
  else if (criticalRequirementsBelowMinimum > 0) overallStatus = "critical_shortage";
  else if (requirementsBelowMinimum > 0) overallStatus = "understaffed";
  else if (confirmedPositions >= targetPositions && shiftsMissingLead === 0 && shiftsWithTrainingGap === 0) {
    overallStatus = "fully_staffed";
  } else if (confirmedPositions >= requiredPositions) overallStatus = "minimum_staffed";
  else if (coverages.some((c) => c.coverageStatus === "overstaffed")) overallStatus = "overstaffed";

  const attentionReasons: string[] = [];
  if (reqs.length === 0) attentionReasons.push("no_staffing_plan");
  if (criticalRequirementsBelowMinimum > 0) attentionReasons.push("critical_staffing_gap");
  if (requirementsBelowMinimum > 0) attentionReasons.push("staffing_below_minimum");
  if (shiftsMissingLead > 0) attentionReasons.push("missing_shift_lead");
  if (shiftsWithTrainingGap > 0) attentionReasons.push("volunteer_training_gap");
  if (totalInterestCount > 0 && confirmedPositions === 0) attentionReasons.push("unreviewed_volunteer_interest");

  const primaryNextAction =
    reqs.length === 0
      ? { label: "Define staffing requirements", route: `/calendar/event/${eventId}/staffing/requirements` }
      : shiftList.length === 0
        ? { label: "Create shifts", route: `/calendar/event/${eventId}/shifts/new` }
        : requirementsBelowMinimum > 0
          ? { label: "Review coverage gaps", route: `/calendar/event/${eventId}/staffing/coverage` }
          : null;

  return {
    eventId,
    requirementCount: reqs.length,
    shiftCount: shiftList.length,
    requiredPositions,
    targetPositions,
    confirmedPositions,
    eligibleInterestCount,
    totalInterestCount,
    requirementsBelowMinimum,
    criticalRequirementsBelowMinimum,
    shiftsMissingLead,
    shiftsWithTrainingGap,
    overallStatus,
    attentionReasons,
    primaryNextAction,
  };
}

export function listStaffingGaps(scopeEventIds: string[]): Array<CalendarShiftCoverage & { eventId: string; roleLabel: string }> {
  const gaps: Array<CalendarShiftCoverage & { eventId: string; roleLabel: string }> = [];
  for (const eventId of scopeEventIds) {
    for (const shift of listShifts(eventId)) {
      const cov = calculateShiftCoverage(shift);
      if (cov.minimumGap > 0 || (cov.leadRequired && !cov.leadCovered)) {
        gaps.push({ ...cov, eventId, roleLabel: shift.roleLabel });
      }
    }
  }
  return gaps;
}
