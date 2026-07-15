export type CalendarEventTaskStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "complete"
  | "waived"
  | "not_applicable";

export type CalendarEventTask = {
  taskId: string;
  eventId: string;
  taskKey: string;
  title: string;
  required: boolean;
  taskStatus: CalendarEventTaskStatus;
  ownerUserId?: string | null;
  ownerRoleKey?: string | null;
  dueAt?: string | null;
  completedAt?: string | null;
  evidenceNote?: string | null;
  blocksReadiness: boolean;
  generatedFromTemplate: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  softBeta: boolean;
  durableAuthority: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarEventTaskDependencyType = "blocks_start" | "blocks_complete" | "blocks_readiness";

export type CalendarEventTaskDependency = {
  dependencyId: string;
  eventId: string;
  fromTaskId: string;
  toTaskId: string;
  dependencyType: CalendarEventTaskDependencyType;
  waiverAllowed: boolean;
  createdAt: string;
};

export type CalendarTaskChecklistSummary = {
  eventId: string;
  totalTasks: number;
  requiredCount: number;
  completeCount: number;
  incompleteRequiredCount: number;
  blockedCount: number;
  overdueCount: number;
  waivedCount: number;
  readinessImpact: "none" | "watch" | "blocked";
  primaryBlocker?: string | null;
};

export type CalendarTaskAuditEvent = {
  auditEventId: string;
  entityType: "task" | "dependency";
  entityId: string;
  eventId: string;
  action: string;
  previousStatus?: string | null;
  nextStatus?: string | null;
  actorUserId?: string | null;
  reason?: string | null;
  mode: "audit_only" | "enforced";
  persistenceMode: string;
  createdAt: string;
};
