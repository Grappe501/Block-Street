export type CalendarVolunteerReview = {
  reviewId: string;
  interestId: string;
  eventId: string;
  shiftId?: string | null;
  requirementId?: string | null;
  volunteerUserId: string;
  reviewStatus:
    | "not_reviewed"
    | "in_review"
    | "eligible"
    | "eligible_with_conditions"
    | "not_eligible"
    | "needs_information"
    | "withdrawn";
  roleEligibility:
    | "unknown"
    | "eligible"
    | "missing_training"
    | "schedule_conflict"
    | "scope_restricted"
    | "capacity_full"
    | "not_selected";
  trainingStatus: "unknown" | "eligible" | "missing" | "expired" | "on_site_briefing_allowed";
  scheduleStatus: "unknown" | "clear" | "possible_conflict" | "hard_conflict";
  reviewerUserId?: string | null;
  reviewerRoleKey?: string | null;
  internalNotes?: string | null;
  volunteerSafeExplanation?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CalendarShiftOffer = {
  offerId: string;
  eventId: string;
  shiftId: string;
  requirementId: string;
  volunteerUserId: string;
  offeredRoleKey: string;
  offeredRoleLabel: string;
  offeredStartAt: string;
  offeredEndAt: string;
  offeredArrivalAt?: string | null;
  offerStatus:
    | "draft"
    | "ready"
    | "offered"
    | "viewed"
    | "accepted"
    | "declined"
    | "change_requested"
    | "expired"
    | "withdrawn"
    | "superseded";
  expiresAt?: string | null;
  trainingConditionKeys: string[];
  conditions: string[];
  volunteerInstructions?: string | null;
  managerNotes?: string | null;
  offeredByUserId?: string | null;
  offeredAt?: string | null;
  viewedAt?: string | null;
  respondedAt?: string | null;
  replacementForAssignmentId?: string | null;
  source: "interest_review" | "manager_invitation" | "waitlist" | "replacement" | "soft_beta_fixture";
  createdAt: string;
  updatedAt: string;
};

export type CalendarShiftOfferResponse = {
  responseId: string;
  offerId: string;
  volunteerUserId: string;
  response: "accepted" | "declined" | "change_requested";
  declineReasonKey?:
    | "schedule_conflict"
    | "transportation"
    | "training"
    | "health"
    | "family"
    | "no_longer_available"
    | "other"
    | null;
  requestedChanges?: {
    preferredStartAt?: string;
    preferredEndAt?: string;
    preferredRoleKey?: string;
    note?: string;
  } | null;
  volunteerNote?: string | null;
  respondedAt: string;
};

export type CalendarShiftAssignment = {
  assignmentId: string;
  eventId: string;
  shiftId: string;
  requirementId: string;
  volunteerUserId: string;
  roleKey: string;
  roleLabel: string;
  startAt: string;
  endAt: string;
  arrivalAt?: string | null;
  assignmentStatus:
    | "soft_beta_confirmed"
    | "confirmation_pending"
    | "confirmed"
    | "cancellation_requested"
    | "canceled_by_volunteer"
    | "canceled_by_manager"
    | "replaced"
    | "completed"
    | "no_show";
  sourceOfferId?: string | null;
  sourceInterestId?: string | null;
  trainingConditionKeys: string[];
  trainingConditionStatus: "not_required" | "pending" | "satisfied" | "waived" | "failed";
  isShiftLead: boolean;
  shiftLeadRole?: "primary_lead" | "co_lead" | "backup_lead" | null;
  confirmedByUserId?: string | null;
  confirmedAt?: string | null;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarShiftWaitlistEntry = {
  waitlistEntryId: string;
  eventId: string;
  shiftId: string;
  requirementId: string;
  volunteerUserId: string;
  waitlistStatus:
    | "active"
    | "offer_prepared"
    | "offered"
    | "accepted"
    | "declined"
    | "expired"
    | "withdrawn"
    | "removed"
    | "no_longer_needed";
  priorityGroup: "replacement" | "trained" | "lead_eligible" | "general" | "conditional";
  priorityScore?: number | null;
  priorityReasons: string[];
  trainingEligibility: "eligible" | "conditional" | "missing" | "expired" | "unknown";
  scheduleStatus: "clear" | "possible_conflict" | "hard_conflict" | "unknown";
  addedByUserId?: string | null;
  addedAt: string;
  updatedAt: string;
};

export type CalendarAssignmentCancellation = {
  cancellationId: string;
  assignmentId: string;
  eventId: string;
  shiftId: string;
  volunteerUserId: string;
  requestedBy: "volunteer" | "manager" | "system";
  cancellationStatus: "requested" | "approved" | "completed" | "denied" | "withdrawn";
  reasonKey:
    | "schedule_conflict"
    | "transportation"
    | "training_not_completed"
    | "event_change"
    | "role_change"
    | "health"
    | "family"
    | "manager_reassignment"
    | "event_canceled"
    | "other";
  volunteerSafeNote?: string | null;
  internalNote?: string | null;
  replacementRequired: boolean;
  replacementAssignmentId?: string | null;
  requestedAt: string;
  resolvedAt?: string | null;
  resolvedByUserId?: string | null;
};

export type CalendarReplacementNeed = {
  replacementNeedId: string;
  eventId: string;
  shiftId: string;
  requirementId: string;
  canceledAssignmentId?: string | null;
  roleKey: string;
  startAt: string;
  endAt: string;
  urgency: "watch" | "needs_attention" | "urgent" | "critical";
  status: "open" | "offer_prepared" | "offer_sent" | "filled" | "no_longer_needed" | "closed_unfilled";
  candidateWaitlistEntryIds: string[];
  candidateInterestIds: string[];
  createdAt: string;
  resolvedAt?: string | null;
};

export type CalendarPersonalScheduleItem = {
  itemId: string;
  sourceType: "assignment" | "offer" | "waitlist" | "interest" | "rsvp" | "lead";
  authorityLevel:
    | "durable_confirmed"
    | "soft_beta_confirmed"
    | "pending_response"
    | "waitlisted"
    | "interest_only"
    | "planning_only";
  eventId: string;
  shiftId?: string | null;
  title: string;
  roleLabel?: string | null;
  startAt: string;
  endAt: string;
  arrivalAt?: string | null;
  locationSummary?: string | null;
  statusLabel: string;
  actionRoute?: string | null;
  warnings: string[];
};

export type CalendarAssignmentAuditEvent = {
  auditEventId: string;
  entityType: "review" | "offer" | "assignment" | "waitlist" | "cancellation" | "replacement";
  entityId: string;
  eventId: string;
  shiftId?: string | null;
  volunteerUserId?: string | null;
  action: string;
  previousStatus?: string | null;
  nextStatus?: string | null;
  actorUserId?: string | null;
  actorRoleKey?: string | null;
  reason?: string | null;
  mode: "audit_only" | "enforced";
  persistenceMode: string;
  createdAt: string;
};

export type CreateAssignmentFromOfferResult = {
  success: boolean;
  assignment?: CalendarShiftAssignment;
  updatedOffer?: CalendarShiftOffer;
  coverageBefore?: import("../staffing/types").CalendarShiftCoverage;
  coverageAfter?: import("../staffing/types").CalendarShiftCoverage;
  conflictingOffersWithdrawn: string[];
  waitlistPromotionsTriggered: string[];
  warnings: string[];
  blockedReasons: string[];
};
