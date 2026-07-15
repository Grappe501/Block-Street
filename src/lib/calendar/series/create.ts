import { buildCanonicalEvent } from "../canonical";
import { requireCalendarPermission } from "../rbac/guards";
import { emptyActor } from "../rbac/types";
import { generateOccurrences } from "../recurrence/generate";
import { describeRecurrence } from "../recurrence/describe";
import { getExceptionForOccurrence } from "../recurrence/exceptions";
import type { CalendarEventSeries } from "../recurrence/types";
import { appendProposedEvent } from "../events";
import { getEventSeriesById, saveEventSeries } from "./store";
import type { ApplyTemplateResult, CalendarEventDraft } from "../templates/types";
import type { CalendarEvent } from "../types";

function draftToSeed(draft: CalendarEventDraft, roles: ApplyTemplateResult["generatedVolunteerRoles"], eventId: string, extra?: Partial<Parameters<typeof buildCanonicalEvent>[0]>) {
  return buildCanonicalEvent({
    event_id: eventId,
    title: draft.title,
    description: draft.description,
    event_type: draft.event_type as import("../types").CalendarEventType,
    operational_status: "proposed",
    approval_status: "submitted",
    publication_status: draft.visibility === "public" ? "ready_to_publish" : "private_draft",
    start_at: draft.start_at,
    end_at: draft.end_at,
    location_name: draft.location_name ?? null,
    county_slug: draft.county_slug,
    college_slugs: draft.college_slugs,
    county_slugs: draft.county_slugs,
    city_slugs: draft.city_slugs,
    campaign_wide: draft.campaign_wide,
    visibility: draft.visibility === "public" ? "public" : draft.visibility === "private" ? "private" : "team",
    kelly_requested: draft.kelly_requested,
    kelly_attendance_status: draft.kelly_requested ? "requested" : "not_requested",
    owned_by_team: draft.owned_by_team,
    primary_contact: draft.primary_contact,
    volunteer_roles: roles.map((r, i) => ({
      role_id: r.roleKey || `tpl-role-${i}`,
      title: r.title,
      number_needed: r.numberNeeded,
      number_confirmed: 0,
      training_required: r.trainingRequired,
    })),
    template_id: draft.template_id,
    template_version: draft.template_version,
    template_applied_at: draft.template_applied_at,
    template_snapshot: draft.template_snapshot,
    template_readiness: draft.template_readiness,
    history: [{ at: new Date().toISOString(), note: "Created from template (soft-beta session-local)." }],
    ...extra,
  });
}

export function createEventFromTemplateApply(result: ApplyTemplateResult): CalendarEvent {
  if (result.blockedReasons.length) {
    throw new Error(result.blockedReasons.join(" "));
  }
  const draft = result.eventDraft;
  requireCalendarPermission({
    actor: emptyActor({
      authenticated: true,
      systemRoleKeys: draft.college_slugs.length ? ["college_leader"] : draft.county_slugs.length ? ["county_leader"] : ["volunteer_manager"],
      collegeSlugs: draft.college_slugs,
      countySlugs: draft.county_slugs,
      campaignWide: draft.campaign_wide,
    }),
    permission: "calendar.event.propose",
    resource: { collegeSlugs: draft.college_slugs, countySlugs: draft.county_slugs, operationalStatus: "draft", campaignWide: draft.campaign_wide },
    context: { route: "/calendar/templates/use", method: "POST", source: "server_action", isMutation: true },
    actualBehavior: "allowed",
  });
  const event = draftToSeed(draft, result.generatedVolunteerRoles, `evt-tpl-${Date.now()}`);
  return appendProposedEvent(event);
}

export type CreateSeriesInput = {
  title: string;
  description?: string;
  templateId?: string | null;
  templateVersion?: string | null;
  series: Omit<CalendarEventSeries, "seriesId" | "createdAt" | "updatedAt" | "ruleVersion">;
  applyResult?: ApplyTemplateResult;
};

export function createEventSeries(input: CreateSeriesInput): { series: CalendarEventSeries; events: CalendarEvent[] } {
  const seriesId = `ser-${Date.now()}`;
  const now = new Date().toISOString();
  const series: CalendarEventSeries = {
    ...input.series,
    seriesId,
    ruleVersion: "1.0.0",
    createdAt: now,
    updatedAt: now,
  };
  saveEventSeries(series);

  const occurrences = generateOccurrences(
    seriesId,
    series.recurrenceRule,
    series.seriesStartDate,
    series.defaultStartTime,
    series.defaultDurationMinutes,
  );

  const events: CalendarEvent[] = [];
  for (const occ of occurrences) {
    if (getExceptionForOccurrence(seriesId, occ.occurrenceKey)?.type === "cancel") continue;
    const draft = input.applyResult?.eventDraft;
    const roles = input.applyResult?.generatedVolunteerRoles ?? [];
    const event = draftToSeed(
      draft ?? {
        title: input.title,
        description: input.description ?? "",
        event_type: series.eventType,
        start_at: occ.startAt,
        end_at: occ.endAt,
        visibility: series.visibility,
        college_slugs: series.scope.collegeSlugs,
        county_slugs: series.scope.countySlugs,
        city_slugs: series.scope.citySlugs,
        campaign_wide: series.scope.campaignWide,
        kelly_requested: series.kellyRequested,
        template_id: input.templateId ?? "",
        template_version: input.templateVersion ?? "",
        template_applied_at: now,
        template_snapshot: {},
        template_readiness: { requiredDimensions: [], optionalDimensions: [], nonApplicableDimensions: [] },
        county_slug: series.scope.countySlugs[0] ?? null,
        owned_by_team: series.ownedByTeam ?? null,
        primary_contact: null,
      },
      roles,
      `evt-${seriesId}-${occ.seriesSequenceNumber}`,
      {
        series_id: seriesId,
        occurrence_key: occ.occurrenceKey,
        series_sequence_number: occ.seriesSequenceNumber,
        generated_from_series: true,
        series_rule_version: series.ruleVersion,
        history: [{ at: now, note: `Series occurrence ${occ.seriesSequenceNumber} — ${describeRecurrence(series.recurrenceRule, series.defaultStartTime)}` }],
      },
    );
    events.push(appendProposedEvent(event));
  }

  return { series, events };
}

export function listEventsForSeries(seriesId: string, allEvents: CalendarEvent[]): CalendarEvent[] {
  return allEvents.filter((e) => e.series_id === seriesId).sort((a, b) => (a.series_sequence_number ?? 0) - (b.series_sequence_number ?? 0));
}

/** Split series at an occurrence — prior history preserved, future events use a forked series. */
export function splitSeriesAtOccurrence(seriesId: string, occurrenceKey: string): { original: CalendarEventSeries; fork: CalendarEventSeries } {
  const original = getEventSeriesById(seriesId);
  if (!original) throw new Error("Series not found");
  const datePart = occurrenceKey.split(":")[1]?.slice(0, 8) ?? original.seriesStartDate.replace(/-/g, "");
  const isoDate = `${datePart.slice(0, 4)}-${datePart.slice(4, 6)}-${datePart.slice(6, 8)}`;
  const now = new Date().toISOString();
  const forkId = `${seriesId}-fork-${Date.now()}`;
  const updatedOriginal: CalendarEventSeries = {
    ...original,
    seriesEndDate: isoDate,
    updatedAt: now,
  };
  const fork: CalendarEventSeries = {
    ...original,
    seriesId: forkId,
    parentSeriesId: seriesId,
    seriesStartDate: isoDate,
    seriesEndDate: original.seriesEndDate,
    ruleVersion: "1.0.1",
    createdAt: now,
    updatedAt: now,
  };
  saveEventSeries(updatedOriginal);
  saveEventSeries(fork);
  return { original: updatedOriginal, fork };
}
