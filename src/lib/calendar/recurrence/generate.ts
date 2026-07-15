import type { CalendarRecurrenceRule, CalendarWeekday } from "./types";
import { weekdayIndex } from "./rules";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function buildOccurrenceKey(seriesId: string, startAt: string): string {
  const d = new Date(startAt);
  return `${seriesId}:${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
}

function parseDateParts(isoDate: string, time: string, tzOffset = "-05:00"): string {
  const [h, m] = time.split(":");
  return `${isoDate}T${h.padStart(2, "0")}:${(m ?? "00").padStart(2, "0")}:00${tzOffset}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function nthWeekdayOfMonth(year: number, month: number, week: number, day: CalendarWeekday): Date | null {
  const target = weekdayIndex(day);
  const first = new Date(Date.UTC(year, month, 1));
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const cur = new Date(Date.UTC(year, month, d));
    if (cur.getUTCMonth() !== month) break;
    if (cur.getUTCDay() === target) {
      count++;
      if (week === -1) {
        /* last — keep going */
      }
      if (count === week) return cur;
    }
  }
  if (week === -1) {
    for (let d = 31; d >= 1; d--) {
      const cur = new Date(Date.UTC(year, month, d));
      if (cur.getUTCMonth() !== month) continue;
      if (cur.getUTCDay() === target) return cur;
    }
  }
  return null;
}

export function generateOccurrences(
  seriesId: string,
  rule: CalendarRecurrenceRule,
  seriesStartDate: string,
  defaultStartTime: string,
  durationMinutes: number,
  options: { previewHorizonDays?: number; maxOccurrences?: number; fromDate?: string } = {},
): import("./types").GeneratedOccurrence[] {
  const horizonDays = options.previewHorizonDays ?? 90;
  const maxOcc = options.maxOccurrences ?? 12;
  const from = new Date(options.fromDate ?? seriesStartDate);
  const until = rule.until ? new Date(rule.until) : addDays(from, horizonDays);
  const cap = rule.count ?? maxOcc;
  const limit = Math.min(cap, maxOcc);

  const results: import("./types").GeneratedOccurrence[] = [];
  const seen = new Set<string>();
  let seq = 0;

  function pushOccurrence(date: Date) {
    if (date < from || date > until || results.length >= limit) return;
    const dateStr = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
    const startAt = parseDateParts(dateStr, defaultStartTime);
    const endAt = new Date(new Date(startAt).getTime() + durationMinutes * 60_000).toISOString();
    const key = buildOccurrenceKey(seriesId, startAt);
    if (seen.has(key)) return;
    seen.add(key);
    seq++;
    results.push({
      occurrenceKey: key,
      seriesSequenceNumber: seq,
      startAt,
      endAt,
      previewOnly: true,
    });
  }

  if (rule.frequency === "monthly") {
    const start = new Date(seriesStartDate);
    let monthCursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
    while (results.length < limit && monthCursor <= until) {
      let target: Date | null = null;
      if (rule.dayOfMonth) {
        target = new Date(Date.UTC(monthCursor.getUTCFullYear(), monthCursor.getUTCMonth(), rule.dayOfMonth));
        if (target.getUTCMonth() !== monthCursor.getUTCMonth()) target = null;
      } else if (rule.monthDayPattern) {
        target = nthWeekdayOfMonth(monthCursor.getUTCFullYear(), monthCursor.getUTCMonth(), rule.monthDayPattern.week, rule.monthDayPattern.day);
      }
      if (target) pushOccurrence(target);
      monthCursor = new Date(Date.UTC(monthCursor.getUTCFullYear(), monthCursor.getUTCMonth() + rule.interval, 1));
      if (monthCursor.getTime() - from.getTime() > horizonDays * 864e5 && !rule.until) break;
    }
    return results;
  }

  let cursor = new Date(seriesStartDate);

  while (results.length < limit && cursor <= until) {
    let include = false;
    if (rule.frequency === "daily") {
      include = true;
    } else if (rule.frequency === "weekly") {
      const dow = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][cursor.getUTCDay()] as CalendarWeekday;
      include = !rule.daysOfWeek?.length || rule.daysOfWeek.includes(dow);
      if (rule.interval > 1) {
        const weeks = Math.floor((cursor.getTime() - from.getTime()) / (7 * 864e5));
        include = include && weeks % rule.interval === 0;
      }
    } else {
      include = true;
    }

    if (include && cursor >= from) {
      pushOccurrence(cursor);
    }

    if (rule.frequency === "daily") cursor = addDays(cursor, rule.interval);
    else if (rule.frequency === "weekly") cursor = addDays(cursor, 1);
    else cursor = addDays(cursor, 1);

    if (results.length >= limit) break;
    if (cursor > until) break;
    if (cursor.getTime() - from.getTime() > horizonDays * 864e5 && !rule.until) break;
  }

  return results;
}
