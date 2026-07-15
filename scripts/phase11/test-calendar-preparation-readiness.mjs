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
cal.clearPreparationStoreForTest();
const event = cal.getEventById("evt-henderson-vr-drive");
cal.ensurePreparationFromEvent(event);
const materials = cal.evaluateMaterialsReadiness(event);
assert(materials.dimension === "materials", "materials dimension");
assert(["not_started", "in_progress", "blocked", "ready", "not_required"].includes(materials.state), materials.state);
const promotion = cal.evaluatePromotionReadiness(event);
assert(promotion.dimension === "promotion", "promotion dimension");
const summary = cal.buildPreparationSummary(event.event_id);
assert(summary.materialsTotal >= 2, "materials summary");
assert(summary.promotionTotal >= 1, "promotion summary");
console.log("test:calendar:preparation-readiness PASS");
