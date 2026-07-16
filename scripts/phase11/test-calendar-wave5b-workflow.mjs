import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
function assert(c, m) {
  if (!c) throw new Error(m);
}
async function loadCal() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/index.ts"));
  }
}
const cal = await loadCal();
cal.clearConflictStoreForTest();
const event = cal.getEventById("evt-kelly-campus-hold-asu");
assert(event, "event");
cal.ensureConflictsForEvent(event);
const conflictId = "conf-kelly-asu-buffer";
const allItems = cal.listConflictItems({ conflictId });
for (const item of allItems) {
  cal.markConflictItemReady(item.itemId, "usr-mgr-001");
}
const resolved = cal.resolveConflictRecord(conflictId, "usr-mgr-001", "Coordinated with field team");
assert(resolved, "resolved");
assert(resolved.state === "no_conflict", "state cleared");
const reopened = cal.reopenConflictRecord(conflictId, "usr-mgr-001");
assert(reopened?.resolutionStatus === "open", "reopened");
const wontFix = cal.markConflictWontFix(conflictId, "usr-mgr-001", "Deferred to next cycle");
assert(wontFix?.resolutionStatus === "wont_fix", "wont fix");
const reopenedAgain = cal.reopenConflictRecord(conflictId, "usr-mgr-001");
assert(reopenedAgain?.resolutionStatus === "open", "reopened from wont fix");
console.log("test:calendar:wave5b-workflow PASS");
