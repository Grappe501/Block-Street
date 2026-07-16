import type { CalendarEvent } from "../types";
import { createLifecycleItem } from "./items";
import { seedHistoryFromEvent } from "./history";
import { isLifecycleItemReady } from "./status";
import { listLifecycleItems } from "./store";

function approvalRequiredForEvent(event: CalendarEvent): boolean {
  if (event.visibility === "private") return false;
  if (event.approval_status && event.approval_status !== "not_submitted") return true;
  return event.campaign_calendar_enabled || event.college_calendar_enabled || event.county_calendar_enabled;
}

function approvalItemStatusForEvent(event: CalendarEvent, key: string): import("./types").LifecycleItemStatus {
  const status = event.approval_status ?? "not_submitted";
  if (status === "approved" || status === "conditionally_approved") return "ready";
  if (status === "rejected" || status === "approval_withdrawn") {
    return key === "revision-resolution" ? "blocked" : "not_applicable";
  }
  if (status === "revision_requested") {
    if (key === "revision-resolution") return "in_progress";
    if (key === "calendar-approval") return "in_progress";
  }
  if (status === "submitted" || status === "under_review" || status === "pending") {
    if (key === "submit-for-approval") return "ready";
    if (key === "scope-review" || key === "calendar-approval") return "in_progress";
  }
  if (status === "not_submitted" || status === null) {
    if (key === "submit-for-approval") return "not_started";
  }
  return "not_started";
}

function operationalItemStatusForEvent(event: CalendarEvent, key: string): import("./types").LifecycleItemStatus {
  const status = event.operational_status;
  if (key === "schedule-lock" && ["scheduled", "confirmed", "in_progress", "completed"].includes(status)) {
    return "ready";
  }
  if (key === "confirm-event" && ["confirmed", "in_progress", "completed"].includes(status)) return "ready";
  if (key === "mark-complete" && status === "completed") return "ready";
  if (key === "confirm-event" && status === "scheduled") return "in_progress";
  if (key === "mark-complete" && status === "in_progress") return "in_progress";
  return "not_started";
}

function publicationItemStatusForEvent(event: CalendarEvent): import("./types").LifecycleItemStatus {
  if (event.publication_status === "published" || event.publication_status === "scheduled_for_publication") {
    return "ready";
  }
  if (event.publication_status === "ready_to_publish") return "in_progress";
  if (event.visibility !== "public") return "not_applicable";
  return "not_started";
}

export function ensureLifecycleFromEvent(event: CalendarEvent): import("./types").CalendarEventLifecycleItem[] {
  seedHistoryFromEvent(event);
  const existing = listLifecycleItems({ eventId: event.event_id });
  if (existing.length > 0) return existing;

  const created: import("./types").CalendarEventLifecycleItem[] = [];
  if (approvalRequiredForEvent(event)) {
    const approvalKeys = [
      { key: "submit-for-approval", label: "Submit calendar approval package" },
      { key: "scope-review", label: "Scope and calendar placement review" },
      { key: "calendar-approval", label: "Calendar approval decision recorded" },
      { key: "revision-resolution", label: "Resolve revision requests", required: false },
    ];
    for (const row of approvalKeys) {
      created.push(
        createLifecycleItem({
          eventId: event.event_id,
          category: "approval",
          itemKey: row.key,
          label: row.label,
          required: row.required !== false,
          blocksReadiness: row.key !== "revision-resolution",
          approvalSnapshot: event.approval_status,
          generatedFromEvent: true,
          initialStatus: approvalItemStatusForEvent(event, row.key),
        }),
      );
    }
  }

  const operationalKeys = [
    { key: "schedule-lock", label: "Schedule locked on canonical record" },
    { key: "confirm-event", label: "Operational confirmation recorded" },
    { key: "mark-complete", label: "Post-event completion recorded", required: false },
  ];
  for (const row of operationalKeys) {
    created.push(
      createLifecycleItem({
        eventId: event.event_id,
        category: "operational",
        itemKey: row.key,
        label: row.label,
        required: row.required !== false,
        blocksReadiness: row.key === "schedule-lock",
        operationalSnapshot: event.operational_status,
        generatedFromEvent: true,
        initialStatus: operationalItemStatusForEvent(event, row.key),
      }),
    );
  }

  if (event.visibility === "public") {
    created.push(
      createLifecycleItem({
        eventId: event.event_id,
        category: "publication",
        itemKey: "publish-ready",
        label: "Publication readiness satisfied",
        required: true,
        blocksReadiness: false,
        generatedFromEvent: true,
        initialStatus: publicationItemStatusForEvent(event),
      }),
    );
  }

  return created;
}

export function listEventsNeedingLifecycleAction(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter((e) => {
    ensureLifecycleFromEvent(e);
    const items = listLifecycleItems({ eventId: e.event_id });
    const incomplete = items.filter((i) => i.required && !isLifecycleItemReady(i.itemStatus));
    const pendingApproval = ["submitted", "under_review", "pending", "revision_requested"].includes(
      String(e.approval_status),
    );
    const pastIncomplete =
      new Date(e.end_at) < new Date() &&
      e.operational_status !== "completed" &&
      e.operational_status !== "canceled";
    return incomplete.length > 0 || pendingApproval || pastIncomplete;
  });
}
