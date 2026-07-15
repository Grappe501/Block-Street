export type VerificationCategory = "venue" | "campus" | "legal" | "accessibility";

export type VerificationItemStatus =
  | "not_started"
  | "in_progress"
  | "verified"
  | "waived"
  | "not_applicable"
  | "blocked";

export type CalendarEventVerificationItem = {
  itemId: string;
  eventId: string;
  category: VerificationCategory;
  itemKey: string;
  label: string;
  required: boolean;
  itemStatus: VerificationItemStatus;
  ownerRoleKey?: string | null;
  dueAt?: string | null;
  verifiedAt?: string | null;
  blocksReadiness: boolean;
  notes?: string | null;
  generatedFromTemplate: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarVerificationSummary = {
  eventId: string;
  venueTotal: number;
  venueVerified: number;
  campusTotal: number;
  campusVerified: number;
  legalTotal: number;
  legalVerified: number;
  accessibilityTotal: number;
  accessibilityVerified: number;
  incompleteRequired: number;
  overdueCount: number;
  readinessImpact: "none" | "watch" | "blocked";
  primaryGap?: string | null;
};

export type CalendarVerificationAuditEvent = {
  auditEventId: string;
  entityType: "verification";
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
