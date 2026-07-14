import type { CalendarEvent, MonthGridCell } from "./types";

export function getMonthGrid(year: number, month: number, events: CalendarEvent[]): MonthGridCell[][] {
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();

  const cells: MonthGridCell[] = [];
  for (let i = 0; i < startDay; i++) {
    const day = prevMonthDays - startDay + i + 1;
    const date = new Date(year, month - 2, day);
    cells.push({ date: date.toISOString().slice(0, 10), inMonth: false, events: eventsForDay(events, date) });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    cells.push({ date: date.toISOString().slice(0, 10), inMonth: true, events: eventsForDay(events, date) });
  }
  while (cells.length % 7 !== 0) {
    const day = cells.length - (startDay + daysInMonth) + 1;
    const date = new Date(year, month, day);
    cells.push({ date: date.toISOString().slice(0, 10), inMonth: false, events: eventsForDay(events, date) });
  }

  const weeks: MonthGridCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function eventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const day = date.toISOString().slice(0, 10);
  return events.filter((e) => e.start_at.slice(0, 10) === day);
}

export function getWeekRange(anchor = new Date()): { start: string; end: string } {
  const d = new Date(anchor);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}
