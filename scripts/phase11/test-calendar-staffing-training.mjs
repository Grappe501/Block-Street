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
const missing = cal.evaluateTrainingEligibility("usr-demo-001", ["voter_registration_rules"]);
assert(!missing.eligible, "missing training detected");
cal.saveTrainingStatus({ userId: "usr-demo-001", trainingKey: "voter_registration_rules", status: "verified", completedAt: new Date().toISOString(), source: "soft_beta" });
const ok = cal.evaluateTrainingEligibility("usr-demo-001", ["voter_registration_rules"]);
assert(ok.eligible, "verified training");
console.log("test:calendar:staffing-training PASS");
