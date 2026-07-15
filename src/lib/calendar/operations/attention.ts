import type { CalendarEvent } from "../types";
import type { AttentionKey, EventAttentionSeverity, EventReadinessItem } from "./types";

export type AttentionSignal = {
  key: AttentionKey;
  severity: EventAttentionSeverity;
  reason: string;
};

const SEVERITY_RANK: Record<EventAttentionSeverity, number> = {
  none: 0,
  watch: 1,
  needs_attention: 2,
  urgent: 3,
  critical: 4,
};

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function hoursUntil(startAt: string, now: Date): number {
  return (new Date(startAt).getTime() - now.getTime()) / 36e5;
}

export function evaluateEventAttention(
  event: CalendarEvent,
  readiness: EventReadinessItem[],
  now: Date = new Date(),
): AttentionSignal[] {
  const signals: AttentionSignal[] = [];
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  const h = hoursUntil(event.start_at, now);
  const today = isSameDay(start, now);
  const within48 = h >= 0 && h <= 48;
  const past = end < now;
  const ownerMissing = !event.owned_by_team && !event.primary_contact;

  if (today && event.operational_status !== "completed" && event.operational_status !== "canceled") {
    const blocked = readiness.some((r) => r.state === "blocked");
    signals.push({
      key: "event_today",
      severity: blocked ? "critical" : "watch",
      reason: blocked ? "Event is today and has blocked readiness dimensions." : "Event is happening today.",
    });
  }

  if (within48 && !today) {
    const majorGaps = readiness.filter((r) => r.state === "blocked" || r.state === "not_started").length >= 2;
    if (majorGaps) {
      signals.push({
        key: "event_within_48_hours",
        severity: "urgent",
        reason: "Event within 48 hours with major readiness gaps.",
      });
    } else {
      signals.push({
        key: "event_within_48_hours",
        severity: "watch",
        reason: "Event within 48 hours — monitor readiness.",
      });
    }
  }

  if (ownerMissing) {
    const severity: EventAttentionSeverity = within48 || today ? "critical" : "needs_attention";
    signals.push({
      key: "missing_owner",
      severity,
      reason: "No operational owner or owning team assigned.",
    });
  }

  const dateDim = readiness.find((r) => r.dimension === "date_time");
  if (dateDim?.state === "blocked") {
    signals.push({
      key: "missing_date",
      severity: "urgent",
      reason: "Event schedule is incomplete or invalid.",
    });
  }

  const venueDim = readiness.find((r) => r.dimension === "venue");
  if (venueDim?.state === "blocked") {
    signals.push({
      key: "missing_location",
      severity: "urgent",
      reason: "Venue or location is missing.",
    });
  } else if (venueDim?.state === "not_started" && within48) {
    signals.push({
      key: "missing_location",
      severity: "needs_attention",
      reason: "Venue still marked TBD near event date.",
    });
  }

  const approval = event.approval_status;
  if (approval === "submitted" || approval === "under_review" || approval === "pending" || approval === "revision_requested") {
    signals.push({
      key: "approval_pending",
      severity: within48 ? "urgent" : "needs_attention",
      reason: `Calendar approval pending (${approval}).`,
    });
  }
  if (approval === "rejected" || approval === "approval_withdrawn") {
    signals.push({
      key: "approval_blocked",
      severity: "urgent",
      reason: `Calendar approval blocked (${approval}).`,
    });
  }

  if (event.kelly_requested) {
    const kStatus = event.kelly_attendance_status;
    if (kStatus === "requested" || kStatus === "under_review" || kStatus === "hold_placed") {
      signals.push({
        key: "candidate_request_pending",
        severity: within48 ? "urgent" : "needs_attention",
        reason: `Kelly request unresolved (${kStatus ?? "requested"}). Request ≠ confirmation.`,
      });
    }
    if (
      kStatus === "confirmed" &&
      (event.conflict_state === "hard_conflict" || event.conflict_state === "likely_conflict")
    ) {
      signals.push({
        key: "candidate_conflict",
        severity: "critical",
        reason: "Kelly confirmed but a hard scheduling conflict remains.",
      });
    }
    if (kStatus === "hold_placed" || kStatus === "tentatively_accepted") {
      signals.push({
        key: "candidate_request_pending",
        severity: "watch",
        reason: `Kelly hold/tentative state (${kStatus}).`,
      });
    }
  }

  if (event.staffing_status === "critical_shortage") {
    signals.push({
      key: "critical_staffing_gap",
      severity: today || within48 ? "critical" : "urgent",
      reason: "Critical volunteer staffing shortage.",
    });
  } else if (event.staffing_status === "needs_volunteers" && event.volunteer_slots_open > 0) {
    signals.push({
      key: "critical_staffing_gap",
      severity: "needs_attention",
      reason: `${event.volunteer_slots_open} open volunteer slot(s). Interest ≠ assignment.`,
    });
  }

  if (event.staffing_status === "no_staffing_plan" && event.volunteers_needed > 0) {
    signals.push({
      key: "no_staffing_plan",
      severity: "needs_attention",
      reason: "Volunteers needed but no staffing plan on record.",
    });
  }

  if (
    event.conflict_state !== "no_conflict" &&
    event.conflict_state !== "override_approved" &&
    event.conflict_ids.length > 0
  ) {
    signals.push({
      key: "unresolved_conflict",
      severity: event.conflict_state === "hard_conflict" ? "critical" : "needs_attention",
      reason: `Scheduling conflict: ${event.conflict_state.replace(/_/g, " ")}.`,
    });
  }

  if (
    (event.publication_status === "published" || event.visibility === "public") &&
    event.publication_status !== "published" &&
    event.publication_status !== "ready_to_publish"
  ) {
    signals.push({
      key: "publication_not_ready",
      severity: "needs_attention",
      reason: "Public visibility without publication-ready status.",
    });
  }

  const promo = readiness.find((r) => r.dimension === "promotion");
  if (promo?.state === "not_started" && within48 && event.visibility === "public") {
    signals.push({
      key: "missing_promotion",
      severity: "needs_attention",
      reason: "Public event approaching without promotion prep.",
    });
  }

  const verify = readiness.find((r) => r.dimension === "verification");
  if (verify?.state === "not_started" && event.visibility === "public" && within48) {
    signals.push({
      key: "missing_verification",
      severity: event.publication_status === "published" ? "critical" : "urgent",
      reason: "Public event missing venue/legal verification (separate from calendar approval).",
    });
  }

  if (past && event.operational_status === "completed") {
    const followUp = readiness.find((r) => r.dimension === "follow_up");
    if (followUp?.state === "blocked") {
      signals.push({
        key: "report_overdue",
        severity: "needs_attention",
        reason: "Completed event — post-event report missing.",
      });
    }
  }

  if (past && event.operational_status !== "completed" && event.operational_status !== "canceled") {
    signals.push({
      key: "follow_up_overdue",
      severity: "needs_attention",
      reason: "Event date passed — outcome capture or status update may be overdue.",
    });
  }

  return signals;
}

export function aggregateAttentionSeverity(signals: AttentionSignal[]): EventAttentionSeverity {
  if (signals.length === 0) return "none";
  return signals.reduce<EventAttentionSeverity>(
    (max, s) => (SEVERITY_RANK[s.severity] > SEVERITY_RANK[max] ? s.severity : max),
    "none",
  );
}

export const ATTENTION_SEVERITY_LABELS: Record<EventAttentionSeverity, string> = {
  none: "No attention needed",
  watch: "Watch",
  needs_attention: "Needs attention",
  urgent: "Urgent",
  critical: "Critical",
};
