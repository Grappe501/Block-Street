import type { CalendarEvent } from "../types";
import { calculateEventStaffingSummary } from "../staffing/coverage";
import { listAssignments, listOffers, listReviews } from "../assignments/store";
import { listOpenReplacementNeeds } from "../assignments/replacements";
import { buildTaskChecklistSummary, listTasks } from "../tasks";
import { isTaskComplete } from "../tasks/status";
import { buildPreparationSummary, listPreparationItems } from "../preparation";
import { isPreparationReady } from "../preparation/status";
import { buildFollowUpSummary, ensureFollowUpFromEvent } from "../followup";
import { isFollowUpDue } from "../followup/template-integration";
import { buildRsvpSummary, ensureRsvpFromEvent } from "../rsvp";
import { buildVerificationSummary, ensureVerificationFromEvent } from "../verification";
import { buildLifecycleSummary, ensureLifecycleFromEvent } from "../lifecycle";
import type { AttentionKey, EventAttentionSeverity, EventReadinessItem } from "./types";
import { ATTENTION_KEYS } from "./types";

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

function isPublicFacing(event: CalendarEvent): boolean {
  return event.visibility === "public" || event.publication_status === "published" || event.publication_status === "ready_to_publish";
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

  ensureLifecycleFromEvent(event);
  const lifecycle = buildLifecycleSummary(event.event_id, event.operational_status, event.approval_status);
  if (
    ["proposed", "tentative", "draft"].includes(event.operational_status) &&
    h <= 168 &&
    h >= 0
  ) {
    signals.push({
      key: "lifecycle_stalled",
      severity: within48 ? "urgent" : "needs_attention",
      reason: `Operational status still ${event.operational_status.replace(/_/g, " ")} within a week of event.`,
    });
  }
  if (past && event.operational_status !== "completed" && event.operational_status !== "canceled") {
    signals.push({
      key: "completion_pending",
      severity: "needs_attention",
      reason: "Event ended — mark completed or capture outcome.",
    });
  }
  if (lifecycle.incompleteRequired > 0 && lifecycle.readinessImpact === "blocked" && !signals.some((s) => s.key === "approval_pending")) {
    signals.push({
      key: "approval_pending",
      severity: "urgent",
      reason: lifecycle.primaryGap ?? "Lifecycle approval checklist blocked.",
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

  const staffingSummary = calculateEventStaffingSummary(event.event_id);
  for (const reason of staffingSummary.attentionReasons) {
    const key = reason as AttentionKey;
    if (!ATTENTION_KEYS.includes(key)) continue;
    let severity: EventAttentionSeverity = "needs_attention";
    if (key === "critical_staffing_gap") severity = today || within48 ? "critical" : "urgent";
    if (key === "missing_shift_lead") severity = within48 ? "urgent" : "needs_attention";
    if (key === "volunteer_training_gap") severity = "urgent";
    if (key === "unreviewed_volunteer_interest") severity = "watch";
    signals.push({ key, severity, reason: reason.replace(/_/g, " ") });
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
  if (verify?.state === "blocked" || verify?.state === "not_started") {
    ensureVerificationFromEvent(event);
    const vSummary = buildVerificationSummary(event.event_id);
    if (vSummary.incompleteRequired > 0 && (within48 || event.visibility === "public")) {
      signals.push({
        key: "missing_verification",
        severity: event.publication_status === "published" ? "critical" : "urgent",
        reason: "Public event missing venue/legal verification (separate from calendar approval).",
      });
      if (vSummary.overdueCount > 0) {
        signals.push({ key: "verification_overdue", severity: "urgent", reason: `${vSummary.overdueCount} verification item(s) overdue.` });
      } else {
        signals.push({ key: "verification_incomplete", severity: "needs_attention", reason: `${vSummary.incompleteRequired} verification item(s) incomplete.` });
      }
    }
  }

  const rsvp = readiness.find((r) => r.dimension === "rsvp");
  if (rsvp?.state === "blocked" || rsvp?.state === "in_progress") {
    ensureRsvpFromEvent(event);
    const rSummary = buildRsvpSummary(event.event_id);
    if (rSummary.incompleteRequired > 0 && within48) {
      signals.push({ key: "rsvp_open_needed", severity: "needs_attention", reason: "RSVP checklist incomplete near event." });
    }
    if (
      rSummary.targetHeadcount != null &&
      rSummary.headcountEstimate < rSummary.targetHeadcount * 0.5 &&
      within48
    ) {
      signals.push({ key: "rsvp_below_target", severity: "watch", reason: "RSVP headcount below half of target." });
    }
  }

  if (isFollowUpDue(event, now)) {
    ensureFollowUpFromEvent(event);
    const followUpSummary = buildFollowUpSummary(event.event_id);
    const followUp = readiness.find((r) => r.dimension === "follow_up");
    if (followUp?.state === "blocked") {
      signals.push({
        key: "report_overdue",
        severity: followUpSummary.overdueCount > 0 ? "urgent" : "needs_attention",
        reason: "Completed or past event — post-event report missing.",
      });
    }
    if (followUpSummary.incompleteRequired > 0) {
      signals.push({
        key: "report_incomplete",
        severity: followUpSummary.overdueCount > 0 ? "urgent" : "needs_attention",
        reason: `${followUpSummary.incompleteRequired} required report item(s) incomplete.`,
      });
    }
    if (followUpSummary.actionsTotal > followUpSummary.actionsSubmitted) {
      signals.push({
        key: "follow_up_action_due",
        severity: followUpSummary.overdueCount > 0 ? "urgent" : "watch",
        reason: "Follow-up actions pending after event.",
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

  const offers = listOffers({ eventId: event.event_id });
  const expiring = offers.filter(
    (o) => o.expiresAt && new Date(o.expiresAt).getTime() - now.getTime() < 86400000 && ["offered", "viewed"].includes(o.offerStatus),
  );
  if (expiring.length > 0) {
    signals.push({ key: "offer_expiring", severity: within48 ? "urgent" : "needs_attention", reason: "Shift offer expiring within 24 hours." });
  }
  if (offers.some((o) => o.offerStatus === "ready")) {
    signals.push({ key: "offer_ready_not_sent", severity: "watch", reason: "Offer prepared but not sent." });
  }
  if (offers.some((o) => o.offerStatus === "declined")) {
    signals.push({ key: "offer_declined", severity: "needs_attention", reason: "Volunteer declined a shift offer." });
  }
  if (offers.some((o) => o.offerStatus === "change_requested")) {
    signals.push({ key: "offer_change_requested", severity: "needs_attention", reason: "Volunteer requested offer changes." });
  }
  const criticalRep = listOpenReplacementNeeds({ eventId: event.event_id }).filter((n) => n.urgency === "critical");
  if (criticalRep.length > 0) {
    signals.push({ key: "critical_replacement_needed", severity: "critical", reason: "Critical replacement need unfilled." });
  }
  const openRep = listOpenReplacementNeeds({ eventId: event.event_id });
  if (openRep.length > 0 && criticalRep.length === 0) {
    signals.push({ key: "replacement_needed", severity: "needs_attention", reason: "Open replacement need." });
  }
  const unreviewedCritical = listReviews({ eventId: event.event_id }).filter(
    (r) => r.reviewStatus === "not_reviewed" && staffingSummary.criticalRequirementsBelowMinimum > 0,
  );
  if (unreviewedCritical.length > 0) {
    signals.push({ key: "unreviewed_critical_interest", severity: "urgent", reason: "Unreviewed interest on critical shift." });
  }
  if (listAssignments({ eventId: event.event_id, activeOnly: true }).some((a) => a.trainingConditionStatus === "pending")) {
    signals.push({ key: "training_condition_pending", severity: "watch", reason: "Training condition pending on assignment." });
  }

  const taskSummary = buildTaskChecklistSummary(event.event_id);
  if (taskSummary.overdueCount > 0) {
    signals.push({ key: "task_overdue", severity: within48 ? "urgent" : "needs_attention", reason: `${taskSummary.overdueCount} overdue task(s).` });
  }
  if (taskSummary.blockedCount > 0) {
    signals.push({ key: "task_blocking", severity: "needs_attention", reason: `${taskSummary.blockedCount} task(s) blocked by dependencies.` });
  }
  if (taskSummary.incompleteRequiredCount > 0 && within48) {
    signals.push({ key: "incomplete_required_tasks", severity: "urgent", reason: "Required tasks incomplete within 48 hours." });
  }
  const unowned = listTasks({ eventId: event.event_id }).filter((t) => t.required && !t.ownerUserId && !isTaskComplete(t.taskStatus));
  if (unowned.length > 0) {
    signals.push({ key: "task_no_owner", severity: "watch", reason: "Required task without owner." });
  }

  const prep = buildPreparationSummary(event.event_id);
  if (prep.materialsTotal > prep.materialsReady && within48) {
    signals.push({ key: "materials_gap", severity: "urgent", reason: "Materials checklist incomplete near event." });
  }
  if (prep.promotionTotal > prep.promotionReady && isPublicFacing(event) && within48) {
    signals.push({ key: "promotion_not_ready", severity: "needs_attention", reason: "Promotion checklist incomplete." });
  }
  if (prep.logisticsTotal > prep.logisticsReady) {
    signals.push({ key: "logistics_incomplete", severity: "watch", reason: "Logistics items not ready." });
  }
  const dueReminders = listPreparationItems({ eventId: event.event_id, category: "reminder" }).filter(
    (r) => r.scheduledAt && new Date(r.scheduledAt).getTime() - now.getTime() < 86400000 && !isPreparationReady(r.itemStatus),
  );
  if (dueReminders.length > 0) {
    signals.push({ key: "reminder_due", severity: "watch", reason: "Reminder scheduled within 24 hours." });
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
