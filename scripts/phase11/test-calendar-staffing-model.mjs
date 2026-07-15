import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
function assert(c, m) { if (!c) throw new Error(m); }
async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/staffing/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/staffing/index.ts"));
  }
}
const s = await load();
assert(s.STAFFING_ROLE_CATALOG.length >= 30, "role catalog");
assert(s.TRAINING_CATALOG.length >= 13, "training catalog");
assert(s.validateRequirementRegistry([]).length === 0, "empty registry ok");
const bad = s.validateShift({ shiftId: "x", eventId: "e", requirementId: "r", name: "n", roleKey: "k", roleLabel: "l", startAt: "2026-01-02T00:00:00Z", endAt: "2026-01-01T00:00:00Z", minimumNeeded: 1, targetNeeded: 2, leadRequired: false, trainingRequirementKeys: [], generatedFromRequirement: false, generatedFromTemplate: false, createdAt: "", updatedAt: "", status: "open", shiftLeadUserIds: [] });
assert(bad.length > 0, "invalid shift times fail");
console.log("test:calendar:staffing-model PASS");
