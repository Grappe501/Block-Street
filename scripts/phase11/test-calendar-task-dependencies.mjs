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
assert(tasks.length >= 2, "tasks exist");
const second = tasks[1];
assert(["blocked", "not_started"].includes(second.taskStatus), "second task state");
cal.completeTask(tasks[0].taskId, "usr-mgr-001");
cal.recomputeBlockedStatuses(event.event_id);
const after = cal.getTaskById(second.taskId);
assert(after && after.taskStatus !== "blocked", "unblocks after prereq complete");
const cycleAttempt = cal.addTaskDependency({ eventId: event.event_id, fromTaskId: tasks[2].taskId, toTaskId: tasks[0].taskId });
assert(cycleAttempt.blockedReasons.length > 0, "cycle rejected");
console.log("test:calendar:task-dependencies PASS");
