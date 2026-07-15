export type RsvpItemCategory = "plan" | "operations";

export type RsvpItemStatus =
  | "not_started"
  | "in_progress"
  | "ready"
  | "waived"
  | "not_applicable";

export type RsvpResponseStatus =
  | "interested"
  | "yes"
  | "no"
  | "maybe"
  | "waitlisted"
  | "canceled";

export type CalendarEventRsvpItem = {
  itemId: string;
  eventId: string;
  category: RsvpItemCategory;
  itemKey: string;
  label: string;
  required: boolean;
  itemStatus: RsvpItemStatus;
  targetHeadcount?: number | null;
  dueAt?: string | null;
  blocksReadiness: boolean;
  generatedFromTemplate: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarEventRsvpResponse = {
  responseId: string;
  eventId: string;
  attendeeLabel: string;
  responseStatus: RsvpResponseStatus;
  partySize: number;
  notes?: string | null;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarRsvpSummary = {
  eventId: string;
  planTotal: number;
  planReady: number;
  operationsTotal: number;
  operationsReady: number;
  responseCount: number;
  yesCount: number;
  maybeCount: number;
  headcountEstimate: number;
  targetHeadcount?: number | null;
  incompleteRequired: number;
  overdueCount: number;
  readinessImpact: "none" | "watch" | "blocked";
  primaryGap?: string | null;
};

export type CalendarRsvpAuditEvent = {
  auditEventId: string;
  entityType: "rsvp";
  entityId: string;
  eventId: string;
  action: string;
  previousStatus?: string | null;
  nextStatus?: string | null;
  actorUserId?: string | null;
  mode: "audit_only" | "enforced";
  persistenceMode: string;
  createdAt: string;
};
