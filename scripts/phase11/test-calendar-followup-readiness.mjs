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
cal.ensureFollowUpFromEvent(completed);
const pre = cal.evaluateFollowUpReadiness(event);
assert(pre.state === "not_required", `pre-event ${pre.state}`);
const blocked = cal.evaluateFollowUpReadiness(completed);
assert(blocked.state === "blocked", `completed missing report ${blocked.state}`);
const summary = cal.buildFollowUpSummary(completed.event_id);
assert(summary.metricsTotal >= 2, "metrics summary");
assert(summary.incompleteRequired >= 1, "incomplete required");
console.log("test:calendar:followup-readiness PASS");
