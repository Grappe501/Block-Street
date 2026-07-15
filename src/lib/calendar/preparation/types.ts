export type PreparationCategory = "logistics" | "materials" | "promotion" | "reminder";

export type PreparationItemStatus =
  | "not_started"
  | "in_progress"
  | "ready"
  | "waived"
  | "not_applicable"
  | "blocked";

export type PreparationCommunicationState =
  | "not_prepared"
  | "draft"
  | "ready_for_manual_send"
  | "sent_manually"
  | "provider_confirmed"
  | "canceled";

export type CalendarEventPreparationItem = {
  itemId: string;
  eventId: string;
  category: PreparationCategory;
  itemKey: string;
  label: string;
  required: boolean;
  itemStatus: PreparationItemStatus;
  ownerUserId?: string | null;
  ownerRoleKey?: string | null;
  dueAt?: string | null;
  readyAt?: string | null;
  blocksReadiness: boolean;
  readinessDimension?: "materials" | "promotion" | null;
  reminderOffsetHours?: number | null;
  scheduledAt?: string | null;
  communicationState: PreparationCommunicationState;
  notes?: string | null;
  generatedFromTemplate: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarPreparationSummary = {
  eventId: string;
  logisticsTotal: number;
  logisticsReady: number;
  materialsTotal: number;
  materialsReady: number;
  promotionTotal: number;
  promotionReady: number;
  remindersTotal: number;
  remindersReady: number;
  incompleteRequired: number;
  overdueCount: number;
  readinessImpact: "none" | "watch" | "blocked";
  primaryGap?: string | null;
};

export type CalendarPreparationAuditEvent = {
  auditEventId: string;
  entityType: "preparation";
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
