import type { CalendarRecurrenceRule, CalendarWeekday } from "./types";

const WEEKDAYS: CalendarWeekday[] = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

export function validateRecurrenceRule(rule: CalendarRecurrenceRule): string[] {
  const errors: string[] = [];
  if (!["daily", "weekly", "monthly", "custom"].includes(rule.frequency)) errors.push("invalid frequency");
  if (!rule.interval || rule.interval <= 0) errors.push("interval must be > 0");
  if (rule.count != null && rule.until) errors.push("count and until are contradictory");
  if (rule.count != null && rule.count <= 0) errors.push("count must be > 0");
  if (rule.frequency === "weekly" && rule.daysOfWeek?.length) {
    for (const d of rule.daysOfWeek) {
      if (!WEEKDAYS.includes(d)) errors.push(`invalid weekday ${d}`);
    }
  }
  if (rule.dayOfMonth != null && (rule.dayOfMonth < 1 || rule.dayOfMonth > 31)) errors.push("invalid dayOfMonth");
  return errors;
}

export function weekdayIndex(day: CalendarWeekday): number {
  return WEEKDAYS.indexOf(day);
}
