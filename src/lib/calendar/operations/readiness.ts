import type { CalendarEvent } from "../types";
import type { EventReadinessDimension, EventReadinessItem, EventReadinessState } from "./types";
import { evaluateStaffingReadiness } from "../staffing/readiness-integration";
import { evaluateEventTasksReadiness } from "../tasks/readiness-integration";
import { evaluateMaterialsReadiness, evaluatePromotionReadiness } from "../preparation/readiness-integration";
import { evaluateFollowUpReadiness } from "../followup/readiness-integration";
import { evaluateRsvpReadiness } from "../rsvp/readiness-integration";
import { evaluateVerificationReadiness } from "../verification/readiness-integration";
import { evaluateCandidateReadiness } from "../candidate-request/readiness-integration";
import { evaluateApprovalReadiness } from "../lifecycle/readiness-integration";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

function isPreEvent(event: CalendarEvent, now: Date): boolean {
  return new Date(event.end_at) >= now && event.operational_status !== "completed" && event.operational_status !== "canceled";
}

function isPublicFacing(event: CalendarEvent): boolean {
  return event.visibility === "public" || event.publication_status === "published" || event.publication_status === "ready_to_publish";
}

function needsVolunteers(event: CalendarEvent): boolean {
  return event.volunteers_needed > 0 || event.volunteer_roles.length > 0;
}

function evaluateOwnership(event: CalendarEvent): EventReadinessItem {
  const owner = event.owned_by_team ?? event.primary_contact;
  if (!owner) {
    return {
      dimension: "ownership",
      state: "blocked",
      label: "Ownership",
      explanation: "No operational owner or owning team is assigned.",
      blocker: "Assign an event owner or campus team lead.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  return {
    dimension: "ownership",
    state: "ready",
    label: "Ownership",
    explanation: `Owner: ${owner}. Event Board oversight: ${event.volunteer_manager ?? "Carol Eagan"} (not operational ownership).`,
    route: eventRoute(event.event_id),
  };
}

function evaluateDateTime(event: CalendarEvent): EventReadinessItem {
  if (!event.start_at || !event.end_at) {
    return {
      dimension: "date_time",
      state: "blocked",
      label: "Date and time",
      explanation: "Start or end time is missing.",
      blocker: "Set event date and time.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  if (new Date(event.end_at) < new Date(event.start_at)) {
    return {
      dimension: "date_time",
      state: "blocked",
      label: "Date and time",
      explanation: "End time is before start time.",
      blocker: "Correct the event schedule.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  return {
    dimension: "date_time",
    state: "ready",
    label: "Date and time",
    explanation: "Schedule is set on the canonical event record.",
    route: eventRoute(event.event_id),
  };
}

function evaluateVenue(event: CalendarEvent): EventReadinessItem {
  if (event.location_type === "virtual" && event.virtual_url) {
    return {
      dimension: "venue",
      state: "ready",
      label: "Venue",
      explanation: "Virtual venue link is present.",
      route: eventRoute(event.event_id),
    };
  }
  if (event.location_type === "virtual" || event.location_name === "Virtual") {
    return {
      dimension: "venue",
      state: "ready",
      label: "Venue",
      explanation: "Virtual event — no physical venue required.",
      route: eventRoute(event.event_id),
    };
  }
  if (!event.location_name && event.location_type === "tbd") {
    return {
      dimension: "venue",
      state: "not_started",
      label: "Venue",
      explanation: "Venue is marked TBD.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  if (!event.location_name) {
    return {
      dimension: "venue",
      state: "blocked",
      label: "Venue",
      explanation: "No location is set.",
      blocker: "Confirm venue or mark virtual/TBD.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  return {
    dimension: "venue",
    state: "ready",
    label: "Venue",
    explanation: `${event.location_name}. Calendar record only — not venue contract approval.`,
    route: eventRoute(event.event_id),
  };
}


function evaluateStaffing(event: CalendarEvent, now: Date): EventReadinessItem {
  const route = eventRoute(event.event_id, "/staffing");
  if (!needsVolunteers(event) || event.staffing_status === "staffing_not_required") {
    return {
      dimension: "staffing",
      state: "not_required",
      label: "Staffing",
      explanation: "No volunteers required for this event.",
      route,
    };
  }
  if (event.staffing_status === "no_staffing_plan" || event.volunteer_roles.length === 0) {
    return {
      dimension: "staffing",
      state: "not_started",
      label: "Staffing",
      explanation: "Volunteer roles or staffing plan missing.",
      route,
    };
  }
  const hoursUntil = (new Date(event.start_at).getTime() - now.getTime()) / 36e5;
  if (event.staffing_status === "critical_shortage" && hoursUntil <= 72 && hoursUntil >= 0) {
    return {
      dimension: "staffing",
      state: "blocked",
      label: "Staffing",
      explanation: "Critical volunteer shortage within 72 hours of event.",
      blocker: "Fill critical roles or reduce scope.",
      route,
    };
  }
  if (event.staffing_status === "needs_volunteers" || event.volunteer_slots_open > 0) {
    return {
      dimension: "staffing",
      state: "in_progress",
      label: "Staffing",
      explanation: `${event.volunteers_confirmed}/${event.volunteers_needed} confirmed. Interest ≠ assignment.`,
      route,
    };
  }
  return {
    dimension: "staffing",
    state: "ready",
    label: "Staffing",
    explanation: `Staffing ${event.staffing_status.replace(/_/g, " ")}. Soft-beta — not production assignment.`,
    route,
  };
}

function evaluateTasks(event: CalendarEvent): EventReadinessItem {
  return evaluateEventTasksReadiness(event);
}

const EVALUATORS: Record<
  EventReadinessDimension,
  (event: CalendarEvent, now: Date) => EventReadinessItem
> = {
  ownership: (e) => evaluateOwnership(e),
  approval: (e) => evaluateApprovalReadiness(e),
  date_time: (e) => evaluateDateTime(e),
  venue: (e) => evaluateVenue(e),
  candidate: (e, n) => evaluateCandidateReadiness(e, n),
  staffing: (e, n) => evaluateStaffingReadiness(e, n),
  tasks: (e, n) => evaluateEventTasksReadiness(e, n),
  materials: (e, n) => evaluateMaterialsReadiness(e, n),
  promotion: (e, n) => evaluatePromotionReadiness(e, n),
  rsvp: (e, n) => evaluateRsvpReadiness(e, n),
  verification: (e, n) => evaluateVerificationReadiness(e, n),
  follow_up: (e, n) => evaluateFollowUpReadiness(e, n),
};

export function evaluateEventReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem[] {
  const items = (Object.keys(EVALUATORS) as EventReadinessDimension[]).map((dim) => EVALUATORS[dim](event, now));
  const tr = event.template_readiness;
  if (!tr) return items;
  return items.map((item) => {
    if (tr.nonApplicableDimensions.includes(item.dimension)) {
      return {
        ...item,
        state: "not_required",
        explanation: "Not required for this event template.",
        blocker: null,
      };
    }
    return item;
  });
}

export function aggregateOverallReadiness(
  items: EventReadinessItem[],
  event: CalendarEvent,
  now: Date = new Date(),
): EventReadinessState {
  const required = items.filter((i) => i.state !== "not_required");
  if (required.length === 0) return "not_required";

  if (event.operational_status === "completed") {
    const followUp = items.find((i) => i.dimension === "follow_up");
    if (followUp?.state === "complete") return "complete";
    if (followUp?.state === "blocked") return "blocked";
    return "complete";
  }

  if (required.some((i) => i.state === "blocked")) return "blocked";

  const notStarted = required.filter((i) => i.state === "not_started").length;
  if (notStarted >= 3) return "not_started";

  const preEvent = isPreEvent(event, now);
  if (preEvent) {
    const preDims = required.filter((i) => i.dimension !== "follow_up");
    const allReady = preDims.every((i) => i.state === "ready" || i.state === "complete");
    if (allReady) return "ready";
  }

  if (required.some((i) => i.state === "in_progress" || i.state === "not_started")) return "in_progress";

  return "ready";
}

export function readinessRatio(items: EventReadinessItem[]): { completed: number; required: number } | null {
  const required = items.filter((i) => i.state !== "not_required");
  if (required.length === 0) return null;
  const completed = required.filter((i) => i.state === "ready" || i.state === "complete").length;
  return { completed, required: required.length };
}

export const READINESS_STATE_LABELS: Record<EventReadinessState, string> = {
  not_required: "Not required",
  not_started: "Not started",
  in_progress: "In progress",
  blocked: "Blocked",
  ready: "Ready",
  complete: "Complete",
};
