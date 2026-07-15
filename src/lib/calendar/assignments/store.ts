import type {
  CalendarAssignmentAuditEvent,
  CalendarAssignmentCancellation,
  CalendarReplacementNeed,
  CalendarShiftAssignment,
  CalendarShiftOffer,
  CalendarShiftOfferResponse,
  CalendarShiftWaitlistEntry,
  CalendarVolunteerReview,
} from "./types";

let reviews: CalendarVolunteerReview[] = [];
let offers: CalendarShiftOffer[] = [];
let responses: CalendarShiftOfferResponse[] = [];
let assignments: CalendarShiftAssignment[] = [];
let waitlists: CalendarShiftWaitlistEntry[] = [];
let cancellations: CalendarAssignmentCancellation[] = [];
let replacementNeeds: CalendarReplacementNeed[] = [];
let auditEvents: CalendarAssignmentAuditEvent[] = [];

export function listReviews(filter?: { eventId?: string; interestId?: string }): CalendarVolunteerReview[] {
  return reviews.filter((r) => {
    if (filter?.eventId && r.eventId !== filter.eventId) return false;
    if (filter?.interestId && r.interestId !== filter.interestId) return false;
    return true;
  });
}

export function getReviewById(reviewId: string): CalendarVolunteerReview | null {
  return reviews.find((r) => r.reviewId === reviewId) ?? null;
}

export function saveReview(r: CalendarVolunteerReview): CalendarVolunteerReview {
  reviews = [r, ...reviews.filter((x) => x.reviewId !== r.reviewId)];
  return r;
}

export function listOffers(filter?: { eventId?: string; shiftId?: string; volunteerUserId?: string }): CalendarShiftOffer[] {
  return offers.filter((o) => {
    if (filter?.eventId && o.eventId !== filter.eventId) return false;
    if (filter?.shiftId && o.shiftId !== filter.shiftId) return false;
    if (filter?.volunteerUserId && o.volunteerUserId !== filter.volunteerUserId) return false;
    return true;
  });
}

export function getOfferById(offerId: string): CalendarShiftOffer | null {
  return offers.find((o) => o.offerId === offerId) ?? null;
}

export function saveOffer(o: CalendarShiftOffer): CalendarShiftOffer {
  offers = [o, ...offers.filter((x) => x.offerId !== o.offerId)];
  return o;
}

export function listResponses(offerId?: string): CalendarShiftOfferResponse[] {
  return offerId ? responses.filter((r) => r.offerId === offerId) : [...responses];
}

export function saveResponse(r: CalendarShiftOfferResponse): CalendarShiftOfferResponse {
  responses = [r, ...responses.filter((x) => x.responseId !== r.responseId)];
  return r;
}

export function listAssignments(filter?: {
  eventId?: string;
  shiftId?: string;
  volunteerUserId?: string;
  activeOnly?: boolean;
}): CalendarShiftAssignment[] {
  return assignments.filter((a) => {
    if (filter?.eventId && a.eventId !== filter.eventId) return false;
    if (filter?.shiftId && a.shiftId !== filter.shiftId) return false;
    if (filter?.volunteerUserId && a.volunteerUserId !== filter.volunteerUserId) return false;
    if (filter?.activeOnly && !["soft_beta_confirmed", "confirmation_pending", "confirmed"].includes(a.assignmentStatus)) {
      return false;
    }
    return true;
  });
}

export function getAssignmentById(assignmentId: string): CalendarShiftAssignment | null {
  return assignments.find((a) => a.assignmentId === assignmentId) ?? null;
}

export function saveAssignment(a: CalendarShiftAssignment): CalendarShiftAssignment {
  assignments = [a, ...assignments.filter((x) => x.assignmentId !== a.assignmentId)];
  return a;
}

export function listWaitlistEntries(filter?: { eventId?: string; shiftId?: string; volunteerUserId?: string }): CalendarShiftWaitlistEntry[] {
  return waitlists.filter((w) => {
    if (filter?.eventId && w.eventId !== filter.eventId) return false;
    if (filter?.shiftId && w.shiftId !== filter.shiftId) return false;
    if (filter?.volunteerUserId && w.volunteerUserId !== filter.volunteerUserId) return false;
    return w.waitlistStatus !== "removed" && w.waitlistStatus !== "withdrawn";
  });
}

export function saveWaitlistEntry(w: CalendarShiftWaitlistEntry): CalendarShiftWaitlistEntry {
  waitlists = [w, ...waitlists.filter((x) => x.waitlistEntryId !== w.waitlistEntryId)];
  return w;
}

export function listCancellations(filter?: { eventId?: string; assignmentId?: string }): CalendarAssignmentCancellation[] {
  return cancellations.filter((c) => {
    if (filter?.eventId && c.eventId !== filter.eventId) return false;
    if (filter?.assignmentId && c.assignmentId !== filter.assignmentId) return false;
    return true;
  });
}

export function saveCancellation(c: CalendarAssignmentCancellation): CalendarAssignmentCancellation {
  cancellations = [c, ...cancellations.filter((x) => x.cancellationId !== c.cancellationId)];
  return c;
}

export function listReplacementNeeds(filter?: { eventId?: string; shiftId?: string; status?: string }): CalendarReplacementNeed[] {
  return replacementNeeds.filter((n) => {
    if (filter?.eventId && n.eventId !== filter.eventId) return false;
    if (filter?.shiftId && n.shiftId !== filter.shiftId) return false;
    if (filter?.status && n.status !== filter.status) return false;
    return true;
  });
}

export function saveReplacementNeed(n: CalendarReplacementNeed): CalendarReplacementNeed {
  replacementNeeds = [n, ...replacementNeeds.filter((x) => x.replacementNeedId !== n.replacementNeedId)];
  return n;
}

export function listAuditEvents(entityId?: string): CalendarAssignmentAuditEvent[] {
  return entityId ? auditEvents.filter((e) => e.entityId === entityId) : [...auditEvents];
}

export function appendAuditEvent(e: CalendarAssignmentAuditEvent): CalendarAssignmentAuditEvent {
  auditEvents = [e, ...auditEvents];
  return e;
}

export function seedAssignmentsFixtures(fixtures: {
  reviews?: import("./types").CalendarVolunteerReview[];
  offers?: import("./types").CalendarShiftOffer[];
  responses?: import("./types").CalendarShiftOfferResponse[];
  assignments?: import("./types").CalendarShiftAssignment[];
  waitlists?: import("./types").CalendarShiftWaitlistEntry[];
  cancellations?: import("./types").CalendarAssignmentCancellation[];
  replacementNeeds?: import("./types").CalendarReplacementNeed[];
}): void {
  if (fixtures.reviews) reviews = [...fixtures.reviews];
  if (fixtures.offers) offers = [...fixtures.offers];
  if (fixtures.responses) responses = [...fixtures.responses];
  if (fixtures.assignments) assignments = [...fixtures.assignments];
  if (fixtures.waitlists) waitlists = [...fixtures.waitlists];
  if (fixtures.cancellations) cancellations = [...fixtures.cancellations];
  if (fixtures.replacementNeeds) replacementNeeds = [...fixtures.replacementNeeds];
}

export function clearAssignmentsStoreForTest(): void {
  reviews = [];
  offers = [];
  responses = [];
  assignments = [];
  waitlists = [];
  cancellations = [];
  replacementNeeds = [];
  auditEvents = [];
}
