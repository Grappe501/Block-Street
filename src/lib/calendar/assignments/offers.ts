import type { CalendarShiftOffer } from "./types";
import { evaluateScheduleConflict, evaluateShiftCapacity, evaluateTrainingStatus } from "./eligibility";
import { recordAudit } from "./audit";
import { canTransitionOffer } from "./status";
import { getOfferById, listOffers, saveOffer } from "./store";
import { getShiftById } from "../staffing/store";
import { listAssignments } from "./store";

const ACTIVE_OFFER_STATUSES = new Set(["draft", "ready", "offered", "viewed", "change_requested"]);

export function hasActiveOfferForVolunteerShift(volunteerUserId: string, shiftId: string): boolean {
  return listOffers({ volunteerUserId, shiftId }).some((o) => ACTIVE_OFFER_STATUSES.has(o.offerStatus));
}

export function validateOfferCreation(input: {
  volunteerUserId: string;
  shiftId: string;
  expiresAt?: string | null;
}): { ok: boolean; warnings: string[]; blockedReasons: string[] } {
  const warnings: string[] = [];
  const blockedReasons: string[] = [];
  const shift = getShiftById(input.shiftId);
  if (!shift) blockedReasons.push("Shift not found");
  else if (shift.status === "canceled") blockedReasons.push("Shift canceled");
  if (hasActiveOfferForVolunteerShift(input.volunteerUserId, input.shiftId)) {
    blockedReasons.push("Duplicate active offer for volunteer and shift");
  }
  const existingAssignment = listAssignments({ shiftId: input.shiftId, volunteerUserId: input.volunteerUserId, activeOnly: true });
  if (existingAssignment.length > 0) blockedReasons.push("Volunteer already assigned to shift");
  const cap = evaluateShiftCapacity(input.shiftId);
  if (cap.atMaximum) blockedReasons.push("Shift at maximum capacity");
  if (shift) {
    const conflict = evaluateScheduleConflict(input.volunteerUserId, shift.startAt, shift.endAt, shift.shiftId);
    if (conflict === "hard_conflict") blockedReasons.push("Hard schedule conflict");
    else if (conflict === "possible_conflict") warnings.push("Possible schedule conflict");
    const training = evaluateTrainingStatus(input.volunteerUserId, shift.trainingRequirementKeys);
    if (training === "missing") warnings.push("Missing blocking training");
    if (input.expiresAt && shift && new Date(input.expiresAt) > new Date(shift.startAt)) {
      blockedReasons.push("Offer expiration after shift start");
    }
  }
  return { ok: blockedReasons.length === 0, warnings, blockedReasons };
}

export function createDraftOffer(input: {
  eventId: string;
  shiftId: string;
  requirementId: string;
  volunteerUserId: string;
  offeredRoleKey: string;
  offeredRoleLabel: string;
  trainingConditionKeys?: string[];
  volunteerInstructions?: string | null;
  managerNotes?: string | null;
  expiresAt?: string | null;
  source?: CalendarShiftOffer["source"];
  replacementForAssignmentId?: string | null;
  offeredByUserId?: string | null;
}): { offer?: CalendarShiftOffer; blockedReasons: string[]; warnings: string[] } {
  const validation = validateOfferCreation({
    volunteerUserId: input.volunteerUserId,
    shiftId: input.shiftId,
    expiresAt: input.expiresAt,
  });
  if (!validation.ok) return { blockedReasons: validation.blockedReasons, warnings: validation.warnings };
  const shift = getShiftById(input.shiftId)!;
  const now = new Date().toISOString();
  const offer: CalendarShiftOffer = {
    offerId: `off-${input.shiftId}-${input.volunteerUserId}-${Date.now()}`,
    eventId: input.eventId,
    shiftId: input.shiftId,
    requirementId: input.requirementId,
    volunteerUserId: input.volunteerUserId,
    offeredRoleKey: input.offeredRoleKey,
    offeredRoleLabel: input.offeredRoleLabel,
    offeredStartAt: shift.startAt,
    offeredEndAt: shift.endAt,
    offeredArrivalAt: shift.arrivalAt ?? null,
    offerStatus: "draft",
    expiresAt: input.expiresAt ?? null,
    trainingConditionKeys: input.trainingConditionKeys ?? shift.trainingRequirementKeys,
    conditions: [],
    volunteerInstructions: input.volunteerInstructions ?? null,
    managerNotes: input.managerNotes ?? null,
    replacementForAssignmentId: input.replacementForAssignmentId ?? null,
    source: input.source ?? "interest_review",
    createdAt: now,
    updatedAt: now,
  };
  saveOffer(offer);
  recordAudit({
    entityType: "offer",
    entityId: offer.offerId,
    eventId: offer.eventId,
    shiftId: offer.shiftId,
    volunteerUserId: offer.volunteerUserId,
    action: "offer_created",
    nextStatus: "draft",
    actorUserId: input.offeredByUserId ?? null,
  });
  return { offer, blockedReasons: [], warnings: validation.warnings };
}

export function transitionOffer(offerId: string, toStatus: CalendarShiftOffer["offerStatus"], actorUserId?: string | null): CalendarShiftOffer | null {
  const offer = getOfferById(offerId);
  if (!offer || !canTransitionOffer(offer.offerStatus, toStatus)) return null;
  const now = new Date().toISOString();
  const updated: CalendarShiftOffer = {
    ...offer,
    offerStatus: toStatus,
    updatedAt: now,
    ...(toStatus === "offered" ? { offeredAt: now, offeredByUserId: actorUserId ?? null } : {}),
    ...(toStatus === "viewed" ? { viewedAt: now } : {}),
    ...(toStatus === "accepted" || toStatus === "declined" || toStatus === "change_requested" ? { respondedAt: now } : {}),
  };
  recordAudit({
    entityType: "offer",
    entityId: offer.offerId,
    eventId: offer.eventId,
    shiftId: offer.shiftId,
    volunteerUserId: offer.volunteerUserId,
    action: `offer_${toStatus}`,
    previousStatus: offer.offerStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  return saveOffer(updated);
}

export function sendOffer(offerId: string, actorUserId?: string | null): CalendarShiftOffer | null {
  const offer = getOfferById(offerId);
  if (!offer) return null;
  if (offer.offerStatus === "draft") transitionOffer(offerId, "ready", actorUserId);
  return transitionOffer(offerId, "offered", actorUserId);
}

export function isOfferAcceptable(offer: CalendarShiftOffer): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (!["offered", "viewed"].includes(offer.offerStatus)) reasons.push("Offer not active");
  if (offer.offerStatus === "expired" || offer.offerStatus === "withdrawn" || offer.offerStatus === "superseded") {
    reasons.push("Offer no longer valid");
  }
  if (offer.expiresAt && new Date(offer.expiresAt) < new Date()) reasons.push("Offer expired");
  const shift = getShiftById(offer.shiftId);
  if (!shift || shift.status === "canceled") reasons.push("Shift unavailable");
  const cap = evaluateShiftCapacity(offer.shiftId);
  if (cap.atMaximum) reasons.push("Shift at capacity");
  return { ok: reasons.length === 0, reasons };
}

export function projectVolunteerSafeOffer(offer: CalendarShiftOffer, eventTitle: string, locationSummary?: string | null) {
  return {
    offerId: offer.offerId,
    eventTitle,
    role: offer.offeredRoleLabel,
    startAt: offer.offeredStartAt,
    endAt: offer.offeredEndAt,
    arrivalAt: offer.offeredArrivalAt,
    locationSummary: locationSummary ?? "See event details",
    trainingNeeded: offer.trainingConditionKeys,
    instructions: offer.volunteerInstructions,
    expiresAt: offer.expiresAt,
    offerStatus: offer.offerStatus,
    softBetaDisclosure:
      "Volunteer placement is operating in soft beta. Accepted offers are not yet durable production assignments while Gate A remains open.",
  };
}

export function withdrawConflictingOffers(
  volunteerUserId: string,
  startAt: string,
  endAt: string,
  exceptOfferId: string,
): string[] {
  const withdrawn: string[] = [];
  for (const o of listOffers({ volunteerUserId })) {
    if (o.offerId === exceptOfferId) continue;
    if (!["offered", "viewed", "ready"].includes(o.offerStatus)) continue;
    const overlap =
      new Date(o.offeredStartAt) < new Date(endAt) && new Date(startAt) < new Date(o.offeredEndAt);
    if (overlap && transitionOffer(o.offerId, "withdrawn")) withdrawn.push(o.offerId);
  }
  return withdrawn;
}
