/**
 * CAE-11.6-W6 — Calendar & time intelligence services
 */
import { caeId, nowIso } from "../../../../utils";
import { hasReservationConflict } from "../../resources/services/repository";
import type { CalendarEventRecord } from "../data-model";
import {
  eventsOverlap,
  getCalendarEvent,
  getCanonicalCalendar,
  listAvailabilityRules,
  listCalendarEvents,
  listConflicts,
  listDeadlines,
  listExternalSync,
  listRecurringSeries,
  listReminders,
  listTravelWindows,
  saveCalendarEvent,
  saveConflict,
  saveDeadline,
  saveExternalSync,
  saveRecurringSeries,
  saveReminder,
  saveTravelWindow,
} from "./repository";

const DEFAULT_INSTITUTION = "inst-block-street";

export class CalendarError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const calendarService = {
  get(institutionId: string) {
    const cal = getCanonicalCalendar(institutionId);
    if (!cal) throw new CalendarError("CALENDAR_NOT_FOUND", `No canonical calendar for ${institutionId}`);
    return cal;
  },
  projectView(institutionId: string, view: "mission" | "personal" | "resource" | "executive" | "organization", context?: {
    missionId?: string;
    humanId?: string;
    resourceId?: string;
  }) {
    const events = listCalendarEvents(institutionId, {
      missionId: view === "mission" ? context?.missionId : undefined,
      humanId: view === "personal" ? context?.humanId : undefined,
      resourceId: view === "resource" ? context?.resourceId : undefined,
    });
    const filtered =
      view === "executive"
        ? events.filter((e) => e.priority === "critical" || e.priority === "high" || e.event_type === "executive")
        : view === "organization"
          ? events.filter((e) => e.visibility !== "personal")
          : events;
    return { view, institution_id: institutionId, canonical: true, events: filtered };
  },
};

export const eventService = {
  list: listCalendarEvents,
  get: (eventId: string) => {
    const event = getCalendarEvent(eventId);
    if (!event) throw new CalendarError("EVENT_NOT_FOUND", `Event ${eventId} not found`);
    return event;
  },
  create(input: {
    institution_id: string;
    calendar_id: string;
    event_type: CalendarEventRecord["event_type"];
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    time_zone?: string;
    mission_id?: string | null;
    resource_ids?: string[];
    human_ids?: string[];
    visibility?: CalendarEventRecord["visibility"];
    created_by: string;
  }) {
    const now = nowIso();
    const event: CalendarEventRecord = {
      event_id: caeId("evt"),
      calendar_id: input.calendar_id,
      institution_id: input.institution_id,
      event_type: input.event_type,
      title: input.title,
      description: input.description,
      start_time: input.start_time,
      end_time: input.end_time,
      time_zone: input.time_zone ?? "America/Chicago",
      all_day: false,
      recurring: false,
      recurring_series_id: null,
      priority: "normal",
      status: "scheduled",
      visibility: input.visibility ?? "institution",
      mission_id: input.mission_id ?? null,
      resource_ids: input.resource_ids ?? [],
      human_ids: input.human_ids ?? [],
      organization_unit_ids: [],
      location: null,
      virtual_location: null,
      created_by: input.created_by,
      approved_by: null,
      created_at: now,
      updated_at: now,
    };
    saveCalendarEvent(event);
    return { event, event_name: "event.created" as const };
  },
  approve(eventId: string, approvedBy: string) {
    const event = getCalendarEvent(eventId);
    if (!event) throw new CalendarError("EVENT_NOT_FOUND", "Event not found");
    const updated: CalendarEventRecord = { ...event, status: "confirmed", approved_by: approvedBy, updated_at: nowIso() };
    saveCalendarEvent(updated);
    return { event: updated, event_name: "event.confirmed" as const };
  },
  cancel(eventId: string) {
    const event = getCalendarEvent(eventId);
    if (!event) throw new CalendarError("EVENT_NOT_FOUND", "Event not found");
    const updated: CalendarEventRecord = { ...event, status: "cancelled", updated_at: nowIso() };
    saveCalendarEvent(updated);
    return { event: updated, event_name: "event.cancelled" as const };
  },
  reschedule(eventId: string, startTime: string, endTime: string) {
    const event = getCalendarEvent(eventId);
    if (!event) throw new CalendarError("EVENT_NOT_FOUND", "Event not found");
    const updated: CalendarEventRecord = { ...event, start_time: startTime, end_time: endTime, updated_at: nowIso() };
    saveCalendarEvent(updated);
    return { event: updated, event_name: "event.updated" as const };
  },
};

export const schedulingService = {
  recommend(input: {
    institution_id: string;
    human_ids: string[];
    duration_minutes: number;
    mission_id?: string;
    resource_ids?: string[];
    preferred_start?: string;
  }) {
    const rules = input.human_ids.flatMap((h) => listAvailabilityRules(input.institution_id, h));
    const conflicts = conflictDetectionService.detect(input.institution_id);
    return {
      advisory_only: true,
      recommendations: [
        {
          suggested_start: input.preferred_start ?? "2026-08-16T10:00:00-05:00",
          duration_minutes: input.duration_minutes,
          participants: input.human_ids,
          working_hours_respected: rules.length > 0,
          conflicts_avoided: conflicts.filter((c) => !c.resolved).length === 0,
        },
      ],
      may_not_auto_schedule: true,
    };
  },
};

export const availabilityService = {
  list: listAvailabilityRules,
  compute(institutionId: string, humanId: string, from: string, to: string) {
    const events = listCalendarEvents(institutionId, { humanId, from, to });
    const rules = listAvailabilityRules(institutionId, humanId)[0];
    const committedHours = events.reduce((sum, e) => {
      const mins = (new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / 60000;
      return sum + mins / 60;
    }, 0);
    return {
      human_id: humanId,
      working_hours: rules ? `${rules.working_hours_start}-${rules.working_hours_end}` : "default",
      committed_hours: committedHours,
      available: committedHours < 8,
      recalculated_at: nowIso(),
    };
  },
};

export const timeZoneService = {
  resolve(institutionId: string, eventTimeZone?: string, humanTimeZone?: string) {
    const cal = getCanonicalCalendar(institutionId);
    return {
      institution_time_zone: cal?.time_zone ?? "America/Chicago",
      event_time_zone: eventTimeZone ?? cal?.time_zone ?? "America/Chicago",
      human_time_zone: humanTimeZone ?? cal?.time_zone ?? "America/Chicago",
      display_time_zone: humanTimeZone ?? eventTimeZone ?? cal?.time_zone ?? "America/Chicago",
    };
  },
};

export const travelService = {
  list: listTravelWindows,
  calculate(input: {
    institution_id: string;
    event_id: string;
    origin: string;
    destination: string;
    travel_minutes: number;
    buffer_minutes?: number;
    preparation_minutes?: number;
  }) {
    const record = {
      travel_id: caeId("trv"),
      institution_id: input.institution_id,
      event_id: input.event_id,
      origin: input.origin,
      destination: input.destination,
      travel_minutes: input.travel_minutes,
      buffer_minutes: input.buffer_minutes ?? 15,
      preparation_minutes: input.preparation_minutes ?? 30,
      return_travel_minutes: input.travel_minutes,
      computed_at: nowIso(),
    };
    saveTravelWindow(record);
    return { travel: record, event_name: "travel.updated" as const };
  },
};

export const conflictDetectionService = {
  list: listConflicts,
  detect(institutionId: string) {
    const events = listCalendarEvents(institutionId).filter((e) => e.status !== "cancelled" && e.status !== "archived");
    const saved: Parameters<typeof saveConflict>[0][] = [];

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const a = events[i];
        const b = events[j];
        if (!eventsOverlap(a, b)) continue;

        const sharedHumans = a.human_ids.filter((h) => b.human_ids.includes(h));
        if (sharedHumans.length > 0) {
          const record = {
            conflict_id: caeId("cnf"),
            institution_id: institutionId,
            conflict_type: "double_booking" as const,
            event_ids: [a.event_id, b.event_id],
            resource_ids: [],
            human_ids: sharedHumans,
            explanation: `Human ${sharedHumans.join(", ")} double-booked for "${a.title}" and "${b.title}"`,
            detected_at: nowIso(),
            resolved: false,
          };
          saveConflict(record);
          saved.push(record);
        }

        const sharedResources = a.resource_ids.filter((r) => b.resource_ids.includes(r));
        if (sharedResources.length > 0) {
          const record = {
            conflict_id: caeId("cnf"),
            institution_id: institutionId,
            conflict_type: "resource_overlap" as const,
            event_ids: [a.event_id, b.event_id],
            resource_ids: sharedResources,
            human_ids: [],
            explanation: `Resource ${sharedResources.join(", ")} reserved for overlapping events`,
            detected_at: nowIso(),
            resolved: false,
          };
          saveConflict(record);
          saved.push(record);
        }
      }
    }
    return saved;
  },
  resolve(conflictId: string) {
    const items = listConflicts(DEFAULT_INSTITUTION);
    const conflict = items.find((c) => c.conflict_id === conflictId);
    if (!conflict) throw new CalendarError("CONFLICT_NOT_FOUND", "Conflict not found");
    const updated = { ...conflict, resolved: true };
    saveConflict(updated);
    return updated;
  },
};

export const reservationCalendarService = {
  reserve(input: {
    institution_id: string;
    calendar_id: string;
    resource_id: string;
    human_id: string;
    mission_id?: string;
    start_time: string;
    end_time: string;
    title: string;
  }) {
    if (hasReservationConflict(input.resource_id, input.start_time, input.end_time)) {
      throw new CalendarError("RESERVATION_CONFLICT", "Resource already reserved for this time");
    }
    const result = eventService.create({
      institution_id: input.institution_id,
      calendar_id: input.calendar_id,
      event_type: "reservation",
      title: input.title,
      description: `Resource reservation for ${input.resource_id}`,
      start_time: input.start_time,
      end_time: input.end_time,
      mission_id: input.mission_id,
      resource_ids: [input.resource_id],
      human_ids: [input.human_id],
      visibility: "mission",
      created_by: input.human_id,
    });
    return { ...result, event_name: "reservation.created" as const };
  },
};

export const reminderService = {
  list: listReminders,
  schedule(input: {
    event_id: string;
    institution_id: string;
    human_id: string;
    reminder_type: Parameters<typeof saveReminder>[0]["reminder_type"];
    minutes_before: number;
  }) {
    const record = {
      reminder_id: caeId("rem"),
      event_id: input.event_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      reminder_type: input.reminder_type,
      minutes_before: input.minutes_before,
      status: "scheduled" as const,
    };
    saveReminder(record);
    return record;
  },
};

export const recurringEventService = {
  list: listRecurringSeries,
  create(input: {
    institution_id: string;
    calendar_id: string;
    pattern: Parameters<typeof saveRecurringSeries>[0]["pattern"];
    title: string;
    event_type: CalendarEventRecord["event_type"];
    start_time: string;
    end_time: string;
    interval?: number;
  }) {
    const record = {
      series_id: caeId("ser"),
      institution_id: input.institution_id,
      calendar_id: input.calendar_id,
      pattern: input.pattern,
      interval: input.interval ?? 1,
      title: input.title,
      event_type: input.event_type,
      start_time: input.start_time,
      end_time: input.end_time,
      exceptions: [],
      created_at: nowIso(),
    };
    saveRecurringSeries(record);
    return record;
  },
};

export const deadlineService = {
  list: listDeadlines,
  approaching(institutionId: string, withinDays = 7) {
    const cutoff = Date.now() + withinDays * 86400000;
    return listDeadlines(institutionId).filter((d) => new Date(d.due_at).getTime() <= cutoff && d.status !== "met");
  },
};

export const externalSyncService = {
  list: listExternalSync,
  sync(input: { institution_id: string; human_id: string; provider: Parameters<typeof saveExternalSync>[0]["provider"]; direction?: "inbound" | "outbound" | "bidirectional" }) {
    const record = {
      sync_id: caeId("syn"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      provider: input.provider,
      direction: input.direction ?? "bidirectional",
      last_synced_at: nowIso(),
      status: "active" as const,
    };
    saveExternalSync(record);
    return { sync: record, event_name: "calendar.synced" as const, canonical_authoritative: true };
  },
};

export const timelineService = {
  build(institutionId: string, from?: string, to?: string) {
    const events = listCalendarEvents(institutionId, { from, to });
    const deadlines = listDeadlines(institutionId);
    return {
      institution_id: institutionId,
      events: events.sort((a, b) => a.start_time.localeCompare(b.start_time)),
      deadlines,
      searchable: true,
      institutional_memory: true,
    };
  },
  agenda(institutionId: string, humanId?: string) {
    const now = new Date();
    const events = listCalendarEvents(institutionId, { humanId })
      .filter((e) => new Date(e.end_time) >= now && e.status !== "cancelled")
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
    return { view: "agenda", events };
  },
};

export const timeIntelligenceService = {
  analyze(institutionId: string) {
    const events = listCalendarEvents(institutionId);
    const conflicts = listConflicts(institutionId, false);
    const approaching = deadlineService.approaching(institutionId);
    return {
      institution_id: institutionId,
      schedule_risk: conflicts.length > 0 ? "elevated" : "normal",
      deadline_risk: approaching.length,
      meeting_overload: events.filter((e) => e.event_type === "meeting").length,
      unresolved_conflicts: conflicts.length,
      computed_at: nowIso(),
    };
  },
};

export const aiSchedulingAdvisorService = {
  analyze(institutionId: string) {
    const intel = timeIntelligenceService.analyze(institutionId);
    return {
      institution_id: institutionId,
      advisory_only: true,
      may_not_silently_schedule: true,
      recommendations: [
        intel.unresolved_conflicts > 0 ? "Resolve scheduling conflicts before adding events" : null,
        intel.deadline_risk > 0 ? `${intel.deadline_risk} deadlines approaching` : null,
        intel.meeting_overload > 5 ? "Consider reducing meeting density" : null,
      ].filter(Boolean),
      best_meeting_windows: ["Tuesday 10:00", "Thursday 14:00"],
      travel_optimization: "Add 15-minute buffers between off-site events",
    };
  },
};

export const calendarEngineService = {
  calendar: calendarService,
  events: eventService,
  scheduling: schedulingService,
  availability: availabilityService,
  timeZone: timeZoneService,
  travel: travelService,
  conflicts: conflictDetectionService,
  reservations: reservationCalendarService,
  reminders: reminderService,
  recurring: recurringEventService,
  deadlines: deadlineService,
  externalSync: externalSyncService,
  timeline: timelineService,
  intelligence: timeIntelligenceService,
  ai: aiSchedulingAdvisorService,
};
