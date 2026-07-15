import { TEMPLATE_CATALOG } from "./catalog";
import type { CalendarEventTemplate, TemplateFilter } from "./types";

export function listTemplates(filter: TemplateFilter = {}): CalendarEventTemplate[] {
  const status = filter.status ?? "active";
  return TEMPLATE_CATALOG.filter((t) => {
    if (status === "active" && t.status !== "active") return false;
    if (status === "retired" && t.status !== "retired") return false;
    if (status === "draft" && t.status !== "draft") return false;
    if (filter.category && t.category !== filter.category) return false;
    if (filter.collegeSlug && !t.recommendedFor.college) return false;
    if (filter.countySlug && !t.recommendedFor.county) return false;
    if (filter.campaignWide !== undefined && t.recommendedFor.campaignWide !== filter.campaignWide) return false;
    if (filter.candidateInvolvement !== undefined) {
      const hasCandidate = t.defaults.candidateAttendance !== "not_applicable";
      if (filter.candidateInvolvement !== hasCandidate) return false;
    }
    if (filter.volunteerNeed !== undefined) {
      const needs = t.volunteerRoles.length > 0;
      if (filter.volunteerNeed !== needs) return false;
    }
    if (filter.visibility && t.defaults.visibility !== filter.visibility) return false;
    if (filter.recurringSuitable !== undefined && t.recurringSuitable !== filter.recurringSuitable) return false;
    if (filter.eventType && t.eventType !== filter.eventType) return false;
    if (filter.keyword) {
      const hay = `${t.name} ${t.shortDescription} ${t.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(filter.keyword.toLowerCase())) return false;
    }
    return true;
  });
}

export function getTemplateById(templateId: string): CalendarEventTemplate | null {
  return TEMPLATE_CATALOG.find((t) => t.templateId === templateId || t.slug === templateId) ?? null;
}

export function getActiveTemplateForUse(templateId: string): CalendarEventTemplate | null {
  const t = getTemplateById(templateId);
  if (!t || t.status === "retired") return null;
  return t;
}

export function assertUniqueTemplateIds(): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const t of TEMPLATE_CATALOG) {
    if (seen.has(t.templateId)) dupes.push(t.templateId);
    seen.add(t.templateId);
  }
  return dupes;
}

export function assertUniqueTemplateSlugs(): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const t of TEMPLATE_CATALOG) {
    if (seen.has(t.slug)) dupes.push(t.slug);
    seen.add(t.slug);
  }
  return dupes;
}

export { TEMPLATE_CATALOG };
