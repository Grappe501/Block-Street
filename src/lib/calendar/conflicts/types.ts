import type { ConflictState } from "../types";

export type ConflictKind = "schedule_overlap" | "kelly_travel" | "candidate_schedule" | "resource_overlap";

export type ConflictResolutionStatus = "open" | "under_review" | "resolved" | "override_approved" | "wont_fix";

export type ConflictItemCategory = "detection" | "review" | "communication" | "resolution";

export type ConflictItemStatus =
  | "not_started"
  | "in_progress"
  | "ready"
  | "waived"
  | "not_applicable"
  | "blocked";

export type CalendarConflictRecord = {
  conflictId: string;
  eventIds: string[];
  kind: ConflictKind;
  summary: string;
  severity: "low" | "medium" | "high";
  state: ConflictState;
  resolutionStatus: ConflictResolutionStatus;
  detectedAt: string;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
  humanIds?: string[];
  resourceIds?: string[];
  resolvedAt?: string | null;
  resolvedByUserId?: string | null;
  resolutionNote?: string | null;
  overrideReason?: string | null;
};

export type CalendarConflictResolutionItem = {
  itemId: string;
  conflictId: string;
  eventId: string;
  category: ConflictItemCategory;
  itemKey: string;
  label: string;
  required: boolean;
  itemStatus: ConflictItemStatus;
  blocksResolution: boolean;
  generatedFromSeed: boolean;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarConflictSummary = {
  conflictId: string;
  eventIds: string[];
  kind: ConflictKind;
  state: ConflictState;
  resolutionStatus: ConflictResolutionStatus;
  reviewTotal: number;
  reviewReady: number;
  communicationTotal: number;
  communicationReady: number;
  resolutionTotal: number;
  resolutionReady: number;
  incompleteRequired: number;
  readinessImpact: "none" | "watch" | "blocked";
  primaryGap?: string | null;
};

export type CalendarConflictAuditEvent = {
  auditEventId: string;
  entityType: "conflict";
  entityId: string;
  eventId?: string | null;
  action: string;
  previousStatus?: string | null;
  nextStatus?: string | null;
  actorUserId?: string | null;
  mode: "audit_only" | "enforced";
  persistenceMode: string;
  createdAt: string;
};
