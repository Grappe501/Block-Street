import type { CalendarRecurrenceRule } from "./types";
import { validateRecurrenceRule } from "./rules";

export function validateRecurrence(rule: CalendarRecurrenceRule, seriesStartDate: string, seriesEndDate?: string | null): string[] {
  const errors = [...validateRecurrenceRule(rule)];
  if (seriesEndDate && new Date(seriesEndDate) < new Date(seriesStartDate)) {
    errors.push("end date before start date");
  }
  return errors;
}

export function describeRecurrence(rule: CalendarRecurrenceRule, defaultStartTime: string): string {
  const time = defaultStartTime;
  if (rule.frequency === "daily") {
    return rule.interval === 1 ? `Every day at ${time}` : `Every ${rule.interval} days at ${time}`;
  }
  if (rule.frequency === "weekly") {
    const days = rule.daysOfWeek?.join(", ") ?? "week";
    return rule.interval === 1 ? `Every ${days} at ${time}` : `Every ${rule.interval} weeks on ${days} at ${time}`;
  }
  if (rule.frequency === "monthly") {
    if (rule.dayOfMonth) return `Monthly on day ${rule.dayOfMonth} at ${time}`;
    if (rule.monthDayPattern) return `Monthly on ${rule.monthDayPattern.week === -1 ? "last" : `week ${rule.monthDayPattern.week}`} ${rule.monthDayPattern.day} at ${time}`;
    return `Monthly at ${time}`;
  }
  return `Custom recurrence at ${time}`;
}
