import { listOpenReplacementNeeds } from "./replacements";
import { listOffers, listReviews, listAssignments } from "./store";
import { calculateEventStaffingSummary } from "../staffing/coverage";
import type { EventReadinessState } from "../operations/types";

export function evaluateAssignmentStaffingReadiness(eventId: string): {
  state: EventReadinessState;
  explanation: string;
  blockers: string[];
} {
  const summary = calculateEventStaffingSummary(eventId);
  const blockers: string[] = [];
  if (summary.requirementCount === 0) {
    return { state: "not_started", explanation: "Staffing required but no requirements exist", blockers };
  }
  const criticalReplacements = listOpenReplacementNeeds({ eventId }).filter((n) => n.urgency === "critical");
  if (criticalReplacements.length > 0) {
    blockers.push("Critical replacement need unfilled");
  }
  if (summary.criticalRequirementsBelowMinimum > 0) {
    blockers.push("Critical shift below minimum");
  }
  if (blockers.length > 0) {
    return { state: "blocked", explanation: blockers.join("; "), blockers };
  }
  const unreviewed = listReviews({ eventId }).filter((r) => r.reviewStatus === "not_reviewed").length;
  const pendingOffers = listOffers({ eventId }).filter((o) => ["offered", "viewed", "draft", "ready"].includes(o.offerStatus)).length;
  const belowTarget = summary.confirmedPositions < summary.targetPositions;
  if (unreviewed > 0 || pendingOffers > 0 || belowTarget) {
    return {
      state: "in_progress",
      explanation: "Review, offers, or soft-beta coverage below target",
      blockers: [],
    };
  }
  const pendingTraining = listAssignments({ eventId, activeOnly: true }).filter(
    (a) => a.trainingConditionStatus === "pending",
  ).length;
  if (summary.shiftsMissingLead > 0 || pendingTraining > 0) {
    return { state: "in_progress", explanation: "Leads or training conditions pending", blockers: [] };
  }
  if (summary.confirmedPositions >= summary.requiredPositions && summary.shiftsMissingLead === 0) {
    return {
      state: "ready",
      explanation: "Soft-beta coverage at minimum with explicit soft-beta label",
      blockers: [],
    };
  }
  return { state: "in_progress", explanation: "Staffing workflow underway", blockers: [] };
}
