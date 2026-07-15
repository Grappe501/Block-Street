import type { CalendarEventSeries } from "../recurrence/types";

let seriesStore: CalendarEventSeries[] = [];

export function listEventSeries(): CalendarEventSeries[] {
  return [...seriesStore];
}

export function getEventSeriesById(seriesId: string): CalendarEventSeries | null {
  return seriesStore.find((s) => s.seriesId === seriesId || s.seriesId === seriesId) ?? null;
}

export function saveEventSeries(series: CalendarEventSeries): CalendarEventSeries {
  seriesStore = [series, ...seriesStore.filter((s) => s.seriesId !== series.seriesId)];
  return series;
}

export function clearSeriesStoreForTest(): void {
  seriesStore = [];
}

export function listSeriesNeedingAttention(): CalendarEventSeries[] {
  return seriesStore.filter((s) => s.status === "active" && !s.ownerRoleKey && !s.ownedByTeam);
}
