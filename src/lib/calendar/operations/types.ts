export type EventReadinessState =
  | "not_required"
  | "not_started"
  | "in_progress"
  | "blocked"
  | "ready"
  | "complete";

export type EventAttentionSeverity =
  | "none"
  | "watch"
  | "needs_attention"
  | "urgent"
  | "critical";

export type EventReadinessDimension =
  | "ownership"
  | "approval"
  | "date_time"
  | "venue"
  | "candidate"
  | "staffing"
  | "tasks"
  | "materials"
  | "promotion"
  | "rsvp"
  | "verification"
  | "follow_up";

export type EventReadinessItem = {
  dimension: EventReadinessDimension;
  state: EventReadinessState;
  label: string;
  explanation: string;
  blocker?: string | null;
  route?: string | null;
};

export type EventOperationsSummary = {
  eventId: string;
  title: string;
  startAt: string;
  endAt: string;
  scopeLabels: string[];
  ownerLabel: string | null;
  eventType: string;
  operationalStatus: string;
  approvalStatus: string;
  candidateAttendanceStatus: string;
  publicationStatus: string;
  staffingStatus: string;
  readiness: EventReadinessItem[];
  overallReadiness: EventReadinessState;
  readinessRatio: { completed: number; required: number } | null;
  attentionSeverity: EventAttentionSeverity;
  attentionReasons: string[];
  attentionKeys: string[];
  primaryNextAction: {
    label: string;
    route: string;
  } | null;
  isToday: boolean;
  isWithin48Hours: boolean;
  isPast: boolean;
  hasConflict: boolean;
  kellyRequested: boolean;
};

export type EventOperationsScope =
  | { kind: "command" }
  | { kind: "college"; collegeSlug: string }
  | { kind: "county"; countySlug: string }
  | { kind: "campaign" };

export const READINESS_DIMENSIONS: EventReadinessDimension[] = [
  "ownership",
  "approval",
  "date_time",
  "venue",
  "candidate",
  "staffing",
  "tasks",
  "materials",
  "promotion",
  "rsvp",
  "verification",
  "follow_up",
];

export const ATTENTION_KEYS = [
  "event_today",
  "event_within_48_hours",
  "missing_owner",
  "missing_date",
  "missing_location",
  "approval_pending",
  "approval_blocked",
  "candidate_request_pending",
  "candidate_conflict",
  "critical_staffing_gap",
  "no_staffing_plan",
  "unresolved_conflict",
  "publication_not_ready",
  "missing_promotion",
  "missing_verification",
  "report_overdue",
  "follow_up_overdue",
] as const;

export type AttentionKey = (typeof ATTENTION_KEYS)[number];
