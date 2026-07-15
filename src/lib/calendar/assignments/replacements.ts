import type { CalendarReplacementNeed } from "./types";
import { recordAudit } from "./audit";
import { createDraftOffer, sendOffer } from "./offers";
import { markAssignmentReplaced } from "./assignments";
import { sortWaitlistEntries } from "./waitlists";
import { getAssignmentById, listReplacementNeeds, saveReplacementNeed } from "./store";
import type { CalendarAssignmentCancellation } from "./types";
import { listWaitlistEntries } from "./store";
import { getShiftById } from "../staffing/store";
import { calculateShiftCoverage } from "../staffing/coverage";
import { listInterests } from "../staffing/store";

function deriveUrgency(shiftId: string, roleKey: string): CalendarReplacementNeed["urgency"] {
  const shift = getShiftById(shiftId);
  if (!shift) return "watch";
  const cov = calculateShiftCoverage(shift);
  const hoursUntil = (new Date(shift.startAt).getTime() - Date.now()) / 3600000;
  if (hoursUntil <= 24 && cov.coverageStatus === "critical_gap") return "critical";
  if (hoursUntil <= 48 && cov.minimumGap > 0) return "urgent";
  if (cov.minimumGap > 0) return "needs_attention";
  if (shift.leadRequired) return "watch";
  if (roleKey.includes("lead") || roleKey.includes("check_in")) return "needs_attention";
  return "watch";
}

export function createReplacementNeedFromCancellation(
  cancellation: CalendarAssignmentCancellation,
): CalendarReplacementNeed {
  const assignment = getAssignmentById(cancellation.assignmentId);
  const shift = getShiftById(cancellation.shiftId);
  const waitlistIds = sortWaitlistEntries(listWaitlistEntries({ shiftId: cancellation.shiftId }))
    .filter((w) => w.waitlistStatus === "active")
    .map((w) => w.waitlistEntryId);
  const interestIds = listInterests({ eventId: cancellation.eventId, shiftId: cancellation.shiftId })
    .filter((i) => i.interestStatus === "interested" || i.interestStatus === "under_review")
    .map((i) => i.interestId);
  const now = new Date().toISOString();
  const need: CalendarReplacementNeed = {
    replacementNeedId: `rep-${cancellation.assignmentId}`,
    eventId: cancellation.eventId,
    shiftId: cancellation.shiftId,
    requirementId: assignment?.requirementId ?? shift?.requirementId ?? "",
    canceledAssignmentId: cancellation.assignmentId,
    roleKey: assignment?.roleKey ?? shift?.roleKey ?? "volunteer",
    startAt: assignment?.startAt ?? shift?.startAt ?? now,
    endAt: assignment?.endAt ?? shift?.endAt ?? now,
    urgency: deriveUrgency(cancellation.shiftId, assignment?.roleKey ?? ""),
    status: "open",
    candidateWaitlistEntryIds: waitlistIds,
    candidateInterestIds: interestIds,
    createdAt: now,
  };
  saveReplacementNeed(need);
  recordAudit({
    entityType: "replacement",
    entityId: need.replacementNeedId,
    eventId: need.eventId,
    shiftId: need.shiftId,
    action: "replacement_need_created",
    nextStatus: "open",
  });
  return need;
}

export function rankReplacementCandidates(need: CalendarReplacementNeed): Array<{
  kind: "waitlist" | "interest";
  id: string;
  volunteerUserId: string;
  rank: number;
  reasons: string[];
}> {
  const ranked: Array<{ kind: "waitlist" | "interest"; id: string; volunteerUserId: string; rank: number; reasons: string[] }> = [];
  const waitlist = sortWaitlistEntries(
    listWaitlistEntries({ shiftId: need.shiftId }).filter((w) =>
      need.candidateWaitlistEntryIds.includes(w.waitlistEntryId),
    ),
  );
  waitlist.forEach((w, i) => {
    ranked.push({
      kind: "waitlist",
      id: w.waitlistEntryId,
      volunteerUserId: w.volunteerUserId,
      rank: i + 1,
      reasons: [`Priority group: ${w.priorityGroup}`, ...w.priorityReasons],
    });
  });
  const interests = listInterests({ eventId: need.eventId, shiftId: need.shiftId }).filter((int) =>
    need.candidateInterestIds.includes(int.interestId),
  );
  interests.forEach((int, i) => {
    ranked.push({
      kind: "interest",
      id: int.interestId,
      volunteerUserId: int.userId,
      rank: waitlist.length + i + 1,
      reasons: ["Eligible interest candidate"],
    });
  });
  return ranked;
}

export function createReplacementOffer(
  replacementNeedId: string,
  volunteerUserId: string,
  actorUserId?: string | null,
): { offerId?: string; blockedReasons: string[] } {
  const need = listReplacementNeeds().find((n) => n.replacementNeedId === replacementNeedId);
  if (!need || need.status === "filled" || need.status === "no_longer_needed") {
    return { blockedReasons: ["Replacement need not open"] };
  }
  const shift = getShiftById(need.shiftId);
  if (!shift) return { blockedReasons: ["Shift not found"] };
  const { offer, blockedReasons } = createDraftOffer({
    eventId: need.eventId,
    shiftId: need.shiftId,
    requirementId: need.requirementId,
    volunteerUserId,
    offeredRoleKey: need.roleKey,
    offeredRoleLabel: shift.roleLabel,
    source: "replacement",
    replacementForAssignmentId: need.canceledAssignmentId ?? null,
    offeredByUserId: actorUserId ?? null,
  });
  if (!offer) return { blockedReasons };
  sendOffer(offer.offerId, actorUserId);
  saveReplacementNeed({ ...need, status: "offer_sent" });
  return { offerId: offer.offerId, blockedReasons: [] };
}

export function fillReplacementNeed(
  replacementNeedId: string,
  newAssignmentId: string,
  canceledAssignmentId?: string | null,
): CalendarReplacementNeed | null {
  const need = listReplacementNeeds().find((n) => n.replacementNeedId === replacementNeedId);
  if (!need) return null;
  if (canceledAssignmentId) markAssignmentReplaced(canceledAssignmentId);
  const now = new Date().toISOString();
  const updated = saveReplacementNeed({
    ...need,
    status: "filled",
    resolvedAt: now,
  });
  recordAudit({
    entityType: "replacement",
    entityId: need.replacementNeedId,
    eventId: need.eventId,
    shiftId: need.shiftId,
    action: "replacement_filled",
    previousStatus: need.status,
    nextStatus: "filled",
    reason: newAssignmentId,
  });
  return updated;
}

export function listOpenReplacementNeeds(filter?: { eventId?: string; shiftId?: string }) {
  return listReplacementNeeds(filter).filter((n) => n.status === "open" || n.status === "offer_sent" || n.status === "offer_prepared");
}
