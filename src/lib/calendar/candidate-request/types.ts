export type CandidateItemCategory = "request" | "briefing" | "travel" | "communication" | "confirmation";

export type CandidateItemStatus =
  | "not_started"
  | "in_progress"
  | "ready"
  | "waived"
  | "not_applicable"
  | "blocked";

export type CandidateAttendanceSnapshot =
  | "not_requested"
  | "requested"
  | "under_review"
  | "hold_placed"
  | "tentatively_accepted"
  | "confirmed"
  | "declined"
  | "canceled"
  | "completed";

export type CalendarEventCandidateItem = {
  itemId: string;
  eventId: string;
  category: CandidateItemCategory;
  itemKey: string;
  label: string;
  required: boolean;
  itemStatus: CandidateItemStatus;
  attendanceSnapshot?: CandidateAttendanceSnapshot | null;
  dueAt?: string | null;
  readyAt?: string | null;
  blocksReadiness: boolean;
  generatedFromTemplate: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarCandidateSummary = {
  eventId: string;
  requestTotal: number;
  requestReady: number;
  briefingTotal: number;
  briefingReady: number;
  travelTotal: number;
  travelReady: number;
  communicationTotal: number;
  communicationReady: number;
  confirmationTotal: number;
  confirmationReady: number;
  attendanceSnapshot: CandidateAttendanceSnapshot;
  incompleteRequired: number;
  overdueCount: number;
  readinessImpact: "none" | "watch" | "blocked";
  primaryGap?: string | null;
};

export type CalendarCandidateAuditEvent = {
  auditEventId: string;
  entityType: "candidate_request";
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
