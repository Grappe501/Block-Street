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
assert(tasks.length >= 3, "template tasks seeded");
assert(tasks.every((t) => t.softBeta && !t.durableAuthority), "soft beta only");
assert(tasks[0].required, "required tasks");
console.log("test:calendar:task-model PASS");
