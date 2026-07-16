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
cal.clearCoreRecordStoreForTest();
const owned = cal.getEventById("evt-henderson-vr-drive");
const unowned = cal.getEventById("evt-ops-committee-review");
assert(owned && unowned, "seed events");
assert(cal.evaluateOwnershipReadiness(owned).state === "ready", "owned ready");
assert(cal.evaluateOwnershipReadiness(unowned).state === "blocked", "unowned blocked");
assert(cal.evaluateDateTimeReadiness(owned).state === "ready", "schedule ready");
const readiness = cal.evaluateEventReadiness(unowned);
assert(readiness.some((r) => r.dimension === "ownership" && r.state === "blocked"), "ownership wired");
assert(readiness.some((r) => r.dimension === "venue"), "venue wired");
console.log("test:calendar:core-record-readiness PASS");
