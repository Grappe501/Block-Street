import type { CalendarShiftWaitlistEntry } from "./types";
import { evaluateScheduleConflict, evaluateTrainingStatus } from "./eligibility";
import { recordAudit } from "./audit";
import { canTransitionWaitlist } from "./status";
import { listWaitlistEntries, saveWaitlistEntry } from "./store";
import { getShiftById } from "../staffing/store";
import { listReviews } from "./store";

const GROUP_ORDER: Record<CalendarShiftWaitlistEntry["priorityGroup"], number> = {
  replacement: 1,
  lead_eligible: 2,
  trained: 3,
  general: 4,
  conditional: 5,
};

export function addWaitlistEntry(input: {
  eventId: string;
  shiftId: string;
  requirementId: string;
  volunteerUserId: string;
  addedByUserId?: string | null;
  priorityGroup?: CalendarShiftWaitlistEntry["priorityGroup"];
  source?: "capacity_full" | "manager" | "volunteer";
}): { entry?: CalendarShiftWaitlistEntry; blockedReasons: string[] } {
  const existing = listWaitlistEntries({ shiftId: input.shiftId, volunteerUserId: input.volunteerUserId }).filter(
    (w) => w.waitlistStatus === "active" || w.waitlistStatus === "offer_prepared" || w.waitlistStatus === "offered",
  );
  if (existing.length > 0) return { blockedReasons: ["One active waitlist entry per volunteer per shift"] };
  const shift = getShiftById(input.shiftId);
  if (!shift) return { blockedReasons: ["Shift not found"] };
  const training = evaluateTrainingStatus(input.volunteerUserId, shift.trainingRequirementKeys);
  const schedule =
    evaluateScheduleConflict(input.volunteerUserId, shift.startAt, shift.endAt, shift.shiftId) === "hard_conflict"
      ? "hard_conflict"
      : evaluateScheduleConflict(input.volunteerUserId, shift.startAt, shift.endAt, shift.shiftId) === "possible_conflict"
        ? "possible_conflict"
        : "clear";
  let group: CalendarShiftWaitlistEntry["priorityGroup"] = input.priorityGroup ?? "general";
  const reasons: string[] = [];
  if (input.source === "capacity_full") reasons.push("Shift at capacity");
  if (input.priorityGroup !== "replacement") {
    if (training === "eligible" && schedule === "clear") {
      group = group === "general" ? "trained" : group;
      reasons.push("Fully trained with clear availability");
    } else if (training !== "eligible") {
      group = "conditional";
      reasons.push("Training or clarification needed");
    }
    if (schedule === "hard_conflict") {
      group = "conditional";
      reasons.push("Unresolved schedule conflict");
    }
  } else {
    reasons.push("Replacement candidate already reviewed and eligible");
  }
  const now = new Date().toISOString();
  const entry: CalendarShiftWaitlistEntry = {
    waitlistEntryId: `wl-${input.shiftId}-${input.volunteerUserId}`,
    eventId: input.eventId,
    shiftId: input.shiftId,
    requirementId: input.requirementId,
    volunteerUserId: input.volunteerUserId,
    waitlistStatus: "active",
    priorityGroup: group,
    priorityScore: GROUP_ORDER[group],
    priorityReasons: reasons,
    trainingEligibility:
      training === "eligible"
        ? "eligible"
        : training === "missing"
          ? "missing"
          : training === "expired"
            ? "expired"
            : "conditional",
    scheduleStatus: schedule,
    addedByUserId: input.addedByUserId ?? null,
    addedAt: now,
    updatedAt: now,
  };
  saveWaitlistEntry(entry);
  recordAudit({
    entityType: "waitlist",
    entityId: entry.waitlistEntryId,
    eventId: entry.eventId,
    shiftId: entry.shiftId,
    volunteerUserId: entry.volunteerUserId,
    action: "waitlist_added",
    nextStatus: "active",
    actorUserId: input.addedByUserId ?? null,
  });
  return { entry, blockedReasons: [] };
}

export function sortWaitlistEntries(entries: CalendarShiftWaitlistEntry[]): CalendarShiftWaitlistEntry[] {
  return [...entries].sort((a, b) => {
    const ga = GROUP_ORDER[a.priorityGroup] ?? 99;
    const gb = GROUP_ORDER[b.priorityGroup] ?? 99;
    if (ga !== gb) return ga - gb;
    const reviewA = listReviews().find((r) => r.volunteerUserId === a.volunteerUserId && r.shiftId === a.shiftId);
    const reviewB = listReviews().find((r) => r.volunteerUserId === b.volunteerUserId && r.shiftId === b.shiftId);
    const reviewedA = reviewA?.reviewStatus === "eligible" ? 1 : 0;
    const reviewedB = reviewB?.reviewStatus === "eligible" ? 1 : 0;
    if (reviewedA !== reviewedB) return reviewedB - reviewedA;
    return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
  });
}

export function transitionWaitlistEntry(
  waitlistEntryId: string,
  toStatus: CalendarShiftWaitlistEntry["waitlistStatus"],
): CalendarShiftWaitlistEntry | null {
  const entries = listWaitlistEntries();
  const entry = entries.find((e) => e.waitlistEntryId === waitlistEntryId);
  if (!entry || !canTransitionWaitlist(entry.waitlistStatus, toStatus)) return null;
  const updated = saveWaitlistEntry({ ...entry, waitlistStatus: toStatus, updatedAt: new Date().toISOString() });
  recordAudit({
    entityType: "waitlist",
    entityId: entry.waitlistEntryId,
    eventId: entry.eventId,
    shiftId: entry.shiftId,
    volunteerUserId: entry.volunteerUserId,
    action: `waitlist_${toStatus}`,
    previousStatus: entry.waitlistStatus,
    nextStatus: toStatus,
  });
  return updated;
}

export function closeWaitlistWhenNotNeeded(shiftId: string): number {
  let count = 0;
  for (const e of listWaitlistEntries({ shiftId })) {
    if (e.waitlistStatus === "active") {
      transitionWaitlistEntry(e.waitlistEntryId, "no_longer_needed");
      count++;
    }
  }
  return count;
}
