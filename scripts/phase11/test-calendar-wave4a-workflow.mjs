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
cal.clearLifecycleStoreForTest();
const event = cal.getEventById("evt-kelly-campus-hold-asu");
assert(event, "event");
const items = cal.ensureLifecycleFromEvent(event);
const submit = items.find((i) => i.itemKey === "submit-for-approval");
assert(submit, "submit item");
cal.markLifecycleItemReady(submit.itemId, "usr-mgr-001");
const summary = cal.buildLifecycleSummary(event.event_id, event.operational_status, event.approval_status);
assert(summary.approvalReady >= 1, "approval progress");
const needing = cal.listEventsNeedingLifecycleAction(cal.SEED_EVENTS);
assert(needing.length > 0, "pending list");
console.log("test:calendar:wave4a-workflow PASS");
