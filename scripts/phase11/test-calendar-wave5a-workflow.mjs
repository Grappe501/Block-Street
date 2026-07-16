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
const item = cal.listConflictItems({ conflictId: "conf-kelly-asu-buffer", eventId: event.event_id }).find(
  (i) => i.itemKey === "identify-parties",
);
assert(item, "identify item");
cal.transitionConflictItem(item.itemId, "in_progress", "usr-mgr-001");
cal.markConflictItemReady(item.itemId, "usr-mgr-001");
const updated = cal.getConflictItemById(item.itemId);
assert(updated?.itemStatus === "ready", "item ready");
const summaries = cal.listEventConflictSummaries(event.event_id);
assert(summaries.length >= 1, "event summaries");
console.log("test:calendar:wave5a-workflow PASS");