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
const items = cal.ensurePreparationFromEvent(event);
const material = items.find((i) => i.category === "materials");
assert(material, "material item");
cal.transitionPreparationItem(material.itemId, "in_progress", "usr-mgr-001");
cal.markPreparationReady(material.itemId, "usr-mgr-001");
const promo = items.find((i) => i.category === "promotion");
cal.markPreparationReady(promo.itemId, "usr-mgr-001");
cal.setCommunicationState(promo.itemId, "sent_manually");
const summary = cal.buildPreparationSummary(event.event_id);
assert(summary.materialsReady >= 1, "material marked ready");
assert(summary.promotionReady >= 1, "promotion marked ready");
assert(items.every((i) => !i.durableAuthority), "no durable authority");
console.log("test:calendar:wave3b workflow PASS");
