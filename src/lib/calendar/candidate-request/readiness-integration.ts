import type { CalendarEvent } from "../types";
import type { EventReadinessItem } from "../operations/types";
import { buildCandidateSummary } from "./checklist";
import { isCandidateItemReady } from "./status";
import { candidateRequestRequiredForEvent, ensureCandidateRequestFromEvent } from "./template-integration";
import { listCandidateItems } from "./store";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

function isPublicFacing(event: CalendarEvent): boolean {
  return event.visibility === "public" || event.publication_status === "published" || event.publication_status === "ready_to_publish";
}

export function evaluateCandidateReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem {
  const route = eventRoute(event.event_id, "/candidate-request");
  if (!candidateRequestRequiredForEvent(event)) {
    return {
      dimension: "candidate",
      state: "not_required",
      label: "Candidate",
      explanation: "Kelly attendance not requested for this event.",
      route,
    };
  }
  if (event.operational_status === "canceled") {
    return { dimension: "candidate", state: "not_required", label: "Candidate", explanation: "Event canceled.", route };
  }

  ensureCandidateRequestFromEvent(event);
  const status = event.kelly_attendance_status ?? "not_requested";
  const summary = buildCandidateSummary(event.event_id, status);
  const hoursUntil = (new Date(event.start_at).getTime() - now.getTime()) / 36e5;
  const blocking = listCandidateItems({ eventId: event.event_id }).filter(
    (i) => i.required && i.blocksReadiness && !isCandidateItemReady(i.itemStatus),
  );

  if (status === "confirmed" || status === "completed") {
    if (blocking.length === 0) {
      return {
        dimension: "candidate",
        state: "ready",
        label: "Candidate",
        explanation: "Kelly attendance confirmed — checklist complete (soft beta).",
        route,
      };
    }
    return {
      dimension: "candidate",
      state: "in_progress",
      label: "Candidate",
      explanation: "Kelly confirmed — finish briefing/travel checklist items.",
      route,
    };
  }

  if (status === "declined" || status === "canceled") {
    const needsAlternate = isPublicFacing(event) && !["canceled", "archived", "completed"].includes(event.operational_status);
    return {
      dimension: "candidate",
      state: needsAlternate ? "blocked" : "complete",
      label: "Candidate",
      explanation: needsAlternate
        ? "Kelly declined — public event needs an alternate plan."
        : "Kelly declined — event adjusted or canceled.",
      blocker: needsAlternate ? "Approve no-candidate plan or adjust event." : null,
      route,
    };
  }

  if (blocking.length > 0 && hoursUntil <= 72 && hoursUntil >= 0) {
    return {
      dimension: "candidate",
      state: "blocked",
      label: "Candidate",
      explanation: `Candidate request prep incomplete: ${blocking[0].label}`,
      blocker: blocking.map((b) => b.label).join("; "),
      route: eventRoute(event.event_id, `/candidate-request/${blocking[0].itemId}`),
    };
  }

  if (status === "hold_placed" || status === "tentatively_accepted") {
    return {
      dimension: "candidate",
      state: "in_progress",
      label: "Candidate",
      explanation: `Kelly hold/tentative (${status}). Request ≠ confirmation.`,
      route,
    };
  }

  if (summary.incompleteRequired > 0) {
    return {
      dimension: "candidate",
      state: "in_progress",
      label: "Candidate",
      explanation: `Kelly request ${status.replace(/_/g, " ")} — ${summary.incompleteRequired} checklist item(s) open.`,
      route,
    };
  }

  return {
    dimension: "candidate",
    state: "in_progress",
    label: "Candidate",
    explanation: `Kelly request ${status.replace(/_/g, " ")}. Request ≠ confirmation.`,
    route,
  };
}
