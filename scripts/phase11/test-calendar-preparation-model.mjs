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
assert(items.length >= 8, `template items seeded (${items.length})`);
assert(items.every((i) => i.softBeta && !i.durableAuthority), "soft beta only");
assert(items.some((i) => i.category === "logistics"), "logistics");
assert(items.some((i) => i.category === "materials"), "materials");
assert(items.some((i) => i.category === "promotion"), "promotion");
console.log("test:calendar:preparation-model PASS");
