import { listEventsForScope, publicKellyLabel } from "./events";
import { listAllConflictRecords } from "./conflicts/template-integration";
import type { CalendarConflict, CalendarScope, KellyRequest, PendingApproval, VolunteerNeed } from "./types";

export function listConflicts(): CalendarConflict[] {
  return listAllConflictRecords().map((r) => ({
    conflict_id: r.conflictId,
    event_ids: r.eventIds,
    summary: r.summary,
    severity: r.severity,
    state: r.state,
  }));
}

export function listVolunteerNeeds(scope: CalendarScope = { kind: "volunteer" }): VolunteerNeed[] {
  const needs: VolunteerNeed[] = [];
  for (const e of listEventsForScope(scope.kind === "public" ? { kind: "volunteer" } : scope)) {
    if (e.volunteer_roles.length) {
      for (const role of e.volunteer_roles) {
        const open = Math.max(0, role.number_needed - role.number_confirmed);
        if (open <= 0) continue;
        needs.push({
          event_id: e.event_id,
          role: role.title,
          role_id: role.role_id,
          slots_open: open,
          slots_filled: role.number_confirmed,
          training_required: role.training_required,
          event_title: e.title,
          start_at: e.start_at,
          college_slug: e.college_slug,
          county_slug: e.county_slug,
        });
      }
    } else if (e.volunteer_slots_open > 0) {
      needs.push({
        event_id: e.event_id,
        role: "Event support",
        slots_open: e.volunteer_slots_open,
        slots_filled: e.volunteer_slots_filled,
        event_title: e.title,
        start_at: e.start_at,
        college_slug: e.college_slug,
        county_slug: e.county_slug,
      });
    }
  }
  return needs;
}

export function listKellyRequests(scope: CalendarScope = { kind: "kelly" }): KellyRequest[] {
  return listEventsForScope(scope)
    .filter((e) => e.kelly_attendance_status && e.kelly_attendance_status !== "not_requested")
    .map((e) => ({
      event_id: e.event_id,
      status: e.kelly_status ?? "request",
      title: e.title,
      city: e.city,
      county_slug: e.county_slug,
      start_time: e.start_at,
      public_safe_label: publicKellyLabel(e) ?? undefined,
    }));
}

export function listPendingApprovals(scope: CalendarScope = { kind: "command" }): PendingApproval[] {
  return listEventsForScope(scope)
    .filter((e) =>
      ["pending", "submitted", "under_review", "revision_requested"].includes(String(e.approval_status)),
    )
    .map((e) => ({
      event_id: e.event_id,
      title: e.title,
      proposed_by: e.college_slug
        ? `College: ${e.college_slug}`
        : e.county_slug
          ? `County: ${e.county_slug}`
          : "Campaign",
      submitted_at: e.submitted_at ?? e.history[0]?.at ?? e.start_at,
      stage: e.approval_stage,
    }));
}
