import type { CalendarEvent } from "../types";
import { eventsOverlap } from "./detect";

function sameIsoWeek(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  const weekA = getIsoWeek(da);
  const weekB = getIsoWeek(db);
  return weekA.year === weekB.year && weekA.week === weekB.week;
}

function getIsoWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

export function detectResourceOverlaps(events: CalendarEvent[]): {
  eventIds: [string, string];
  humanIds: string[];
  summary: string;
  severity: "low" | "medium" | "high";
}[] {
  const found: {
    eventIds: [string, string];
    humanIds: string[];
    summary: string;
    severity: "low" | "medium" | "high";
  }[] = [];
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];
      if (!eventsOverlap(a, b)) continue;
      const shared = (a.assigned_human_ids ?? []).filter((h) => (b.assigned_human_ids ?? []).includes(h));
      if (shared.length === 0) continue;
      found.push({
        eventIds: [a.event_id, b.event_id],
        humanIds: shared,
        summary: `Resource overlap: ${shared.join(", ")} assigned to "${a.title}" and "${b.title}"`,
        severity: "high",
      });
    }
  }
  return found;
}

export function detectKellyTravelBuffers(events: CalendarEvent[]): {
  eventIds: [string, string];
  summary: string;
  severity: "low" | "medium" | "high";
}[] {
  const found: {
    eventIds: [string, string];
    summary: string;
    severity: "low" | "medium" | "high";
  }[] = [];
  const kellyEvents = events.filter((e) => e.kelly_requested || e.travel_required);
  for (const kelly of kellyEvents) {
    for (const other of events) {
      if (other.event_id === kelly.event_id) continue;
      if (!sameIsoWeek(kelly.start_at, other.start_at)) continue;
      if (kelly.county_slug && other.county_slug && kelly.county_slug === other.county_slug) continue;
      const cities = [kelly.city, other.city].filter(Boolean);
      if (cities.length === 2 && cities[0] === cities[1]) continue;
      if (!other.campaign_wide && !other.kelly_requested && !other.travel_required) continue;
      found.push({
        eventIds: [kelly.event_id, other.event_id],
        summary: `Kelly travel buffer: "${kelly.title}" (${kelly.city ?? kelly.county_slug ?? "?"}) and "${other.title}" (${other.city ?? other.county_slug ?? "?"}) same week — review travel feasibility`,
        severity: "medium",
      });
    }
  }
  return found;
}
