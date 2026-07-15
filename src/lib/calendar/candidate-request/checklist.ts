import type { KellyAttendanceStatus } from "../types";
import type { CalendarCandidateSummary } from "./types";
import { isCandidateItemReady, attendanceFromEventStatus } from "./status";
import { listCandidateItems } from "./store";

export function buildCandidateSummary(eventId: string, attendanceStatus: KellyAttendanceStatus = "not_requested"): CalendarCandidateSummary {
  const all = listCandidateItems({ eventId });
  const count = (cat: import("./types").CandidateItemCategory) => {
    const subset = all.filter((i) => i.category === cat);
    return {
      total: subset.length,
      ready: subset.filter((i) => isCandidateItemReady(i.itemStatus)).length,
    };
  };
  const request = count("request");
  const briefing = count("briefing");
  const travel = count("travel");
  const communication = count("communication");
  const confirmation = count("confirmation");
  const now = Date.now();
  const overdue = all.filter((i) => i.dueAt && new Date(i.dueAt).getTime() < now && !isCandidateItemReady(i.itemStatus));
  const incompleteRequired = all.filter((i) => i.required && !isCandidateItemReady(i.itemStatus));
  let readinessImpact: CalendarCandidateSummary["readinessImpact"] = "none";
  if (incompleteRequired.some((i) => i.blocksReadiness)) readinessImpact = "blocked";
  else if (incompleteRequired.length > 0 || overdue.length > 0) readinessImpact = "watch";

  return {
    eventId,
    requestTotal: request.total,
    requestReady: request.ready,
    briefingTotal: briefing.total,
    briefingReady: briefing.ready,
    travelTotal: travel.total,
    travelReady: travel.ready,
    communicationTotal: communication.total,
    communicationReady: communication.ready,
    confirmationTotal: confirmation.total,
    confirmationReady: confirmation.ready,
    attendanceSnapshot: attendanceFromEventStatus(attendanceStatus ?? "not_requested"),
    incompleteRequired: incompleteRequired.length,
    overdueCount: overdue.length,
    readinessImpact,
    primaryGap: incompleteRequired[0]?.label ?? null,
  };
}

export function listCandidateRows(eventId: string, category?: import("./types").CandidateItemCategory) {
  return listCandidateItems({ eventId, category }).map((i) => ({
    itemId: i.itemId,
    category: i.category,
    label: i.label,
    required: i.required,
    status: i.itemStatus,
    dueAt: i.dueAt,
    attendanceSnapshot: i.attendanceSnapshot,
  }));
}
