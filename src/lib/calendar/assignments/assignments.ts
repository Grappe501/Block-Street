import type { CalendarShiftAssignment, CalendarShiftOfferResponse, CreateAssignmentFromOfferResult } from "./types";
import { evaluateScheduleConflict, evaluateTrainingStatus } from "./eligibility";
import { isOfferAcceptable, transitionOffer, withdrawConflictingOffers } from "./offers";
import { recordAudit } from "./audit";
import { canTransitionAssignment } from "./status";
import {
  getAssignmentById,
  getOfferById,
  listAssignments,
  listOffers,
  saveAssignment,
  saveResponse,
} from "./store";
import { calculateShiftCoverage } from "../staffing/coverage";
import { getShiftById } from "../staffing/store";

function newAssignmentFromOffer(offer: import("./types").CalendarShiftOffer): CalendarShiftAssignment {
  const now = new Date().toISOString();
  const training = evaluateTrainingStatus(offer.volunteerUserId, offer.trainingConditionKeys);
  return {
    assignmentId: `asg-${offer.offerId}`,
    eventId: offer.eventId,
    shiftId: offer.shiftId,
    requirementId: offer.requirementId,
    volunteerUserId: offer.volunteerUserId,
    roleKey: offer.offeredRoleKey,
    roleLabel: offer.offeredRoleLabel,
    startAt: offer.offeredStartAt,
    endAt: offer.offeredEndAt,
    arrivalAt: offer.offeredArrivalAt,
    assignmentStatus: "soft_beta_confirmed",
    sourceOfferId: offer.offerId,
    sourceInterestId: null,
    trainingConditionKeys: offer.trainingConditionKeys,
    trainingConditionStatus: training === "eligible" ? "satisfied" : training === "missing" ? "pending" : "pending",
    isShiftLead: false,
    shiftLeadRole: null,
    confirmedByUserId: offer.offeredByUserId ?? null,
    confirmedAt: now,
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function countActiveAssignmentsForShift(shiftId: string): number {
  return listAssignments({ shiftId, activeOnly: true }).length;
}

export function countSoftBetaConfirmedForShift(shiftId: string): number {
  return listAssignments({ shiftId }).filter((a) => a.assignmentStatus === "soft_beta_confirmed").length;
}

export function countDurableConfirmedForShift(_shiftId: string): number {
  return 0;
}

export function createAssignmentFromOffer(
  offerId: string,
  volunteerUserId: string,
): CreateAssignmentFromOfferResult {
  const result: CreateAssignmentFromOfferResult = {
    success: false,
    conflictingOffersWithdrawn: [],
    waitlistPromotionsTriggered: [],
    warnings: [],
    blockedReasons: [],
  };
  const offer = getOfferById(offerId);
  if (!offer) {
    result.blockedReasons.push("Offer not found");
    return result;
  }
  if (offer.volunteerUserId !== volunteerUserId) {
    result.blockedReasons.push("Only intended volunteer may accept");
    return result;
  }
  const acceptable = isOfferAcceptable(offer);
  if (!acceptable.ok) {
    result.blockedReasons.push(...acceptable.reasons);
    return result;
  }
  const conflict = evaluateScheduleConflict(
    volunteerUserId,
    offer.offeredStartAt,
    offer.offeredEndAt,
    offer.shiftId,
  );
  if (conflict === "hard_conflict") {
    result.blockedReasons.push("Hard schedule conflict");
    return result;
  }
  if (conflict === "possible_conflict") result.warnings.push("Possible schedule conflict accepted");
  const shift = getShiftById(offer.shiftId);
  if (!shift) {
    result.blockedReasons.push("Shift not found");
    return result;
  }
  result.coverageBefore = calculateShiftCoverage(shift);
  const dup = listAssignments({ shiftId: offer.shiftId, volunteerUserId, activeOnly: true });
  if (dup.length > 0) {
    result.blockedReasons.push("Duplicate active assignment");
    return result;
  }
  const assignment = newAssignmentFromOffer(offer);
  saveAssignment(assignment);
  const updatedOffer = transitionOffer(offerId, "accepted", volunteerUserId);
  result.conflictingOffersWithdrawn = withdrawConflictingOffers(
    volunteerUserId,
    offer.offeredStartAt,
    offer.offeredEndAt,
    offerId,
  );
  result.coverageAfter = calculateShiftCoverage(shift);
  recordAudit({
    entityType: "assignment",
    entityId: assignment.assignmentId,
    eventId: assignment.eventId,
    shiftId: assignment.shiftId,
    volunteerUserId: assignment.volunteerUserId,
    action: "assignment_created_from_offer",
    nextStatus: assignment.assignmentStatus,
    actorUserId: volunteerUserId,
  });
  result.success = true;
  result.assignment = assignment;
  result.updatedOffer = updatedOffer ?? undefined;
  return result;
}

export function respondToOffer(input: {
  offerId: string;
  volunteerUserId: string;
  response: CalendarShiftOfferResponse["response"];
  declineReasonKey?: CalendarShiftOfferResponse["declineReasonKey"];
  requestedChanges?: CalendarShiftOfferResponse["requestedChanges"];
  volunteerNote?: string | null;
}): {
  success: boolean;
  assignment?: CalendarShiftAssignment;
  response?: CalendarShiftOfferResponse;
  blockedReasons: string[];
} {
  const offer = getOfferById(input.offerId);
  if (!offer || offer.volunteerUserId !== input.volunteerUserId) {
    return { success: false, blockedReasons: ["Unauthorized or missing offer"] };
  }
  const now = new Date().toISOString();
  const response: CalendarShiftOfferResponse = {
    responseId: `resp-${input.offerId}-${Date.now()}`,
    offerId: input.offerId,
    volunteerUserId: input.volunteerUserId,
    response: input.response,
    declineReasonKey: input.declineReasonKey ?? null,
    requestedChanges: input.requestedChanges ?? null,
    volunteerNote: input.volunteerNote ?? null,
    respondedAt: now,
  };
  saveResponse(response);
  recordAudit({
    entityType: "offer",
    entityId: offer.offerId,
    eventId: offer.eventId,
    shiftId: offer.shiftId,
    volunteerUserId: input.volunteerUserId,
    action: `offer_response_${input.response}`,
    previousStatus: offer.offerStatus,
    nextStatus: input.response,
    actorUserId: input.volunteerUserId,
  });
  if (input.response === "accepted") {
    const created = createAssignmentFromOffer(input.offerId, input.volunteerUserId);
    return {
      success: created.success,
      assignment: created.assignment,
      response,
      blockedReasons: created.blockedReasons,
    };
  }
  const status = input.response === "declined" ? "declined" : "change_requested";
  transitionOffer(input.offerId, status, input.volunteerUserId);
  return { success: true, response, blockedReasons: [] };
}

export function markAssignmentReplaced(assignmentId: string): CalendarShiftAssignment | null {
  const a = getAssignmentById(assignmentId);
  if (!a || !canTransitionAssignment(a.assignmentStatus, "replaced")) return null;
  const updated = saveAssignment({ ...a, assignmentStatus: "replaced", updatedAt: new Date().toISOString() });
  recordAudit({
    entityType: "assignment",
    entityId: a.assignmentId,
    eventId: a.eventId,
    shiftId: a.shiftId,
    volunteerUserId: a.volunteerUserId,
    action: "assignment_replaced",
    previousStatus: a.assignmentStatus,
    nextStatus: "replaced",
  });
  return updated;
}

export function listMyShiftOffers(volunteerUserId: string) {
  return listOffers({ volunteerUserId }).filter((o) =>
    ["offered", "viewed", "ready", "draft"].includes(o.offerStatus),
  );
}

export function listMyShifts(volunteerUserId: string) {
  return listAssignments({ volunteerUserId, activeOnly: true });
}
