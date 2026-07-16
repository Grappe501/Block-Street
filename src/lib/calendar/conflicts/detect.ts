import type { CalendarEvent, ConflictState } from "../types";

export function eventsOverlap(a: CalendarEvent, b: CalendarEvent): boolean {
  if (!a.start_at || !a.end_at || !b.start_at || !b.end_at) return false;
  const aStart = new Date(a.start_at).getTime();
  const aEnd = new Date(a.end_at).getTime();
  const bStart = new Date(b.start_at).getTime();
  const bEnd = new Date(b.end_at).getTime();
  return aStart < bEnd && bStart < aEnd;
}

export function sharedScope(a: CalendarEvent, b: CalendarEvent): boolean {
  if (a.kelly_requested && b.kelly_requested) return true;
  const aScopes = new Set(a.calendar_scope_ids ?? []);
  for (const s of b.calendar_scope_ids ?? []) {
    if (aScopes.has(s)) return true;
  }
  if (a.college_slug && a.college_slug === b.college_slug) return true;
  if (a.county_slug && a.county_slug === b.county_slug) return true;
  return false;
}

export function inferConflictState(severity: "low" | "medium" | "high", kind: import("./types").ConflictKind): ConflictState {
  if (kind === "kelly_travel") return "possible_conflict";
  if (severity === "high") return "hard_conflict";
  if (severity === "medium") return "likely_conflict";
  return "possible_conflict";
}

export function detectScheduleOverlaps(events: CalendarEvent[]): {
  eventIds: [string, string];
  kind: import("./types").ConflictKind;
  summary: string;
  severity: "low" | "medium" | "high";
}[] {
  const found: {
    eventIds: [string, string];
    kind: import("./types").ConflictKind;
    summary: string;
    severity: "low" | "medium" | "high";
  }[] = [];
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];
      if (!eventsOverlap(a, b) || !sharedScope(a, b)) continue;
      const kind: import("./types").ConflictKind =
        a.kelly_requested && b.kelly_requested ? "candidate_schedule" : "schedule_overlap";
      const severity: "low" | "medium" | "high" =
        kind === "candidate_schedule" ? "high" : a.campaign_wide && b.campaign_wide ? "medium" : "low";
      found.push({
        eventIds: [a.event_id, b.event_id],
        kind,
        summary: `Schedule overlap: ${a.title} ↔ ${b.title}`,
        severity,
      });
    }
  }
  return found;
}
