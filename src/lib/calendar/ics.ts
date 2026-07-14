import type { CalendarEvent } from "./types";
import { allCanonicalEvents, listEventsForScope, publicKellyLabel } from "./events";

function icsEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function toIcsUtc(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

/** Public-safe ICS lines only — never include private Kelly travel/security. */
export function eventsToIcs(events: CalendarEvent[], calendarName: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Block Street//Universal Calendar Soft Beta//EN",
    `X-WR-CALNAME:${icsEscape(calendarName)}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const e of events) {
    if (!e.public_calendar_enabled || e.visibility !== "public") continue;
    const kelly = publicKellyLabel(e);
    const desc = [e.public_summary ?? e.short_description, kelly].filter(Boolean).join(" — ");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.event_id}@block-street`,
      `DTSTAMP:${toIcsUtc(e.updated_at)}`,
      `DTSTART:${toIcsUtc(e.start_at)}`,
      `DTEND:${toIcsUtc(e.end_at)}`,
      `SUMMARY:${icsEscape(e.title)}`,
      `DESCRIPTION:${icsEscape(desc)}`,
      e.location_name ? `LOCATION:${icsEscape(e.location_name)}` : "",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}

export function buildIcsCalendar(kind: "universal" | "college" | "county" | "kelly", slug?: string): string {
  if (kind === "kelly") {
    // Public Kelly view: only published + public-safe — never private candidate calendar.
    const events = allCanonicalEvents().filter(
      (e) =>
        e.public_calendar_enabled &&
        e.visibility === "public" &&
        e.kelly_attendance_status === "confirmed",
    );
    return eventsToIcs(events, "Block Street · Kelly appearances (public)");
  }
  if (kind === "college" && slug) {
    return eventsToIcs(listEventsForScope({ kind: "college", collegeSlug: slug }).filter((e) => e.visibility === "public"), `Block Street · ${slug}`);
  }
  if (kind === "county" && slug) {
    return eventsToIcs(listEventsForScope({ kind: "county", countySlug: slug }).filter((e) => e.visibility === "public"), `Block Street · ${slug} county`);
  }
  return eventsToIcs(listEventsForScope({ kind: "public" }), "Block Street · Universal calendar");
}
