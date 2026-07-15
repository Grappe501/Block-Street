export type FollowUpItemCategory = "metric" | "action";

export type FollowUpItemStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "waived"
  | "not_applicable";

export type FollowUpMetricType = "count" | "boolean" | "text";

export type CalendarEventFollowUpItem = {
  itemId: string;
  eventId: string;
  category: FollowUpItemCategory;
  itemKey: string;
  label: string;
  required: boolean;
  metricType?: FollowUpMetricType | null;
  itemStatus: FollowUpItemStatus;
  valueText?: string | null;
  valueCount?: number | null;
  valueBoolean?: boolean | null;
  dueAt?: string | null;
  submittedAt?: string | null;
  ownerRoleKey?: string | null;
  blocksReadiness: boolean;
  generatedFromTemplate: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarFollowUpSummary = {
  eventId: string;
  metricsTotal: number;
  metricsSubmitted: number;
  actionsTotal: number;
  actionsSubmitted: number;
  incompleteRequired: number;
  overdueCount: number;
  readinessImpact: "none" | "watch" | "blocked";
  reportDueAt?: string | null;
  primaryGap?: string | null;
};

export type CalendarFollowUpAuditEvent = {
  auditEventId: string;
  entityType: "followup";
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
