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
cal.clearFollowUpStoreForTest();
const event = cal.getEventById("evt-henderson-vr-drive");
const completed = {
  ...event,
  operational_status: "completed",
  end_at: "2026-07-10T20:00:00.000Z",
};
const items = cal.ensureFollowUpFromEvent(completed);
const metric = items.find((i) => i.category === "metric" && i.required);
assert(metric, "metric item");
cal.setFollowUpFieldValue(metric.itemId, { valueCount: 42 }, "usr-mgr-001");
cal.submitFollowUpItem(metric.itemId, "usr-mgr-001");
for (const item of items.filter((i) => i.required && i.itemId !== metric.itemId)) {
  cal.submitFollowUpItem(item.itemId, "usr-mgr-001");
}
const summary = cal.buildFollowUpSummary(completed.event_id);
assert(summary.incompleteRequired === 0, "all required submitted");
const readiness = cal.evaluateFollowUpReadiness(completed);
assert(readiness.state === "complete", readiness.state);
assert(items.every((i) => !i.durableAuthority), "no durable authority");
console.log("test:calendar:wave3c-workflow PASS");
