import type { CalendarEventTemplate } from "./types";

export function validateTemplate(template: CalendarEventTemplate): string[] {
  const errors: string[] = [];
  if (!template.templateId) errors.push("missing templateId");
  if (!template.slug) errors.push("missing slug");
  if (!/^\d+\.\d+\.\d+$/.test(template.version)) errors.push("invalid version");
  if (!template.name) errors.push("missing name");
  if (template.defaults.durationMinutes <= 0) errors.push("duration must be positive");
  const scopes = template.recommendedFor;
  if (!scopes.campaignWide && !scopes.college && !scopes.county && !scopes.city && !scopes.team) {
    errors.push("at least one scope required");
  }
  if (template.reportFields.length === 0) errors.push("report expectations required");
  if (template.defaults.candidateAttendance === "required" && !template.candidateRequest) {
    errors.push("candidate template needs candidateRequest defaults");
  }
  for (const role of template.volunteerRoles) {
    if (role.numberNeeded < 0) errors.push(`invalid role count ${role.roleKey}`);
  }
  return errors;
}

export function validateTemplateRegistry(templates: CalendarEventTemplate[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const t of templates) {
    if (ids.has(t.templateId)) errors.push(`duplicate id ${t.templateId}`);
    if (slugs.has(t.slug)) errors.push(`duplicate slug ${t.slug}`);
    ids.add(t.templateId);
    slugs.add(t.slug);
    errors.push(...validateTemplate(t).map((e) => `${t.templateId}: ${e}`));
    if (t.status === "retired") {
      /* retired ok in registry */
    }
  }
  return errors;
}
