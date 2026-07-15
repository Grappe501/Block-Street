import type { ApplyTemplateInput, ApplyTemplateResult, CalendarEventDraft } from "./types";

function addMinutes(iso: string, minutes: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

export function applyTemplate(input: ApplyTemplateInput): ApplyTemplateResult {
  const { template, scopeSelection, overrides } = input;
  const warnings: string[] = [];
  const blockedReasons: string[] = [];

  if (template.status === "retired") blockedReasons.push("Template is retired.");
  if (scopeSelection.collegeSlugs.length && !template.recommendedFor.college) {
    blockedReasons.push("Template not recommended for college scope.");
  }
  if (scopeSelection.countySlugs.length && !template.recommendedFor.county) {
    blockedReasons.push("Template not recommended for county scope.");
  }
  if (scopeSelection.citySlugs.length && !template.recommendedFor.city) {
    blockedReasons.push("Template not recommended for city scope.");
  }
  if (scopeSelection.campaignWide && !template.recommendedFor.campaignWide) {
    warnings.push("Template not primarily campaign-wide — proceeding with override.");
  }

  const start = overrides.start_at ?? new Date().toISOString();
  const end = overrides.end_at ?? addMinutes(start, template.defaults.durationMinutes);

  const kellyRequested =
    overrides.kelly_requested ??
    (template.defaults.candidateAttendance === "required" || template.defaults.candidateAttendance === "recommended");

  if (template.defaults.candidateAttendance === "required" && !kellyRequested) {
    warnings.push("Template recommends candidate involvement — confirm Kelly request separately.");
  }

  warnings.push("Soft-beta draft — not durable until Gate A closes.");
  warnings.push("Templates do not confirm Kelly, assign volunteers, or publish events.");

  const eventDraft: CalendarEventDraft = {
    title: overrides.title ?? template.name,
    description: overrides.description ?? template.fullDescription,
    event_type: template.eventType,
    start_at: start,
    end_at: end,
    visibility: overrides.visibility ?? (template.defaults.visibility === "public" ? "public" : template.defaults.visibility === "private" ? "private" : "team"),
    location_name: overrides.location_name ?? null,
    city: null,
    county_slug: scopeSelection.countySlugs[0] ?? null,
    college_slugs: scopeSelection.collegeSlugs,
    county_slugs: scopeSelection.countySlugs,
    city_slugs: scopeSelection.citySlugs,
    campaign_wide: scopeSelection.campaignWide,
    owned_by_team: overrides.owned_by_team ?? template.ownership.owningTeamKeys[0] ?? null,
    primary_contact: overrides.primary_contact ?? null,
    kelly_requested: kellyRequested,
    template_id: template.templateId,
    template_version: template.version,
    template_applied_at: new Date().toISOString(),
    template_snapshot: {
      name: template.name,
      version: template.version,
      category: template.category,
      defaults: template.defaults,
      readiness: template.readiness,
    },
    template_readiness: template.readiness,
  };

  return {
    eventDraft,
    generatedTasks: template.tasks.map((t) => ({ ...t, generated: true as const })),
    generatedVolunteerRoles: template.volunteerRoles.map((r) => ({ ...r, generated: true as const })),
    generatedLogistics: template.logistics.map((l) => ({ ...l, generated: true as const })),
    generatedMaterials: template.materials.map((m) => ({ ...m, generated: true as const })),
    generatedPromotionItems: template.promotion.map((p) => ({ ...p, generated: true as const })),
    generatedReportRequirements: template.reportFields.map((f) => ({ ...f, generated: true as const })),
    warnings,
    blockedReasons,
  };
}

export function buildTemplatePreview(template: import("./types").CalendarEventTemplate) {
  return {
    template,
    automatic: ["Default duration", "Default visibility", "Volunteer role placeholders", "Task checklist", "Report field requirements"],
    suggested: template.tasks.filter((t) => !t.required).map((t) => t.title),
    required: template.tasks.filter((t) => t.required).map((t) => t.title),
    optional: template.volunteerRoles.filter((r) => !r.required).map((r) => r.title),
    notApplicable: template.readiness.nonApplicableDimensions,
    manualConfirmation: [
      "Kelly attendance",
      "Volunteer assignment",
      "Publication",
      "Campus/legal approval",
      "Durable persistence",
    ],
    softBeta: true,
  };
}
