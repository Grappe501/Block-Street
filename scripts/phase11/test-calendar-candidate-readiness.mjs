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
const noReq = cal.getEventById("evt-henderson-vr-drive");
cal.ensureCandidateRequestFromEvent(event);
const readiness = cal.evaluateCandidateReadiness(event);
assert(readiness.dimension === "candidate", "candidate dimension");
assert(["in_progress", "blocked", "ready"].includes(readiness.state), readiness.state);
const na = cal.evaluateCandidateReadiness(noReq);
assert(na.state === "not_required", "vr drive not required");
console.log("test:calendar:candidate-readiness PASS");
