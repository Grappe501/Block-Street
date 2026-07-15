import type { CalendarEvent } from "../types";
import type { EventReadinessDimension, EventReadinessItem, EventReadinessState } from "./types";
import { evaluateStaffingReadiness, evaluateTasksReadiness } from "../staffing/readiness-integration";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

function isPreEvent(event: CalendarEvent, now: Date): boolean {
  return new Date(event.end_at) >= now && event.operational_status !== "completed" && event.operational_status !== "canceled";
}

function isPublicFacing(event: CalendarEvent): boolean {
  return event.visibility === "public" || event.publication_status === "published" || event.publication_status === "ready_to_publish";
}

function needsVolunteers(event: CalendarEvent): boolean {
  return event.volunteers_needed > 0 || event.volunteer_roles.length > 0;
}

function evaluateOwnership(event: CalendarEvent): EventReadinessItem {
  const owner = event.owned_by_team ?? event.primary_contact;
  if (!owner) {
    return {
      dimension: "ownership",
      state: "blocked",
      label: "Ownership",
      explanation: "No operational owner or owning team is assigned.",
      blocker: "Assign an event owner or campus team lead.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  return {
    dimension: "ownership",
    state: "ready",
    label: "Ownership",
    explanation: `Owner: ${owner}. Event Board oversight: ${event.volunteer_manager ?? "Carol Eagan"} (not operational ownership).`,
    route: eventRoute(event.event_id),
  };
}

function evaluateApproval(event: CalendarEvent): EventReadinessItem {
  const status = event.approval_status ?? "not_submitted";
  const route = eventRoute(event.event_id, "/approvals");
  if (status === "not_submitted" || status === null) {
    return {
      dimension: "approval",
      state: "not_started",
      label: "Approval",
      explanation: "No approval submission on record.",
      route,
    };
  }
  if (status === "submitted" || status === "under_review" || status === "pending") {
    return {
      dimension: "approval",
      state: "in_progress",
      label: "Approval",
      explanation: `Calendar approval in review (${status}). Not venue or legal approval.`,
      route,
    };
  }
  if (status === "revision_requested") {
    return {
      dimension: "approval",
      state: "in_progress",
      label: "Approval",
      explanation: "Revision requested — calendar approval path only.",
      route,
    };
  }
  if (status === "rejected" || status === "approval_withdrawn") {
    return {
      dimension: "approval",
      state: "blocked",
      label: "Approval",
      explanation: `Calendar approval ${status}.`,
      blocker: "Resolve approval before proceeding.",
      route,
    };
  }
  return {
    dimension: "approval",
    state: "ready",
    label: "Approval",
    explanation: `Calendar approval satisfied (${status}). Separate from venue/legal verification.`,
    route,
  };
}

function evaluateDateTime(event: CalendarEvent): EventReadinessItem {
  if (!event.start_at || !event.end_at) {
    return {
      dimension: "date_time",
      state: "blocked",
      label: "Date and time",
      explanation: "Start or end time is missing.",
      blocker: "Set event date and time.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  if (new Date(event.end_at) < new Date(event.start_at)) {
    return {
      dimension: "date_time",
      state: "blocked",
      label: "Date and time",
      explanation: "End time is before start time.",
      blocker: "Correct the event schedule.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  return {
    dimension: "date_time",
    state: "ready",
    label: "Date and time",
    explanation: "Schedule is set on the canonical event record.",
    route: eventRoute(event.event_id),
  };
}

function evaluateVenue(event: CalendarEvent): EventReadinessItem {
  if (event.location_type === "virtual" && event.virtual_url) {
    return {
      dimension: "venue",
      state: "ready",
      label: "Venue",
      explanation: "Virtual venue link is present.",
      route: eventRoute(event.event_id),
    };
  }
  if (event.location_type === "virtual" || event.location_name === "Virtual") {
    return {
      dimension: "venue",
      state: "ready",
      label: "Venue",
      explanation: "Virtual event — no physical venue required.",
      route: eventRoute(event.event_id),
    };
  }
  if (!event.location_name && event.location_type === "tbd") {
    return {
      dimension: "venue",
      state: "not_started",
      label: "Venue",
      explanation: "Venue is marked TBD.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  if (!event.location_name) {
    return {
      dimension: "venue",
      state: "blocked",
      label: "Venue",
      explanation: "No location is set.",
      blocker: "Confirm venue or mark virtual/TBD.",
      route: eventRoute(event.event_id, "/edit"),
    };
  }
  return {
    dimension: "venue",
    state: "ready",
    label: "Venue",
    explanation: `${event.location_name}. Calendar record only — not venue contract approval.`,
    route: eventRoute(event.event_id),
  };
}

function evaluateCandidate(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/candidate-request");
  if (!event.kelly_requested) {
    return {
      dimension: "candidate",
      state: "not_required",
      label: "Candidate",
      explanation: "Kelly attendance not requested for this event.",
      route,
    };
  }
  const status = event.kelly_attendance_status ?? "not_requested";
  if (status === "confirmed" || status === "completed") {
    return {
      dimension: "candidate",
      state: "ready",
      label: "Candidate",
      explanation: "Kelly attendance confirmed on internal record.",
      route,
    };
  }
  if (status === "declined" || status === "canceled") {
    const needsAlternate = isPublicFacing(event) && event.operational_status !== "canceled";
    return {
      dimension: "candidate",
      state: needsAlternate ? "blocked" : "complete",
      label: "Candidate",
      explanation: needsAlternate
        ? "Kelly declined — public event needs an alternate plan."
        : "Kelly declined — event adjusted or canceled.",
      blocker: needsAlternate ? "Approve no-candidate plan or adjust event." : null,
      route,
    };
  }
  if (status === "hold_placed" || status === "tentatively_accepted") {
    return {
      dimension: "candidate",
      state: "in_progress",
      label: "Candidate",
      explanation: `Kelly hold/tentative (${status}). Request ≠ confirmation.`,
      route,
    };
  }
  return {
    dimension: "candidate",
    state: "in_progress",
    label: "Candidate",
    explanation: `Kelly request ${status.replace(/_/g, " ")}. Request ≠ confirmation.`,
    route,
  };
}

function evaluateStaffing(event: CalendarEvent, now: Date): EventReadinessItem {
  const route = eventRoute(event.event_id, "/staffing");
  if (!needsVolunteers(event) || event.staffing_status === "staffing_not_required") {
    return {
      dimension: "staffing",
      state: "not_required",
      label: "Staffing",
      explanation: "No volunteers required for this event.",
      route,
    };
  }
  if (event.staffing_status === "no_staffing_plan" || event.volunteer_roles.length === 0) {
    return {
      dimension: "staffing",
      state: "not_started",
      label: "Staffing",
      explanation: "Volunteer roles or staffing plan missing.",
      route,
    };
  }
  const hoursUntil = (new Date(event.start_at).getTime() - now.getTime()) / 36e5;
  if (event.staffing_status === "critical_shortage" && hoursUntil <= 72 && hoursUntil >= 0) {
    return {
      dimension: "staffing",
      state: "blocked",
      label: "Staffing",
      explanation: "Critical volunteer shortage within 72 hours of event.",
      blocker: "Fill critical roles or reduce scope.",
      route,
    };
  }
  if (event.staffing_status === "needs_volunteers" || event.volunteer_slots_open > 0) {
    return {
      dimension: "staffing",
      state: "in_progress",
      label: "Staffing",
      explanation: `${event.volunteers_confirmed}/${event.volunteers_needed} confirmed. Interest ≠ assignment.`,
      route,
    };
  }
  return {
    dimension: "staffing",
    state: "ready",
    label: "Staffing",
    explanation: `Staffing ${event.staffing_status.replace(/_/g, " ")}. Soft-beta — not production assignment.`,
    route,
  };
}

function evaluateTasks(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/edit");
  if (event.operational_status === "completed" || event.operational_status === "canceled") {
    return {
      dimension: "tasks",
      state: "not_required",
      label: "Tasks",
      explanation: "Event closed — task tracking not required.",
      route,
    };
  }
  const hasShiftPlan = event.shift_required || event.shifts.length > 0;
  if (!hasShiftPlan && needsVolunteers(event)) {
    return {
      dimension: "tasks",
      state: "not_started",
      label: "Tasks",
      explanation: "Awaiting shift workflow (CAL-P2 Wave 2A). Role list exists; task engine not live.",
      route: eventRoute(event.event_id, "/staffing"),
    };
  }
  if (hasShiftPlan) {
    return {
      dimension: "tasks",
      state: "in_progress",
      label: "Tasks",
      explanation: "Shift placeholders present. Full task engine planned for CAL-P2.",
      route,
    };
  }
  return {
    dimension: "tasks",
    state: "not_required",
    label: "Tasks",
    explanation: "No task checklist required for this event type.",
    route,
  };
}

function evaluateMaterials(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/edit");
  const needsMaterials =
    event.event_type === "voter_registration_drive" ||
    event.event_type === "tabling" ||
    event.event_type === "canvass";
  if (!needsMaterials) {
    return {
      dimension: "materials",
      state: "not_required",
      label: "Materials",
      explanation: "Materials checklist not required for this event type.",
      route,
    };
  }
  const hasAttachments = event.attachments.length > 0;
  if (hasAttachments) {
    return {
      dimension: "materials",
      state: "ready",
      label: "Materials",
      explanation: "Materials references attached to event record.",
      route,
    };
  }
  return {
    dimension: "materials",
    state: "in_progress",
    label: "Materials",
    explanation: "Registration/canvass materials — checklist soft-beta preview only.",
    route,
  };
}

function evaluatePromotion(event: CalendarEvent): EventReadinessItem {
  if (!isPublicFacing(event)) {
    return {
      dimension: "promotion",
      state: "not_required",
      label: "Promotion",
      explanation: "Internal or non-public event — promotion not required.",
      route: eventRoute(event.event_id),
    };
  }
  if (event.social_promotion_enabled || event.publication_status === "published") {
    return {
      dimension: "promotion",
      state: event.publication_status === "published" ? "ready" : "in_progress",
      label: "Promotion",
      explanation:
        event.publication_status === "published"
          ? "Published — promotion may be active."
          : "Promotion enabled — publication not yet live.",
      route: eventRoute(event.event_id),
    };
  }
  if (event.publication_status === "ready_to_publish") {
    return {
      dimension: "promotion",
      state: "in_progress",
      label: "Promotion",
      explanation: "Ready to publish — promotion prep may be underway.",
      route: eventRoute(event.event_id),
    };
  }
  return {
    dimension: "promotion",
    state: "not_started",
    label: "Promotion",
    explanation: "Public-facing event without promotion plan on record.",
    route: eventRoute(event.event_id),
  };
}

function evaluateRsvp(event: CalendarEvent): EventReadinessItem {
  const needsRsvp = event.event_type === "networking_event" || event.event_type === "social";
  if (!needsRsvp) {
    return {
      dimension: "rsvp",
      state: "not_required",
      label: "RSVP",
      explanation: "RSVP tracking not required for this event type.",
      route: eventRoute(event.event_id),
    };
  }
  return {
    dimension: "rsvp",
    state: "in_progress",
    label: "RSVP",
    explanation: "Networking event — RSVP workflow soft-beta preview. Awaiting durable persistence.",
    route: eventRoute(event.event_id, "/volunteer"),
  };
}

function evaluateVerification(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/approvals");
  const needsVerification =
    isPublicFacing(event) &&
    (event.location_type === "in_person" || event.event_type === "festival_or_public_appearance");
  if (!needsVerification && event.approval_status === "approved") {
    return {
      dimension: "verification",
      state: "not_required",
      label: "Verification",
      explanation: "No separate venue/legal verification required for this scope.",
      route,
    };
  }
  if (!needsVerification) {
    return {
      dimension: "verification",
      state: "not_started",
      label: "Verification",
      explanation:
        "Campus permission / venue verification may be needed. Calendar approval ≠ venue or legal approval.",
      route,
    };
  }
  if (event.approval_status === "approved" && event.location_name) {
    return {
      dimension: "verification",
      state: "in_progress",
      label: "Verification",
      explanation: "Public in-person event — venue/legal verification tracked separately from calendar approval.",
      route,
    };
  }
  return {
    dimension: "verification",
    state: "not_started",
    label: "Verification",
    explanation: "Public event — campus permission and location verification not yet recorded.",
    route,
  };
}

function evaluateFollowUp(event: CalendarEvent): EventReadinessItem {
  const route = eventRoute(event.event_id, "/report");
  const isDone = event.operational_status === "completed";
  if (!isDone) {
    return {
      dimension: "follow_up",
      state: "not_required",
      label: "Follow-up",
      explanation: "Pre-event — follow-up and reporting not yet due.",
      route,
    };
  }
  const hasReport = event.history.some((h) => /report|follow-up|outcome/i.test(h.note));
  if (hasReport) {
    return {
      dimension: "follow_up",
      state: "complete",
      label: "Follow-up",
      explanation: "Post-event report or follow-up noted in history.",
      route,
    };
  }
  return {
    dimension: "follow_up",
    state: "blocked",
    label: "Follow-up",
    explanation: "Event completed — report or outcome capture missing.",
    blocker: "Submit post-event report.",
    route,
  };
}

const EVALUATORS: Record<
  EventReadinessDimension,
  (event: CalendarEvent, now: Date) => EventReadinessItem
> = {
  ownership: (e) => evaluateOwnership(e),
  approval: (e) => evaluateApproval(e),
  date_time: (e) => evaluateDateTime(e),
  venue: (e) => evaluateVenue(e),
  candidate: (e) => evaluateCandidate(e),
  staffing: (e, n) => evaluateStaffingReadiness(e, n),
  tasks: (e) => evaluateTasksReadiness(e),
  materials: (e) => evaluateMaterials(e),
  promotion: (e) => evaluatePromotion(e),
  rsvp: (e) => evaluateRsvp(e),
  verification: (e) => evaluateVerification(e),
  follow_up: (e) => evaluateFollowUp(e),
};

export function evaluateEventReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem[] {
  const items = (Object.keys(EVALUATORS) as EventReadinessDimension[]).map((dim) => EVALUATORS[dim](event, now));
  const tr = event.template_readiness;
  if (!tr) return items;
  return items.map((item) => {
    if (tr.nonApplicableDimensions.includes(item.dimension)) {
      return {
        ...item,
        state: "not_required",
        explanation: "Not required for this event template.",
        blocker: null,
      };
    }
    return item;
  });
}

export function aggregateOverallReadiness(
  items: EventReadinessItem[],
  event: CalendarEvent,
  now: Date = new Date(),
): EventReadinessState {
  const required = items.filter((i) => i.state !== "not_required");
  if (required.length === 0) return "not_required";

  if (event.operational_status === "completed") {
    const followUp = items.find((i) => i.dimension === "follow_up");
    if (followUp?.state === "complete") return "complete";
    if (followUp?.state === "blocked") return "blocked";
    return "complete";
  }

  if (required.some((i) => i.state === "blocked")) return "blocked";

  const notStarted = required.filter((i) => i.state === "not_started").length;
  if (notStarted >= 3) return "not_started";

  const preEvent = isPreEvent(event, now);
  if (preEvent) {
    const preDims = required.filter((i) => i.dimension !== "follow_up");
    const allReady = preDims.every((i) => i.state === "ready" || i.state === "complete");
    if (allReady) return "ready";
  }

  if (required.some((i) => i.state === "in_progress" || i.state === "not_started")) return "in_progress";

  return "ready";
}

export function readinessRatio(items: EventReadinessItem[]): { completed: number; required: number } | null {
  const required = items.filter((i) => i.state !== "not_required");
  if (required.length === 0) return null;
  const completed = required.filter((i) => i.state === "ready" || i.state === "complete").length;
  return { completed, required: required.length };
}

export const READINESS_STATE_LABELS: Record<EventReadinessState, string> = {
  not_required: "Not required",
  not_started: "Not started",
  in_progress: "In progress",
  blocked: "Blocked",
  ready: "Ready",
  complete: "Complete",
};
