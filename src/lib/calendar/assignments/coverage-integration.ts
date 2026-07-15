import { listAssignments, listOffers, listReviews, listWaitlistEntries } from "./store";
import { countDurableConfirmedForShift, countSoftBetaConfirmedForShift } from "./assignments";
import { listConfirmations } from "../staffing/store";

export type ShiftPipelineCounts = {
  interestCount: number;
  reviewedCount: number;
  offeredCount: number;
  waitlistCount: number;
  softBetaConfirmedCount: number;
  durableConfirmedCount: number;
  legacyConfirmationCount: number;
};

export function getShiftPipelineCounts(shiftId: string, interestCount = 0): ShiftPipelineCounts {
  const offers = listOffers({ shiftId });
  const offeredCount = offers.filter((o) =>
    ["offered", "viewed", "ready", "draft"].includes(o.offerStatus),
  ).length;
  const reviewedCount = listReviews().filter(
    (r) => r.shiftId === shiftId && r.reviewStatus !== "not_reviewed" && r.reviewStatus !== "withdrawn",
  ).length;
  const waitlistCount = listWaitlistEntries({ shiftId }).filter((w) =>
    ["active", "offer_prepared", "offered"].includes(w.waitlistStatus),
  ).length;
  const softBeta = countSoftBetaConfirmedForShift(shiftId);
  const durable = countDurableConfirmedForShift(shiftId);
  const legacy = listConfirmations(shiftId).length;
  return {
    interestCount,
    reviewedCount,
    offeredCount,
    waitlistCount,
    softBetaConfirmedCount: softBeta,
    durableConfirmedCount: durable,
    legacyConfirmationCount: legacy,
  };
}

export function countConfirmedCoverageForShift(shiftId: string): number {
  return countSoftBetaConfirmedForShift(shiftId) + countDurableConfirmedForShift(shiftId) + listConfirmations(shiftId).length;
}
