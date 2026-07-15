import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

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
cal.clearStaffingStoreForTest();

const event = cal.getEventById("evt-henderson-vr-drive");
const reqs = cal.ensureStaffingFromEvent(event);
assert(reqs.length > 0, "requirements from event");

const req = reqs[0];
const shifts = cal.generateShiftsFromRequirement({ eventId: event.event_id, requirementId: req.requirementId, pattern: "single" });
assert(shifts.length === 1, "single shift");

cal.expressInterest({ eventId: event.event_id, shiftId: shifts[0].shiftId, trainingKeys: shifts[0].trainingRequirementKeys });
const cov = cal.calculateShiftCoverage(shifts[0]);
assert(cov.interestedCount >= 1, "interest counted");
assert(cov.confirmedCount === 0, "interest not confirmed");
assert(cov.minimumGap > 0, "gap remains");

cal.saveConfirmation({
  confirmationId: "conf-1",
  shiftId: shifts[0].shiftId,
  eventId: event.event_id,
  userId: "usr-vol-1",
  status: "confirmed_soft_beta",
  source: "soft_beta",
  confirmedAt: new Date().toISOString(),
});
const cov2 = cal.calculateShiftCoverage(shifts[0]);
assert(cov2.confirmedCount === 1, "soft-beta confirmation counts");

console.log("calendar:staffing:coverage PASS");
