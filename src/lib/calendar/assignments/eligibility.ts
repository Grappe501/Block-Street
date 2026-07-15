import { listAssignments, listOffers } from "./store";
import { evaluateTrainingEligibility } from "../staffing/eligibility";
import { getShiftById } from "../staffing/store";

export type ConflictResult = "clear" | "possible_conflict" | "hard_conflict" | "unknown";

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

export function evaluateScheduleConflict(
  userId: string,
  startAt: string,
  endAt: string,
  excludeShiftId?: string,
): ConflictResult {
  const active = listAssignments({ volunteerUserId: userId, activeOnly: true });
  for (const a of active) {
    if (excludeShiftId && a.shiftId === excludeShiftId) continue;
    if (overlaps(startAt, endAt, a.startAt, a.endAt)) return "hard_conflict";
  }
  const pendingOffers = listOffers({ volunteerUserId: userId }).filter((o) =>
    ["offered", "viewed", "ready"].includes(o.offerStatus),
  );
  for (const o of pendingOffers) {
    if (excludeShiftId && o.shiftId === excludeShiftId) continue;
    if (overlaps(startAt, endAt, o.offeredStartAt, o.offeredEndAt)) return "possible_conflict";
  }
  return "clear";
}

export function evaluateTrainingStatus(
  userId: string,
  trainingKeys: string[],
): "unknown" | "eligible" | "missing" | "expired" | "on_site_briefing_allowed" {
  if (trainingKeys.length === 0) return "eligible";
  const { eligible, missing, expired } = evaluateTrainingEligibility(userId, trainingKeys);
  if (expired.length > 0) return "expired";
  if (missing.length > 0) {
    const shift = trainingKeys.some((k) => k.includes("briefing") || k.includes("on_site"));
    return shift ? "on_site_briefing_allowed" : "missing";
  }
  return eligible ? "eligible" : "unknown";
}

export function evaluateShiftCapacity(shiftId: string): {
  atMaximum: boolean;
  activeCount: number;
  maximumAllowed?: number | null;
} {
  const shift = getShiftById(shiftId);
  const activeCount = listAssignments({ shiftId, activeOnly: true }).length;
  const max = shift?.maximumAllowed ?? null;
  return {
    atMaximum: max != null && activeCount >= max,
    activeCount,
    maximumAllowed: max,
  };
}
