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
cal.clearLifecycleStoreForTest();
const approved = cal.getEventById("evt-henderson-vr-drive");
const pending = cal.getEventById("evt-kelly-campus-hold-asu");
assert(approved && pending, "seed events");
const approvedDim = cal.evaluateApprovalReadiness(approved);
assert(approvedDim.state === "ready", "approved event ready");
const pendingDim = cal.evaluateApprovalReadiness(pending);
assert(pendingDim.state === "in_progress", "submitted event in progress");
const readiness = cal.evaluateEventReadiness(pending);
const approval = readiness.find((r) => r.dimension === "approval");
assert(approval?.dimension === "approval", "approval dimension wired");
console.log("test:calendar:lifecycle-readiness PASS");
