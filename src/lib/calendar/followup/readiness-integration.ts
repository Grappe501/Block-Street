import type { CalendarEvent } from "../types";
import type { EventReadinessItem } from "../operations/types";
import { buildFollowUpSummary } from "./checklist";
import { isFollowUpComplete } from "./status";
import { ensureFollowUpFromEvent, followUpRequiredForEvent, isFollowUpDue } from "./template-integration";
import { listFollowUpItems } from "./store";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

export function evaluateFollowUpReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem {
  const route = eventRoute(event.event_id, "/report");

  if (event.operational_status === "canceled") {
    return {
      dimension: "follow_up",
      state: "not_required",
      label: "Follow-up",
      explanation: "Canceled event — follow-up not required.",
      route,
    };
  }

  if (!followUpRequiredForEvent(event)) {
    return {
      dimension: "follow_up",
      state: "not_required",
      label: "Follow-up",
      explanation: "Follow-up and reporting not required for this event type.",
      route,
    };
  }

  if (!isFollowUpDue(event, now)) {
    return {
      dimension: "follow_up",
      state: "not_required",
      label: "Follow-up",
      explanation: "Pre-event — follow-up and reporting not yet due.",
      route,
    };
  }

  ensureFollowUpFromEvent(event);
  const summary = buildFollowUpSummary(event.event_id);
  const incomplete = listFollowUpItems({ eventId: event.event_id }).filter(
    (i) => i.required && i.blocksReadiness && !isFollowUpComplete(i.itemStatus),
  );

  if (summary.metricsTotal + summary.actionsTotal === 0) {
    return {
      dimension: "follow_up",
      state: "not_started",
      label: "Follow-up",
      explanation: "Report checklist not generated yet.",
      route,
    };
  }

  if (incomplete.length === 0) {
    return {
      dimension: "follow_up",
      state: "complete",
      label: "Follow-up",
      explanation: "Post-event report and follow-up actions complete (soft beta).",
      route,
    };
  }

  const overdue = summary.overdueCount > 0;
  if (overdue || event.operational_status === "completed") {
    return {
      dimension: "follow_up",
      state: "blocked",
      label: "Follow-up",
      explanation: `Required follow-up incomplete: ${incomplete[0].label}`,
      blocker: incomplete.map((i) => i.label).join("; "),
      route: eventRoute(event.event_id, `/report/${incomplete[0].itemId}`),
    };
  }

  return {
    dimension: "follow_up",
    state: "in_progress",
    label: "Follow-up",
    explanation: `${summary.metricsSubmitted + summary.actionsSubmitted}/${summary.metricsTotal + summary.actionsTotal} report items submitted.`,
    route,
  };
}
