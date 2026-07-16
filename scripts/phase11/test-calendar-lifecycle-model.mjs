import "../h-drive-env.mjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const fixtures = JSON.parse(readFileSync(join(root, "data/calendar/lifecycle-test-fixtures.json"), "utf8"));
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
for (const f of fixtures) {
  const event = cal.getEventById(f.eventId);
  assert(event, `event ${f.eventId}`);
  const items = cal.ensureLifecycleFromEvent(event);
  assert(items.length >= f.expectApprovalItems, `${f.eventId} approval items`);
  const history = cal.buildMergedHistoryTimeline(f.eventId);
  assert(history.length >= f.expectHistoryMin, `${f.eventId} history`);
  const summary = cal.buildLifecycleSummary(f.eventId, event.operational_status, event.approval_status);
  assert(summary.operationalStatus === f.operationalStatus, `${f.eventId} operational`);
}
assert(cal.canTransitionOperational("scheduled", "confirmed"), "scheduled→confirmed");
assert(!cal.canTransitionOperational("archived", "scheduled"), "archived blocked");
console.log("test:calendar:lifecycle-model PASS");
