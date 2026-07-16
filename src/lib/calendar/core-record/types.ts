export type CoreRecordCategory = "ownership" | "schedule" | "venue";

export type CoreRecordItemStatus =
  | "not_started"
  | "in_progress"
  | "ready"
  | "waived"
  | "not_applicable"
  | "blocked";

export type CalendarEventCoreRecordItem = {
  itemId: string;
  eventId: string;
  category: CoreRecordCategory;
  itemKey: string;
  label: string;
  required: boolean;
  itemStatus: CoreRecordItemStatus;
  fieldSnapshot?: string | null;
  dueAt?: string | null;
  readyAt?: string | null;
  blocksReadiness: boolean;
  generatedFromEvent: boolean;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarCoreRecordSummary = {
  eventId: string;
  ownershipTotal: number;
  ownershipReady: number;
  scheduleTotal: number;
  scheduleReady: number;
  venueTotal: number;
  venueReady: number;
  incompleteRequired: number;
  overdueCount: number;
  readinessImpact: "none" | "watch" | "blocked";
  primaryGap?: string | null;
};

export type CalendarCoreRecordAuditEvent = {
  auditEventId: string;
  entityType: "core_record";
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
