import type { CalendarEvent } from "../types";
import type { EventReadinessItem } from "../operations/types";
import { buildRsvpSummary } from "./checklist";
import { isRsvpReady } from "./status";
import { ensureRsvpFromEvent, rsvpRequiredForEvent } from "./template-integration";
import { listRsvpItems } from "./store";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

export function evaluateRsvpReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem {
  const route = eventRoute(event.event_id, "/rsvp");
  if (event.operational_status === "completed" || event.operational_status === "canceled") {
    return { dimension: "rsvp", state: "not_required", label: "RSVP", explanation: "Event closed.", route };
  }
  if (!rsvpRequiredForEvent(event)) {
    return {
      dimension: "rsvp",
      state: "not_required",
      label: "RSVP",
      explanation: "RSVP tracking not required for this event type.",
      route,
    };
  }
  ensureRsvpFromEvent(event);
  const summary = buildRsvpSummary(event.event_id);
  const hoursUntil = (new Date(event.start_at).getTime() - now.getTime()) / 36e5;
  const blocking = listRsvpItems({ eventId: event.event_id }).filter(
    (i) => i.required && i.blocksReadiness && !isRsvpReady(i.itemStatus),
  );
  if (summary.planTotal + summary.operationsTotal === 0) {
    return { dimension: "rsvp", state: "not_started", label: "RSVP", explanation: "RSVP plan not generated.", route };
  }
  if (blocking.length > 0 && hoursUntil <= 48 && hoursUntil >= 0) {
    return {
      dimension: "rsvp",
      state: "blocked",
      label: "RSVP",
      explanation: `RSVP prep incomplete: ${blocking[0].label}`,
      blocker: blocking.map((b) => b.label).join("; "),
      route,
    };
  }
  if (summary.incompleteRequired > 0) {
    return {
      dimension: "rsvp",
      state: "in_progress",
      label: "RSVP",
      explanation: `${summary.planReady + summary.operationsReady}/${summary.planTotal + summary.operationsTotal} RSVP checklist items ready.`,
      route,
    };
  }
  return {
    dimension: "rsvp",
    state: "ready",
    label: "RSVP",
    explanation: `RSVP plan ready — ${summary.headcountEstimate} estimated attendees (soft beta).`,
    route,
  };
}
