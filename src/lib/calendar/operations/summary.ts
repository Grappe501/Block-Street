import { listEventsForScope } from "../events";
import type { CalendarEvent, CalendarScope } from "../types";
import { aggregateAttentionSeverity, evaluateEventAttention } from "./attention";
import { aggregateOverallReadiness, evaluateEventReadiness, readinessRatio } from "./readiness";
import type {
  EventAttentionSeverity,
  EventOperationsScope,
  EventOperationsSummary,
  EventReadinessItem,
} from "./types";

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function scopeLabels(event: CalendarEvent): string[] {
  const labels: string[] = [];
  if (event.campaign_wide || event.scope === "statewide") labels.push("Campaign");
  for (const slug of event.college_slugs) labels.push(`College: ${slug}`);
  for (const slug of event.county_slugs) labels.push(`County: ${slug}`);
  if (event.city) labels.push(event.city);
  return labels.length ? labels : ["Command"];
}

function ownerLabel(event: CalendarEvent): string | null {
  return event.owned_by_team ?? event.primary_contact ?? null;
}

function derivePrimaryNextAction(
  event: CalendarEvent,
  readiness: EventReadinessItem[],
  severity: EventAttentionSeverity,
): { label: string; route: string } | null {
  const blocked = readiness.find((r) => r.state === "blocked" && r.route);
  if (blocked?.route) {
    return { label: blocked.blocker ?? blocked.explanation, route: blocked.route };
  }
  if (severity === "critical" || severity === "urgent") {
    const pending = readiness.find((r) => r.state === "in_progress" && r.route);
    if (pending?.route) return { label: pending.explanation, route: pending.route };
  }
  const approval = readiness.find((r) => r.dimension === "approval" && r.state === "in_progress");
  if (approval?.route) return { label: "Review calendar approval", route: approval.route };
  const staffing = readiness.find((r) => r.dimension === "staffing" && r.state === "in_progress");
  if (staffing?.route) return { label: "Review volunteer staffing gaps", route: staffing.route };
  return { label: "Open event overview", route: `/calendar/event/${event.event_id}` };
}

export function buildEventOperationsSummary(event: CalendarEvent, now: Date = new Date()): EventOperationsSummary {
  const readiness = evaluateEventReadiness(event, now);
  const signals = evaluateEventAttention(event, readiness, now);
  const attentionSeverity = aggregateAttentionSeverity(signals);
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);

  return {
    eventId: event.event_id,
    title: event.title,
    startAt: event.start_at,
    endAt: event.end_at,
    scopeLabels: scopeLabels(event),
    ownerLabel: ownerLabel(event),
    eventType: event.event_type,
    operationalStatus: event.operational_status,
    approvalStatus: String(event.approval_status ?? "not_submitted"),
    candidateAttendanceStatus: String(event.kelly_attendance_status ?? "not_requested"),
    publicationStatus: event.publication_status,
    staffingStatus: event.staffing_status,
    readiness,
    overallReadiness: aggregateOverallReadiness(readiness, event, now),
    readinessRatio: readinessRatio(readiness),
    attentionSeverity,
    attentionReasons: signals.map((s) => s.reason),
    attentionKeys: signals.map((s) => s.key),
    primaryNextAction: derivePrimaryNextAction(event, readiness, attentionSeverity),
    isToday: isSameDay(start, now),
    isWithin48Hours: (start.getTime() - now.getTime()) / 36e5 >= 0 && (start.getTime() - now.getTime()) / 36e5 <= 48,
    isPast: end < now,
    hasConflict: event.conflict_state !== "no_conflict" && event.conflict_state !== "override_approved",
    kellyRequested: event.kelly_requested,
  };
}

export function scopeToCalendarScope(scope: EventOperationsScope): CalendarScope {
  if (scope.kind === "command") return { kind: "command" };
  if (scope.kind === "college") return { kind: "college", collegeSlug: scope.collegeSlug };
  if (scope.kind === "county") return { kind: "county", countySlug: scope.countySlug };
  return { kind: "command" };
}

export function listEventOperationsSummaries(
  scope: EventOperationsScope = { kind: "command" },
  now: Date = new Date(),
): EventOperationsSummary[] {
  const calScope = scopeToCalendarScope(scope);
  let events = listEventsForScope(calScope);
  if (scope.kind === "campaign") {
    events = listEventsForScope({ kind: "command" }).filter((e) => e.campaign_wide || e.scope === "statewide");
  }
  return events
    .map((e) => buildEventOperationsSummary(e, now))
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

const SEVERITY_ORDER: Record<EventAttentionSeverity, number> = {
  critical: 0,
  urgent: 1,
  needs_attention: 2,
  watch: 3,
  none: 4,
};

export function sortByAttention(summaries: EventOperationsSummary[]): EventOperationsSummary[] {
  return [...summaries].sort((a, b) => {
    const sa = SEVERITY_ORDER[a.attentionSeverity];
    const sb = SEVERITY_ORDER[b.attentionSeverity];
    if (sa !== sb) return sa - sb;
    return a.startAt.localeCompare(b.startAt);
  });
}

export function filterToday(summaries: EventOperationsSummary[]): EventOperationsSummary[] {
  return summaries.filter((s) => s.isToday);
}

export function filterUpcoming(summaries: EventOperationsSummary[]): {
  next7: EventOperationsSummary[];
  next30: EventOperationsSummary[];
  later: EventOperationsSummary[];
} {
  const now = Date.now();
  const d7 = now + 7 * 864e5;
  const d30 = now + 30 * 864e5;
  const next7: EventOperationsSummary[] = [];
  const next30: EventOperationsSummary[] = [];
  const later: EventOperationsSummary[] = [];
  for (const s of summaries) {
    const t = new Date(s.startAt).getTime();
    if (t < now) continue;
    if (t <= d7) next7.push(s);
    else if (t <= d30) next30.push(s);
    else later.push(s);
  }
  return { next7, next30, later };
}

export function filterNeedsAttention(summaries: EventOperationsSummary[]): EventOperationsSummary[] {
  return summaries.filter((s) => s.attentionSeverity !== "none");
}

export function filterAtRisk(summaries: EventOperationsSummary[]): EventOperationsSummary[] {
  return summaries.filter(
    (s) =>
      s.attentionSeverity === "critical" ||
      s.attentionSeverity === "urgent" ||
      s.overallReadiness === "blocked",
  );
}

export function filterUnowned(summaries: EventOperationsSummary[]): EventOperationsSummary[] {
  return summaries.filter((s) => !s.ownerLabel);
}

export function filterReportsDue(summaries: EventOperationsSummary[]): EventOperationsSummary[] {
  return summaries.filter(
    (s) =>
      s.attentionKeys.includes("report_overdue") ||
      s.attentionKeys.includes("follow_up_overdue") ||
      (s.isPast && s.operationalStatus !== "completed" && s.operationalStatus !== "canceled"),
  );
}

export function countSummaryMetrics(summaries: EventOperationsSummary[]) {
  const { next7 } = filterUpcoming(summaries);
  return {
    today: filterToday(summaries).length,
    thisWeek: next7.length,
    needsAttention: filterNeedsAttention(summaries).length,
    criticalStaffing: summaries.filter((s) => s.attentionKeys.includes("critical_staffing_gap")).length,
    pendingApprovals: summaries.filter((s) => s.attentionKeys.includes("approval_pending")).length,
    kellyRequests: summaries.filter((s) => s.kellyRequested).length,
    conflicts: summaries.filter((s) => s.hasConflict).length,
    reportsDue: filterReportsDue(summaries).length,
  };
}

export function getReadinessDimensionState(
  summary: EventOperationsSummary,
  dimension: string,
): string {
  const item = summary.readiness.find((r) => r.dimension === dimension);
  return item?.state ?? "not_started";
}
