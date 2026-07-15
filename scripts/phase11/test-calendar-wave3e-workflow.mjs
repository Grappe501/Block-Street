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
cal.clearCandidateStoreForTest();
const event = cal.getEventById("evt-uca-networking");
const items = cal.ensureCandidateRequestFromEvent(event);
for (const item of items.filter((i) => i.required && i.category !== "confirmation")) {
  cal.markCandidateItemReady(item.itemId, "usr-mgr-001");
}
const summary = cal.buildCandidateSummary(event.event_id, event.kelly_attendance_status);
assert(summary.requestReady >= 1, "request items ready");
console.log("test:calendar:wave3e-workflow PASS");
