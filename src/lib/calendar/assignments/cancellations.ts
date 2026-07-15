import type { CalendarAssignmentCancellation } from "./types";
import { recordAudit } from "./audit";
import { canTransitionAssignment } from "./status";
import { getAssignmentById, listCancellations, saveAssignment, saveCancellation } from "./store";
import { createReplacementNeedFromCancellation } from "./replacements";

export function requestCancellation(input: {
  assignmentId: string;
  requestedBy: CalendarAssignmentCancellation["requestedBy"];
  reasonKey: CalendarAssignmentCancellation["reasonKey"];
  volunteerSafeNote?: string | null;
  internalNote?: string | null;
  replacementRequired?: boolean;
  actorUserId?: string | null;
}): { cancellation?: CalendarAssignmentCancellation; blockedReasons: string[] } {
  const assignment = getAssignmentById(input.assignmentId);
  if (!assignment) return { blockedReasons: ["Assignment not found"] };
  if (!canTransitionAssignment(assignment.assignmentStatus, "cancellation_requested") &&
      !canTransitionAssignment(assignment.assignmentStatus, "canceled_by_volunteer") &&
      !canTransitionAssignment(assignment.assignmentStatus, "canceled_by_manager")) {
    return { blockedReasons: ["Assignment cannot be canceled"] };
  }
  const now = new Date().toISOString();
  const cancellation: CalendarAssignmentCancellation = {
    cancellationId: `can-${input.assignmentId}-${Date.now()}`,
    assignmentId: assignment.assignmentId,
    eventId: assignment.eventId,
    shiftId: assignment.shiftId,
    volunteerUserId: assignment.volunteerUserId,
    requestedBy: input.requestedBy,
    cancellationStatus: input.requestedBy === "volunteer" ? "requested" : "approved",
    reasonKey: input.reasonKey,
    volunteerSafeNote: input.volunteerSafeNote ?? null,
    internalNote: input.internalNote ?? null,
    replacementRequired: input.replacementRequired ?? true,
    requestedAt: now,
    resolvedAt: input.requestedBy !== "volunteer" ? now : null,
    resolvedByUserId: input.actorUserId ?? null,
  };
  saveCancellation(cancellation);
  const nextStatus =
    input.requestedBy === "volunteer" ? "cancellation_requested" : input.requestedBy === "manager" ? "canceled_by_manager" : "canceled_by_volunteer";
  if (input.requestedBy !== "volunteer") {
    completeCancellation(cancellation.cancellationId, input.actorUserId ?? null);
  } else {
    saveAssignment({ ...assignment, assignmentStatus: "cancellation_requested", updatedAt: now });
  }
  recordAudit({
    entityType: "cancellation",
    entityId: cancellation.cancellationId,
    eventId: cancellation.eventId,
    shiftId: cancellation.shiftId,
    volunteerUserId: cancellation.volunteerUserId,
    action: "cancellation_requested",
    nextStatus: cancellation.cancellationStatus,
    actorUserId: input.actorUserId ?? null,
  });
  return { cancellation, blockedReasons: [] };
}

export function completeCancellation(cancellationId: string, resolvedByUserId?: string | null): CalendarAssignmentCancellation | null {
  const cancellation = listCancellations().find((c) => c.cancellationId === cancellationId);
  if (!cancellation) return null;
  const assignment = getAssignmentById(cancellation.assignmentId);
  if (!assignment) return null;
  const now = new Date().toISOString();
  const canceledStatus =
    cancellation.requestedBy === "manager" ? "canceled_by_manager" : "canceled_by_volunteer";
  saveAssignment({ ...assignment, assignmentStatus: canceledStatus, updatedAt: now });
  const updated = saveCancellation({
    ...cancellation,
    cancellationStatus: "completed",
    resolvedAt: now,
    resolvedByUserId: resolvedByUserId ?? null,
  });
  recordAudit({
    entityType: "cancellation",
    entityId: cancellation.cancellationId,
    eventId: cancellation.eventId,
    shiftId: cancellation.shiftId,
    volunteerUserId: cancellation.volunteerUserId,
    action: "cancellation_completed",
    previousStatus: cancellation.cancellationStatus,
    nextStatus: "completed",
    actorUserId: resolvedByUserId ?? null,
  });
  if (updated.replacementRequired) {
    createReplacementNeedFromCancellation(updated);
  }
  return updated;
}

export function approveCancellation(cancellationId: string, actorUserId?: string | null): CalendarAssignmentCancellation | null {
  const c = listCancellations().find((x) => x.cancellationId === cancellationId);
  if (!c || c.cancellationStatus !== "requested") return null;
  saveCancellation({ ...c, cancellationStatus: "approved", resolvedByUserId: actorUserId ?? null });
  return completeCancellation(cancellationId, actorUserId);
}
