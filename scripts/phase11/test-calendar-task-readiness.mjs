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
cal.clearTasksStoreForTest();
const event = cal.getEventById("evt-henderson-vr-drive");
cal.ensureTasksFromEvent(event);
const readiness = cal.evaluateEventTasksReadiness(event);
assert(readiness.dimension === "tasks", "tasks dimension");
assert(["not_started", "in_progress", "blocked", "ready"].includes(readiness.state), readiness.state);
const summary = cal.buildTaskChecklistSummary(event.event_id);
assert(summary.totalTasks >= 3, "checklist summary");
console.log("test:calendar:task-readiness PASS");
