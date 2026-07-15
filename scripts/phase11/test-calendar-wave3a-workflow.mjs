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
const tasks = cal.ensureTasksFromEvent(event);
cal.assignTaskOwner(tasks[0].taskId, "usr-demo-001", "event_board_member");
cal.completeTask(tasks[0].taskId, "usr-mgr-001");
cal.startTask(tasks[1].taskId, "usr-mgr-001");
const sched = cal.buildTaskChecklistSummary(event.event_id);
assert(sched.completeCount >= 1, "completion tracked");
assert(tasks.every((t) => !t.durableAuthority), "no durable authority on seed");
console.log("test:calendar:wave3a workflow PASS");
