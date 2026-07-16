import type { ApprovalStatus, OperationalStatus } from "../types";

export type LifecycleItemCategory = "approval" | "operational" | "publication";

export type LifecycleItemStatus =
  | "not_started"
  | "in_progress"
  | "ready"
  | "waived"
  | "not_applicable"
  | "blocked";

export type StatusHistoryCategory = "operational" | "approval" | "publication" | "note";

export type CalendarEventLifecycleItem = {
  itemId: string;
  eventId: string;
  category: LifecycleItemCategory;
  itemKey: string;
  label: string;
  required: boolean;
  itemStatus: LifecycleItemStatus;
  approvalSnapshot?: ApprovalStatus | null;
  operationalSnapshot?: OperationalStatus | null;
  dueAt?: string | null;
  readyAt?: string | null;
  blocksReadiness: boolean;
  generatedFromEvent: boolean;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarStatusHistoryEntry = {
  historyId: string;
  eventId: string;
  category: StatusHistoryCategory;
  fromStatus?: string | null;
  toStatus?: string | null;
  actor?: string | null;
  role?: string | null;
  note: string;
  recordedAt: string;
  softBeta: boolean;
  durableAuthority: boolean;
};

export type CalendarLifecycleSummary = {
  eventId: string;
  operationalStatus: OperationalStatus;
  approvalStatus: ApprovalStatus;
  approvalTotal: number;
  approvalReady: number;
  operationalTotal: number;
  operationalReady: number;
  publicationTotal: number;
  publicationReady: number;
  historyCount: number;
  lastTransitionAt?: string | null;
  incompleteRequired: number;
  overdueCount: number;
  readinessImpact: "none" | "watch" | "blocked";
  primaryGap?: string | null;
  suggestedTransitions: string[];
};

export type CalendarLifecycleAuditEvent = {
  auditEventId: string;
  entityType: "lifecycle";
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
