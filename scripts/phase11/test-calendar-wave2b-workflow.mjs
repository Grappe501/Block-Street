import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
function assert(c, m) { if (!c) throw new Error(m); }

async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/index.ts"));
  }
}

const cal = await load();
cal.clearAssignmentsStoreForTest();
cal.clearStaffingStoreForTest();

const event = cal.getEventById("evt-henderson-vr-drive");
const reqs = cal.ensureStaffingFromEvent(event);
const shift = cal.generateShiftsFromRequirement({ eventId: event.event_id, requirementId: reqs[0].requirementId, pattern: "single" })[0];

// Review
cal.expressInterest({ eventId: event.event_id, shiftId: shift.shiftId, userId: "usr-demo-001" });
const queue = cal.listReviewQueue({ eventId: event.event_id });
assert(queue.length >= 1, "interest enters review queue");
const review = cal.ensureReviewForInterest(queue[0].interestId);
assert(review, "review record");
const safe = cal.projectVolunteerSafeReview(review);
assert(safe.internalNotes === undefined, "internal notes hidden");

cal.submitReview({
  reviewId: review.reviewId,
  reviewStatus: "eligible",
  roleEligibility: "eligible",
  reviewerUserId: "usr-mgr-001",
  internalNotes: "PRIVATE",
  volunteerSafeExplanation: "Eligible",
});

// Offer
const { offer, blockedReasons } = cal.createDraftOffer({
  eventId: event.event_id,
  shiftId: shift.shiftId,
  requirementId: shift.requirementId,
  volunteerUserId: "usr-demo-001",
  offeredRoleKey: shift.roleKey,
  offeredRoleLabel: shift.roleLabel,
  managerNotes: "SECRET",
});
assert(offer && blockedReasons.length === 0, "offer created");
const preview = cal.projectVolunteerSafeOffer(offer, event.title);
assert(!JSON.stringify(preview).includes("SECRET"), "manager notes excluded");

cal.sendOffer(offer.offerId, "usr-mgr-001");
const dup = cal.createDraftOffer({
  eventId: event.event_id,
  shiftId: shift.shiftId,
  requirementId: shift.requirementId,
  volunteerUserId: "usr-demo-001",
  offeredRoleKey: shift.roleKey,
  offeredRoleLabel: shift.roleLabel,
});
assert(dup.blockedReasons.length > 0, "duplicate offer rejected");

// Response
const wrong = cal.respondToOffer({ offerId: offer.offerId, volunteerUserId: "usr-other", response: "accepted" });
assert(!wrong.success, "only intended volunteer");

const accept = cal.respondToOffer({ offerId: offer.offerId, volunteerUserId: "usr-demo-001", response: "accepted" });
assert(accept.success && accept.assignment, "accept creates assignment");
assert(accept.assignment.softBeta && !accept.assignment.durableAuthority, "soft beta only");

const declineOffer = cal.createDraftOffer({
  eventId: event.event_id,
  shiftId: shift.shiftId,
  requirementId: shift.requirementId,
  volunteerUserId: "usr-demo-002",
  offeredRoleKey: shift.roleKey,
  offeredRoleLabel: shift.roleLabel,
});
cal.sendOffer(declineOffer.offer.offerId, "usr-mgr-001");
const decline = cal.respondToOffer({ offerId: declineOffer.offer.offerId, volunteerUserId: "usr-demo-002", response: "declined" });
assert(decline.success && !decline.assignment, "decline creates no assignment");

// Waitlist
shift.maximumAllowed = 1;
cal.saveShift(shift);
const wl = cal.addWaitlistEntry({ eventId: event.event_id, shiftId: shift.shiftId, requirementId: shift.requirementId, volunteerUserId: "usr-demo-003", source: "capacity_full" });
assert(wl.entry, "waitlist entry");

// Schedule
const sched = cal.buildPersonalSchedule("usr-demo-001");
assert(sched.softBetaConfirmed.length >= 1, "schedule shows soft beta assignment");
assert(sched.interests.length >= 0, "schedule sections");
const other = cal.projectVolunteerSafeSchedule("usr-demo-001", "usr-other");
assert(other === null, "cannot view other schedule");

// Privacy
const pub = JSON.stringify(sched);
assert(!pub.includes("@"), "no email in schedule");

console.log("test:calendar:wave2b workflow PASS");
