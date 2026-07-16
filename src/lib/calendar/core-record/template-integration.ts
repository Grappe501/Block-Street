import type { CalendarEvent } from "../types";
import { createCoreRecordItem } from "./items";
import { isCoreRecordItemReady } from "./status";
import { listCoreRecordItems } from "./store";

function ownershipStatus(event: CalendarEvent, key: string): import("./types").CoreRecordItemStatus {
  const hasOwner = Boolean(event.owned_by_team || event.primary_contact);
  const hasOversight = Boolean(event.volunteer_manager);
  if (key === "operational-owner") return hasOwner ? "ready" : "blocked";
  if (key === "event-board-oversight") return hasOversight ? "ready" : "in_progress";
  if (key === "contact-path") return event.primary_contact ? "ready" : hasOwner ? "in_progress" : "not_started";
  return "not_started";
}

function scheduleStatus(event: CalendarEvent, key: string): import("./types").CoreRecordItemStatus {
  if (!event.start_at || !event.end_at) {
    return key === "start-end-set" ? "blocked" : "not_started";
  }
  if (new Date(event.end_at) < new Date(event.start_at)) {
    return key === "duration-valid" ? "blocked" : "ready";
  }
  if (key === "start-end-set") return "ready";
  if (key === "duration-valid") return "ready";
  if (key === "timezone-recorded") return event.start_at.includes("-") || event.start_at.endsWith("Z") ? "ready" : "in_progress";
  return "not_started";
}

function venueStatus(event: CalendarEvent, key: string): import("./types").CoreRecordItemStatus {
  if (event.location_type === "virtual" || event.location_name === "Virtual") {
    if (key === "venue-type") return "ready";
    if (key === "virtual-link") return event.virtual_url ? "ready" : "in_progress";
    return "not_applicable";
  }
  if (!event.location_name && event.location_type === "tbd") {
    if (key === "venue-type") return "in_progress";
    if (key === "physical-location") return "not_started";
    return "not_started";
  }
  if (!event.location_name) {
    if (key === "physical-location") return "blocked";
    return "not_started";
  }
  if (key === "venue-type") return "ready";
  if (key === "physical-location") return "ready";
  if (key === "virtual-link") return "not_applicable";
  return "not_started";
}

export function ensureCoreRecordFromEvent(event: CalendarEvent): import("./types").CalendarEventCoreRecordItem[] {
  const existing = listCoreRecordItems({ eventId: event.event_id });
  if (existing.length > 0) return existing;

  const created: import("./types").CalendarEventCoreRecordItem[] = [];
  const ownershipKeys = [
    { key: "operational-owner", label: "Operational owner or owning team assigned" },
    { key: "contact-path", label: "Primary contact path documented" },
    { key: "event-board-oversight", label: "Event Board oversight contact (not operational owner)", required: false },
  ];
  for (const row of ownershipKeys) {
    created.push(
      createCoreRecordItem({
        eventId: event.event_id,
        category: "ownership",
        itemKey: row.key,
        label: row.label,
        required: row.required !== false,
        blocksReadiness: row.key === "operational-owner",
        fieldSnapshot: event.owned_by_team ?? event.primary_contact ?? null,
        generatedFromEvent: true,
        initialStatus: ownershipStatus(event, row.key),
      }),
    );
  }

  const scheduleKeys = [
    { key: "start-end-set", label: "Start and end times on canonical record" },
    { key: "duration-valid", label: "End time after start time" },
    { key: "timezone-recorded", label: "Timezone offset recorded on schedule", required: false },
  ];
  for (const row of scheduleKeys) {
    created.push(
      createCoreRecordItem({
        eventId: event.event_id,
        category: "schedule",
        itemKey: row.key,
        label: row.label,
        required: row.required !== false,
        blocksReadiness: row.key !== "timezone-recorded",
        fieldSnapshot: event.start_at ?? null,
        generatedFromEvent: true,
        initialStatus: scheduleStatus(event, row.key),
      }),
    );
  }

  const venueKeys = [
    { key: "venue-type", label: "Venue type resolved (physical, virtual, or TBD)" },
    { key: "physical-location", label: "Physical location name confirmed" },
    { key: "virtual-link", label: "Virtual meeting link present", required: false },
  ];
  for (const row of venueKeys) {
    created.push(
      createCoreRecordItem({
        eventId: event.event_id,
        category: "venue",
        itemKey: row.key,
        label: row.label,
        required: row.key !== "virtual-link",
        blocksReadiness: row.key === "physical-location" || row.key === "venue-type",
        fieldSnapshot: event.location_name ?? event.location_type ?? null,
        generatedFromEvent: true,
        initialStatus: venueStatus(event, row.key),
      }),
    );
  }

  return created;
}

export function listEventsWithCoreRecordGaps(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter((e) => {
    ensureCoreRecordFromEvent(e);
    const items = listCoreRecordItems({ eventId: e.event_id });
    return items.some((i) => i.required && i.blocksReadiness && !isCoreRecordItemReady(i.itemStatus));
  });
}

export function listEventsMissingOwnership(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter((e) => !e.owned_by_team && !e.primary_contact);
}

export function listEventsWithVenueGaps(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter((e) => {
    ensureCoreRecordFromEvent(e);
    const venue = listCoreRecordItems({ eventId: e.event_id, category: "venue" });
    return venue.some((i) => i.blocksReadiness && !isCoreRecordItemReady(i.itemStatus));
  });
}

export function listEventsWithScheduleGaps(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter((e) => {
    ensureCoreRecordFromEvent(e);
    const schedule = listCoreRecordItems({ eventId: e.event_id, category: "schedule" });
    return schedule.some((i) => i.blocksReadiness && !isCoreRecordItemReady(i.itemStatus));
  });
}
