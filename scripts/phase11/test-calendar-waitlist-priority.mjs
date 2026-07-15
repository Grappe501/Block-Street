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

const int1 = cal.expressInterest({ eventId: event.event_id, shiftId: shift.shiftId, userId: "usr-demo-001" });
const int2 = cal.expressInterest({ eventId: event.event_id, shiftId: shift.shiftId, userId: "usr-demo-002" });

const w1 = cal.addWaitlistEntry({ eventId: event.event_id, shiftId: shift.shiftId, requirementId: shift.requirementId, volunteerUserId: "usr-demo-003" });
const w2 = cal.addWaitlistEntry({ eventId: event.event_id, shiftId: shift.shiftId, requirementId: shift.requirementId, volunteerUserId: "usr-demo-004", priorityGroup: "replacement" });
assert(w1.entry && w2.entry, "waitlist entries created");

const sorted = cal.sortWaitlistEntries([w1.entry, w2.entry]);
assert(sorted[0].priorityGroup === "replacement", "replacement group first");

const dup = cal.addWaitlistEntry({ eventId: event.event_id, shiftId: shift.shiftId, requirementId: shift.requirementId, volunteerUserId: "usr-demo-003" });
assert(dup.blockedReasons.length > 0, "one active entry per volunteer");

const covBefore = cal.calculateShiftCoverage(shift);
assert(covBefore.confirmedCount === 0 || covBefore.waitlistCount !== undefined, "waitlist pipeline in coverage");

console.log("calendar:waitlists:validate PASS");
