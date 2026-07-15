import type { CalendarEvent } from "../types";
import type { EventReadinessItem } from "../operations/types";
import { buildVerificationSummary } from "./checklist";
import { isVerificationComplete } from "./status";
import { ensureVerificationFromEvent, verificationRequiredForEvent } from "./template-integration";
import { listVerificationItems } from "./store";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

function isPublicFacing(event: CalendarEvent): boolean {
  return event.visibility === "public" || event.publication_status === "published" || event.publication_status === "ready_to_publish";
}

export function evaluateVerificationReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem {
  const route = eventRoute(event.event_id, "/verification");
  if (event.operational_status === "completed" || event.operational_status === "canceled") {
    return { dimension: "verification", state: "not_required", label: "Verification", explanation: "Event closed.", route };
  }
  if (!verificationRequiredForEvent(event)) {
    return {
      dimension: "verification",
      state: "not_required",
      label: "Verification",
      explanation: "No separate venue/legal verification required for this scope.",
      route,
    };
  }
  ensureVerificationFromEvent(event);
  const summary = buildVerificationSummary(event.event_id);
  const hoursUntil = (new Date(event.start_at).getTime() - now.getTime()) / 36e5;
  const blocking = listVerificationItems({ eventId: event.event_id }).filter(
    (i) => i.required && i.blocksReadiness && !isVerificationComplete(i.itemStatus),
  );
  if (summary.venueTotal + summary.campusTotal + summary.legalTotal + summary.accessibilityTotal === 0) {
    return {
      dimension: "verification",
      state: "not_started",
      label: "Verification",
      explanation: "Verification checklist not generated.",
      route,
    };
  }
  if (blocking.length > 0 && hoursUntil <= 72 && hoursUntil >= 0) {
    return {
      dimension: "verification",
      state: "blocked",
      label: "Verification",
      explanation: `Verification incomplete: ${blocking[0].label}`,
      blocker: blocking.map((b) => b.label).join("; "),
      route: eventRoute(event.event_id, `/verification/${blocking[0].itemId}`),
    };
  }
  const total =
    summary.venueTotal + summary.campusTotal + summary.legalTotal + summary.accessibilityTotal;
  const done =
    summary.venueVerified + summary.campusVerified + summary.legalVerified + summary.accessibilityVerified;
  if (done >= total && total > 0) {
    return {
      dimension: "verification",
      state: isPublicFacing(event) ? "ready" : "in_progress",
      label: "Verification",
      explanation: "Venue and compliance checklist complete (soft beta). Calendar approval ≠ venue approval.",
      route,
    };
  }
  return {
    dimension: "verification",
    state: "in_progress",
    label: "Verification",
    explanation: `${done}/${total} verification items complete.`,
    route,
  };
}
