export type CalendarRecurrenceFrequency = "daily" | "weekly" | "monthly" | "custom";

export type CalendarWeekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";

export type CalendarRecurrenceRule = {
  frequency: CalendarRecurrenceFrequency;
  interval: number;
  daysOfWeek?: CalendarWeekday[];
  dayOfMonth?: number | null;
  weekOfMonth?: 1 | 2 | 3 | 4 | 5 | -1 | null;
  monthDayPattern?: {
    week: 1 | 2 | 3 | 4 | 5 | -1;
    day: CalendarWeekday;
  } | null;
  until?: string | null;
  count?: number | null;
};

export type CalendarEventSeries = {
  seriesId: string;
  title: string;
  description?: string;
  templateId?: string | null;
  templateVersion?: string | null;
  recurrenceRule: CalendarRecurrenceRule;
  timezone: string;
  seriesStartDate: string;
  seriesEndDate?: string | null;
  occurrenceLimit?: number | null;
  defaultStartTime: string;
  defaultDurationMinutes: number;
  scope: {
    collegeSlugs: string[];
    countySlugs: string[];
    citySlugs: string[];
    teamIds: string[];
    campaignWide: boolean;
  };
  ownerUserId?: string | null;
  ownerRoleKey?: string | null;
  ownedByTeam?: string | null;
  status: "draft" | "active" | "paused" | "completed" | "canceled";
  eventType: string;
  visibility: "public" | "internal" | "private" | "team";
  kellyRequested: boolean;
  ruleVersion: string;
  parentSeriesId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CalendarSeriesExceptionType = "cancel" | "reschedule" | "override";

export type CalendarSeriesException = {
  exceptionId: string;
  seriesId: string;
  occurrenceKey: string;
  eventId?: string | null;
  type: CalendarSeriesExceptionType;
  changes: Record<string, unknown>;
  reason: string;
  createdBy: string | null;
  createdAt: string;
};

export type GeneratedOccurrence = {
  occurrenceKey: string;
  seriesSequenceNumber: number;
  startAt: string;
  endAt: string;
  previewOnly: boolean;
};

export type OccurrenceGenerationOptions = {
  previewHorizonDays?: number;
  maxOccurrences?: number;
  fromDate?: string;
};
