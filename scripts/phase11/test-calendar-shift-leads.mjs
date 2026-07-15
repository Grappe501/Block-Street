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
cal.clearStaffingStoreForTest();
const event = cal.getEventById("evt-henderson-vr-drive");
const reqs = cal.ensureStaffingFromEvent(event);
const shift = cal.generateShiftsFromRequirement({ eventId: event.event_id, requirementId: reqs[0].requirementId, pattern: "single" })[0];
cal.assignShiftLead({ shiftId: shift.shiftId, userId: "usr-lead-1", status: "suggested" });
let cov = cal.calculateShiftCoverage(shift);
assert(!cov.leadCovered || shift.leadRequired === false, "suggested lead not accepted");
cal.assignShiftLead({ shiftId: shift.shiftId, userId: "usr-lead-1", status: "accepted" });
cov = cal.calculateShiftCoverage({ ...shift, leadRequired: true });
assert(cov.acceptedLeadCount >= 1, "accepted lead counts");
console.log("test:calendar:shift-leads PASS");
