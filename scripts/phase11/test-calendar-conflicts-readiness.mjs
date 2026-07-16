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
assert(kelly, "kelly event");
cal.ensureConflictsForEvent(kelly);
const items = cal.listConflictItems({ conflictId: "conf-kelly-asu-buffer", eventId: kelly.event_id });
const reviewItem = items.find((i) => i.itemKey === "review-schedule");
assert(reviewItem, "review item");
cal.markConflictItemReady(reviewItem.itemId, "usr-mgr-001");
const summary = cal.buildConflictSummary("conf-kelly-asu-buffer");
assert(summary.reviewReady >= 1, "review progress");
const needs = cal.listConflicts();
assert(needs.some((c) => c.conflict_id === "conf-kelly-asu-buffer"), "needs listConflicts wired");
const ops = cal.buildEventOperationsSummary(kelly);
assert(ops.hasConflict, "ops hasConflict");
assert(ops.attentionKeys.includes("unresolved_conflict"), "attention unresolved_conflict");
console.log("test:calendar:conflicts-readiness PASS");