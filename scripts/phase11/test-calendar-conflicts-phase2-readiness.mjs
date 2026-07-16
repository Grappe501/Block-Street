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
const kelly = cal.getEventById("evt-kelly-campus-hold-asu");
assert(kelly, "kelly");
cal.ensureConflictsForEvent(kelly);
const ops = cal.buildEventOperationsSummary(kelly);
assert(ops.attentionKeys.includes("unresolved_conflict"), "unresolved_conflict");
assert(ops.attentionKeys.includes("conflict_resolution_pending"), "conflict_resolution_pending");
const items = cal.listConflictItems({ eventId: kelly.event_id });
for (const item of items) {
  cal.markConflictItemReady(item.itemId, "usr-mgr-001");
}
const ops2 = cal.buildEventOperationsSummary(kelly);
assert(!ops2.attentionKeys.includes("conflict_resolution_pending"), "resolution pending cleared");
console.log("test:calendar:conflicts-phase2-readiness PASS");
