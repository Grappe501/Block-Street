import type { CalendarEvent } from "../types";
import type { EventReadinessItem } from "../operations/types";
import { buildLifecycleSummary } from "./checklist";
import { ensureLifecycleFromEvent } from "./template-integration";
import { isLifecycleItemReady } from "./status";
import { listLifecycleItems } from "./store";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

export function evaluateApprovalReadiness(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/lifecycle");
  if (event.visibility === "private" && (!event.approval_status || event.approval_status === "not_submitted")) {
    return {
      dimension: "approval",
      state: "not_required",
      label: "Approval",
      explanation: "Private event — calendar approval path not required.",
      route,
    };
  }

  ensureLifecycleFromEvent(event);
  const status = event.approval_status ?? "not_submitted";
  const summary = buildLifecycleSummary(event.event_id, event.operational_status, status);
  const blocking = listLifecycleItems({ eventId: event.event_id, category: "approval" }).filter(
    (i) => i.required && i.blocksReadiness && !isLifecycleItemReady(i.itemStatus),
  );

  if (status === "approved" || status === "conditionally_approved") {
    return {
      dimension: "approval",
      state: blocking.length === 0 ? "ready" : "in_progress",
      label: "Approval",
      explanation: `Calendar approval satisfied (${status}). Separate from venue/legal verification.`,
      route: eventRoute(event.event_id, "/approvals"),
    };
  }

  if (status === "rejected" || status === "approval_withdrawn") {
    return {
      dimension: "approval",
      state: "blocked",
      label: "Approval",
      explanation: `Calendar approval ${status}.`,
      blocker: "Resolve approval before proceeding.",
      route: eventRoute(event.event_id, "/approvals"),
    };
  }

  if (status === "revision_requested") {
    return {
      dimension: "approval",
      state: blocking.length > 0 ? "blocked" : "in_progress",
      label: "Approval",
      explanation: "Revision requested — calendar approval path only.",
      blocker: blocking[0]?.label ?? null,
      route: eventRoute(event.event_id, "/approvals"),
    };
  }

  if (status === "submitted" || status === "under_review" || status === "pending") {
    return {
      dimension: "approval",
      state: "in_progress",
      label: "Approval",
      explanation: `Calendar approval in review (${status}). Not venue or legal approval.`,
      route: eventRoute(event.event_id, "/approvals"),
    };
  }

  if (blocking.length > 0) {
    return {
      dimension: "approval",
      state: "not_started",
      label: "Approval",
      explanation: summary.primaryGap ?? "No approval submission on record.",
      route: eventRoute(event.event_id, "/approvals"),
    };
  }

  return {
    dimension: "approval",
    state: "not_started",
    label: "Approval",
    explanation: "No approval submission on record.",
    route: eventRoute(event.event_id, "/approvals"),
  };
}
