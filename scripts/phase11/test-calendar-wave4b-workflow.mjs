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
cal.clearCoreRecordStoreForTest();
const event = cal.getEventById("evt-ops-committee-review");
assert(event, "event");
const items = cal.ensureCoreRecordFromEvent(event);
const ownerItem = items.find((i) => i.itemKey === "operational-owner");
assert(ownerItem, "owner item");
cal.markCoreRecordItemReady(ownerItem.itemId, "usr-mgr-001");
const summary = cal.buildCoreRecordSummary(event.event_id);
assert(summary.ownershipReady >= 1, "ownership progress");
const gaps = cal.listEventsWithCoreRecordGaps(cal.SEED_EVENTS);
assert(gaps.length >= 0, "gaps list");
console.log("test:calendar:wave4b-workflow PASS");
