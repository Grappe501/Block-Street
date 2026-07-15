import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";
import { TemplateUseForm } from "@/components/calendar/templates/TemplateUseForm";
import { applyTemplate, getActiveTemplateForUse } from "@/lib/calendar/templates";
import { createEventFromTemplateApply, createEventSeries } from "@/lib/calendar/series";

async function submitTemplateUse(templateId: string, data: Record<string, string>) {
  "use server";
  const template = getActiveTemplateForUse(templateId);
  if (!template) throw new Error("Template not available.");
  const collegeSlug = data.collegeSlug?.trim();
  const countySlug = data.countySlug?.trim();
  const result = applyTemplate({
    template,
    scopeSelection: {
      collegeSlugs: collegeSlug ? [collegeSlug] : [],
      countySlugs: countySlug ? [countySlug] : [],
      citySlugs: [],
      teamIds: [],
      campaignWide: data.campaignWide === "yes",
    },
    overrides: {
      title: data.title,
      start_at: data.start_at ? new Date(data.start_at).toISOString() : undefined,
      location_name: data.location,
      owned_by_team: data.owned_by_team,
      kelly_requested: data.kelly_requested === "yes",
    },
  });
  if (data.mode === "series") {
    const interval = data.recurrence === "biweekly" ? 2 : 1;
    const { series } = createEventSeries({
      title: data.title || template.name,
      templateId: template.templateId,
      templateVersion: template.version,
      applyResult: result,
      series: {
        title: data.title || template.name,
        templateId: template.templateId,
        templateVersion: template.version,
        recurrenceRule: {
          frequency: data.recurrence === "monthly" ? "monthly" : "weekly",
          interval,
          daysOfWeek: data.recurrence === "weekly" || data.recurrence === "biweekly" ? ["MO"] : undefined,
          dayOfMonth: data.recurrence === "monthly" ? 15 : null,
          monthDayPattern: null,
          until: null,
          count: 12,
        },
        timezone: "America/Chicago",
        seriesStartDate: (data.start_at || new Date().toISOString()).slice(0, 10),
        defaultStartTime: "18:00",
        defaultDurationMinutes: template.defaults.durationMinutes,
        scope: {
          collegeSlugs: collegeSlug ? [collegeSlug] : [],
          countySlugs: countySlug ? [countySlug] : [],
          citySlugs: [],
          teamIds: [],
          campaignWide: data.campaignWide === "yes",
        },
        status: "active",
        eventType: template.eventType,
        visibility: template.defaults.visibility === "public" ? "public" : "internal",
        kellyRequested: data.kelly_requested === "yes",
        ownedByTeam: data.owned_by_team ?? null,
      },
    });
    return { seriesId: series.seriesId };
  }
  const event = createEventFromTemplateApply(result);
  return { eventId: event.event_id };
}

export default async function TemplateUsePage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getActiveTemplateForUse(templateId);
  if (!template) notFound();

  return (
    <CalendarChrome title={`Use · ${template.name}`} subtitle="Multi-step soft-beta creation flow" nav={<CalendarNav />} backHref={`/calendar/templates/${templateId}`} backLabel="Template">
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <TemplateUseForm template={template} action={(data) => submitTemplateUse(templateId, data)} />
    </CalendarChrome>
  );
}
