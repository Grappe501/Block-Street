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
cal.clearStaffingStoreForTest();
const event = cal.getEventById("evt-henderson-vr-drive");
cal.ensureStaffingFromEvent(event);
const item = cal.evaluateStaffingReadiness(event);
assert(item.dimension === "staffing", "staffing dimension");
assert(item.state === "not_started" || item.state === "in_progress", "readiness reflects plan state");
console.log("test:calendar:staffing-readiness PASS");
