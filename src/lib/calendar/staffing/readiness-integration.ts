import type { CalendarEvent } from "../types";
import type { EventReadinessItem, EventReadinessState } from "../operations/types";
import { calculateEventStaffingSummary } from "./coverage";
import { ensureStaffingFromEvent } from "./template-integration";
import { listShifts } from "./store";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

export function evaluateStaffingReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem {
  const route = eventRoute(event.event_id, "/staffing");
  const tr = event.template_readiness;
  if (tr?.nonApplicableDimensions.includes("staffing")) {
    return {
      dimension: "staffing",
      state: "not_required",
      label: "Staffing",
      explanation: "Not required for this event template.",
      route,
    };
  }

  ensureStaffingFromEvent(event);
  const summary = calculateEventStaffingSummary(event.event_id);
  const hoursUntil = (new Date(event.start_at).getTime() - now.getTime()) / 36e5;

  if (summary.requirementCount === 0 && event.volunteers_needed === 0 && event.volunteer_roles.length === 0) {
    return {
      dimension: "staffing",
      state: "not_required",
      label: "Staffing",
      explanation: "No volunteers required for this event.",
      route,
    };
  }

  if (summary.requirementCount === 0 || summary.shiftCount === 0) {
    return {
      dimension: "staffing",
      state: "not_started",
      label: "Staffing",
      explanation: summary.requirementCount === 0
        ? "Volunteer staffing requirements not defined. Interest ≠ confirmation."
        : "Requirements exist but no shifts created yet. Interest ≠ confirmation.",
      route: eventRoute(event.event_id, summary.requirementCount === 0 ? "/staffing/requirements" : "/shifts/new"),
    };
  }

  if (summary.overallStatus === "critical_shortage" && hoursUntil <= 72 && hoursUntil >= 0) {
    return {
      dimension: "staffing",
      state: "blocked",
      label: "Staffing",
      explanation: "Critical volunteer shortage within 72 hours. Interest ≠ confirmation.",
      blocker: "Fill critical roles or adjust event scope.",
      route: eventRoute(event.event_id, "/staffing/coverage"),
    };
  }

  if (summary.shiftsMissingLead > 0 && hoursUntil <= 48 && hoursUntil >= 0) {
    return {
      dimension: "staffing",
      state: "blocked",
      label: "Staffing",
      explanation: "Required shift lead not accepted. Invited ≠ accepted.",
      blocker: "Assign or accept a shift lead.",
      route: eventRoute(event.event_id, "/staffing/leads"),
    };
  }

  if (summary.shiftsWithTrainingGap > 0 && summary.confirmedPositions > 0) {
    return {
      dimension: "staffing",
      state: "blocked",
      label: "Staffing",
      explanation: "Confirmed headcount present but training gaps remain.",
      blocker: "Resolve training requirements before event.",
      route: eventRoute(event.event_id, "/staffing/training"),
    };
  }

  if (summary.overallStatus === "fully_staffed") {
    return {
      dimension: "staffing",
      state: "ready",
      label: "Staffing",
      explanation: `${summary.confirmedPositions}/${summary.targetPositions} confirmed (soft-beta). Interest ≠ assignment.`,
      route,
    };
  }

  if (summary.overallStatus === "minimum_staffed") {
    return {
      dimension: "staffing",
      state: "in_progress",
      label: "Staffing",
      explanation: `Minimum covered (${summary.confirmedPositions}/${summary.requiredPositions}); below target (${summary.targetPositions}).`,
      route: eventRoute(event.event_id, "/staffing/coverage"),
    };
  }

  return {
    dimension: "staffing",
    state: "in_progress",
    label: "Staffing",
    explanation: `${summary.confirmedPositions} confirmed · ${summary.totalInterestCount} interested. Interest ≠ confirmation.`,
    route: eventRoute(event.event_id, "/staffing/coverage"),
  };
}

export function evaluateTasksReadiness(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/staffing");
  if (event.operational_status === "completed" || event.operational_status === "canceled") {
    return {
      dimension: "tasks",
      state: "not_required",
      label: "Tasks",
      explanation: "Event closed — task tracking not required.",
      route,
    };
  }
  const shifts = listShifts(event.event_id);
  if (shifts.length > 0) {
    return {
      dimension: "tasks",
      state: "in_progress",
      label: "Tasks",
      explanation: `${shifts.length} shift(s) defined. Shift builder active (CAL-P2 Wave 2A).`,
      route: eventRoute(event.event_id, "/shifts"),
    };
  }
  return {
    dimension: "tasks",
    state: "not_started",
    label: "Tasks",
    explanation: "Awaiting shift creation from staffing requirements.",
    route: eventRoute(event.event_id, "/shifts/new"),
  };
}

export function staffingStatusForEvent(eventId: string): EventReadinessState {
  const summary = calculateEventStaffingSummary(eventId);
  if (summary.overallStatus === "fully_staffed") return "ready";
  if (summary.overallStatus === "critical_shortage") return "blocked";
  if (summary.overallStatus === "no_plan") return "not_started";
  return "in_progress";
}
