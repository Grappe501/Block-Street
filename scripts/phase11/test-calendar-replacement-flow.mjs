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

cal.expressInterest({ eventId: event.event_id, shiftId: shift.shiftId, userId: "usr-demo-002" });
cal.addWaitlistEntry({ eventId: event.event_id, shiftId: shift.shiftId, requirementId: shift.requirementId, volunteerUserId: "usr-demo-002", priorityGroup: "replacement" });

const { offer } = cal.createDraftOffer({
  eventId: event.event_id,
  shiftId: shift.shiftId,
  requirementId: shift.requirementId,
  volunteerUserId: "usr-demo-001",
  offeredRoleKey: shift.roleKey,
  offeredRoleLabel: shift.roleLabel,
});
assert(offer, "offer created");
cal.sendOffer(offer.offerId, "usr-mgr-001");

const accepted = cal.createAssignmentFromOffer(offer.offerId, "usr-demo-001");
assert(accepted.success, `accept: ${accepted.blockedReasons.join(", ")}`);
assert(accepted.assignment?.softBeta === true, "soft beta assignment");
assert(accepted.assignment?.durableAuthority === false, "no durable authority");

const covAfter = accepted.coverageAfter;
assert((covAfter?.confirmedCount ?? 0) >= 1, "coverage updated");

const cancel = cal.requestCancellation({
  assignmentId: accepted.assignment.assignmentId,
  requestedBy: "volunteer",
  reasonKey: "schedule_conflict",
});
assert(cancel.cancellation, "cancellation requested");
cal.approveCancellation(cancel.cancellation.cancellationId, "usr-mgr-001");

const needs = cal.listOpenReplacementNeeds({ eventId: event.event_id });
assert(needs.length >= 1, "replacement need created");

const ranked = cal.rankReplacementCandidates(needs[0]);
assert(ranked.length > 0, "replacement candidates ranked");
assert(ranked[0].kind === "waitlist", "waitlist candidate ranked first");

console.log("calendar:replacements:validate PASS");
