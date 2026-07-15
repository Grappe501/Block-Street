import type { CalendarSeriesException } from "./types";

let exceptions: CalendarSeriesException[] = [];

export function listSeriesExceptions(seriesId?: string): CalendarSeriesException[] {
  return seriesId ? exceptions.filter((e) => e.seriesId === seriesId) : [...exceptions];
}

export function getExceptionForOccurrence(seriesId: string, occurrenceKey: string): CalendarSeriesException | null {
  return exceptions.find((e) => e.seriesId === seriesId && e.occurrenceKey === occurrenceKey) ?? null;
}

export function addSeriesException(exc: CalendarSeriesException): CalendarSeriesException {
  exceptions = [exc, ...exceptions.filter((e) => e.exceptionId !== exc.exceptionId)];
  return exc;
}

export function clearSeriesExceptionsForTest(): void {
  exceptions = [];
}

export function isOccurrenceCanceled(seriesId: string, occurrenceKey: string): boolean {
  const exc = getExceptionForOccurrence(seriesId, occurrenceKey);
  return exc?.type === "cancel";
}
