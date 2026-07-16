import type { CalendarEvent } from "../types";
import type { EventReadinessItem } from "../operations/types";
import { buildCoreRecordSummary } from "./checklist";
import { ensureCoreRecordFromEvent } from "./template-integration";
import { isCoreRecordItemReady } from "./status";
import { listCoreRecordItems } from "./store";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

function blockingInCategory(eventId: string, category: import("./types").CoreRecordCategory) {
  return listCoreRecordItems({ eventId, category }).filter(
    (i) => i.required && i.blocksReadiness && !isCoreRecordItemReady(i.itemStatus),
  );
}

export function evaluateOwnershipReadiness(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/core-record/ownership");
  ensureCoreRecordFromEvent(event);
  const owner = event.owned_by_team ?? event.primary_contact;
  const blocking = blockingInCategory(event.event_id, "ownership");

  if (!owner) {
    return {
      dimension: "ownership",
      state: "blocked",
      label: "Ownership",
      explanation: blocking[0]?.label ?? "No operational owner or owning team is assigned.",
      blocker: "Assign an event owner or campus team lead.",
      route,
    };
  }
  if (blocking.length > 0) {
    return {
      dimension: "ownership",
      state: "in_progress",
      label: "Ownership",
      explanation: `Owner: ${owner}. ${blocking.length} ownership checklist item(s) open.`,
      route,
    };
  }
  return {
    dimension: "ownership",
    state: "ready",
    label: "Ownership",
    explanation: `Owner: ${owner}. Event Board oversight: ${event.volunteer_manager ?? "Carol Eagan"} (not operational ownership).`,
    route: eventRoute(event.event_id, "/core-record"),
  };
}

export function evaluateDateTimeReadiness(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/core-record/schedule");
  ensureCoreRecordFromEvent(event);
  const blocking = blockingInCategory(event.event_id, "schedule");

  if (!event.start_at || !event.end_at) {
    return {
      dimension: "date_time",
      state: "blocked",
      label: "Date and time",
      explanation: "Start or end time is missing.",
      blocker: "Set event date and time.",
      route,
    };
  }
  if (new Date(event.end_at) < new Date(event.start_at)) {
    return {
      dimension: "date_time",
      state: "blocked",
      label: "Date and time",
      explanation: "End time is before start time.",
      blocker: "Correct the event schedule.",
      route,
    };
  }
  if (blocking.length > 0) {
    return {
      dimension: "date_time",
      state: "in_progress",
      label: "Date and time",
      explanation: buildCoreRecordSummary(event.event_id).primaryGap ?? "Schedule checklist incomplete.",
      route,
    };
  }
  return {
    dimension: "date_time",
    state: "ready",
    label: "Date and time",
    explanation: "Schedule is set on the canonical event record.",
    route: eventRoute(event.event_id, "/core-record"),
  };
}

export function evaluateVenueReadiness(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/core-record/venue");
  ensureCoreRecordFromEvent(event);
  const blocking = blockingInCategory(event.event_id, "venue");

  if (event.location_type === "virtual" && event.virtual_url) {
    return {
      dimension: "venue",
      state: "ready",
      label: "Venue",
      explanation: "Virtual venue link is present.",
      route: eventRoute(event.event_id, "/core-record"),
    };
  }
  if (event.location_type === "virtual" || event.location_name === "Virtual") {
    if (blocking.some((b) => b.itemKey === "virtual-link")) {
      return {
        dimension: "venue",
        state: "in_progress",
        label: "Venue",
        explanation: "Virtual event — add meeting link when available.",
        route,
      };
    }
    return {
      dimension: "venue",
      state: "ready",
      label: "Venue",
      explanation: "Virtual event — no physical venue required.",
      route: eventRoute(event.event_id, "/core-record"),
    };
  }
  if (!event.location_name && event.location_type === "tbd") {
    return {
      dimension: "venue",
      state: "not_started",
      label: "Venue",
      explanation: "Venue is marked TBD.",
      route,
    };
  }
  if (!event.location_name) {
    return {
      dimension: "venue",
      state: "blocked",
      label: "Venue",
      explanation: blocking[0]?.label ?? "No location is set.",
      blocker: "Confirm venue or mark virtual/TBD.",
      route,
    };
  }
  if (blocking.length > 0) {
    return {
      dimension: "venue",
      state: "in_progress",
      label: "Venue",
      explanation: `${event.location_name} — venue checklist incomplete.`,
      route,
    };
  }
  return {
    dimension: "venue",
    state: "ready",
    label: "Venue",
    explanation: `${event.location_name}. Calendar record only — not venue contract approval.`,
    route: eventRoute(event.event_id, "/core-record"),
  };
}
