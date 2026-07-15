import type { CalendarEvent } from "../types";
import type { CalendarEventTemplate } from "../templates/types";
import { getTemplateById } from "../templates/registry";
import { TEMPLATE_CATALOG } from "../templates/catalog";
import { createCandidateItem } from "./items";
import { listCandidateItems } from "./store";
import { attendanceFromEventStatus } from "./status";

const EVENT_TYPE_TEMPLATE: Record<string, string> = {
  networking_event: "tpl-campus-networking-event",
  candidate_appearance: "tpl-candidate-appearance",
};

function dueFromEventStart(event: CalendarEvent, daysBefore: number): string | null {
  if (!event.start_at) return null;
  const d = new Date(event.start_at);
  d.setDate(d.getDate() - daysBefore);
  return d.toISOString();
}

function seedFromTemplate(event: CalendarEvent, template: CalendarEventTemplate) {
  const snapshot = attendanceFromEventStatus(event.kelly_attendance_status ?? "not_requested");
  const req = template.candidateRequest;
  const created = [
    createCandidateItem({
      eventId: event.event_id,
      category: "request",
      itemKey: "submit-request",
      label: "Submit candidate attendance request",
      required: true,
      blocksReadiness: true,
      dueAt: dueFromEventStart(event, 21),
      attendanceSnapshot: snapshot,
      generatedFromTemplate: true,
      templateId: template.templateId,
      templateVersion: template.version,
    }),
    createCandidateItem({
      eventId: event.event_id,
      category: "request",
      itemKey: "role-scope",
      label: "Define candidate role and time window",
      required: true,
      blocksReadiness: true,
      dueAt: dueFromEventStart(event, 21),
      generatedFromTemplate: true,
      templateId: template.templateId,
      templateVersion: template.version,
    }),
  ];
  if (req?.briefingRequired) {
    created.push(
      createCandidateItem({
        eventId: event.event_id,
        category: "briefing",
        itemKey: "briefing-package",
        label: "Prepare candidate briefing package",
        required: true,
        blocksReadiness: true,
        dueAt: dueFromEventStart(event, 10),
        generatedFromTemplate: true,
        templateId: template.templateId,
        templateVersion: template.version,
      }),
    );
  }
  if (req?.travelReviewRequired || event.travel_required) {
    created.push(
      createCandidateItem({
        eventId: event.event_id,
        category: "travel",
        itemKey: "travel-review",
        label: "Review travel and arrival plan",
        required: true,
        blocksReadiness: true,
        dueAt: dueFromEventStart(event, 7),
        generatedFromTemplate: true,
        templateId: template.templateId,
        templateVersion: template.version,
      }),
    );
  }
  if (req?.publicLanguageApprovalRequired) {
    created.push(
      createCandidateItem({
        eventId: event.event_id,
        category: "communication",
        itemKey: "public-language",
        label: "Approve public language about attendance",
        required: true,
        blocksReadiness: true,
        dueAt: dueFromEventStart(event, 5),
        generatedFromTemplate: true,
        templateId: template.templateId,
        templateVersion: template.version,
      }),
    );
  }
  created.push(
    createCandidateItem({
      eventId: event.event_id,
      category: "confirmation",
      itemKey: "confirmation-recorded",
      label: "Record confirmation (request ≠ confirmation)",
      required: snapshot === "confirmed" || snapshot === "completed",
      blocksReadiness: snapshot === "confirmed" || snapshot === "completed",
      dueAt: dueFromEventStart(event, 3),
      attendanceSnapshot: snapshot,
      generatedFromTemplate: true,
      templateId: template.templateId,
      templateVersion: template.version,
    }),
  );
  return created;
}

export function ensureCandidateRequestFromEvent(event: CalendarEvent) {
  const existing = listCandidateItems({ eventId: event.event_id });
  if (existing.length > 0) return existing;
  if (!candidateRequestRequiredForEvent(event)) return [];

  const templateId = event.template_id ?? EVENT_TYPE_TEMPLATE[event.event_type] ?? null;
  if (templateId) {
    const template = getTemplateById(templateId) ?? TEMPLATE_CATALOG.find((t) => t.templateId === templateId);
    if (template) return seedFromTemplate(event, template);
  }

  const snapshot = attendanceFromEventStatus(event.kelly_attendance_status ?? "requested");
  return [
    createCandidateItem({
      eventId: event.event_id,
      category: "request",
      itemKey: "submit-request",
      label: "Submit candidate attendance request",
      required: true,
      blocksReadiness: true,
      dueAt: dueFromEventStart(event, 14),
      attendanceSnapshot: snapshot,
    }),
    createCandidateItem({
      eventId: event.event_id,
      category: "confirmation",
      itemKey: "confirmation-recorded",
      label: "Record confirmation (request ≠ confirmation)",
      required: false,
      blocksReadiness: false,
      attendanceSnapshot: snapshot,
    }),
  ];
}

export function candidateRequestRequiredForEvent(event: CalendarEvent): boolean {
  if (event.template_readiness?.nonApplicableDimensions?.includes("candidate")) return false;
  if (event.kelly_requested) return true;
  if (event.template_readiness?.requiredDimensions?.includes("candidate")) return true;
  if (event.template_readiness?.optionalDimensions?.includes("candidate")) return true;
  return event.event_type === "candidate_appearance";
}
