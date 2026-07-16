import "../h-drive-env.mjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const fixtures = JSON.parse(readFileSync(join(root, "data/calendar/core-record-test-fixtures.json"), "utf8"));
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
for (const f of fixtures) {
  const event = cal.getEventById(f.eventId);
  assert(event, `event ${f.eventId}`);
  const items = cal.ensureCoreRecordFromEvent(event);
  if (f.expectOwnershipItems) {
    assert(items.filter((i) => i.category === "ownership").length === f.expectOwnershipItems, `${f.eventId} ownership count`);
  }
  if (f.expectScheduleItems) {
    assert(items.filter((i) => i.category === "schedule").length === f.expectScheduleItems, `${f.eventId} schedule count`);
  }
  if (f.expectVenueItems) {
    assert(items.filter((i) => i.category === "venue").length === f.expectVenueItems, `${f.eventId} venue count`);
  }
  const summary = cal.buildCoreRecordSummary(f.eventId);
  if (f.ownershipReady) assert(summary.ownershipReady >= 1, `${f.eventId} ownership ready`);
  if (f.ownershipReady === false) assert(summary.ownershipReady < summary.ownershipTotal, `${f.eventId} ownership gap`);
  if (f.venueVirtual) {
    const venue = cal.evaluateVenueReadiness(event);
    assert(venue.state === "ready" || venue.state === "in_progress", `${f.eventId} virtual venue`);
  }
}
const missing = cal.listEventsMissingOwnership(cal.SEED_EVENTS);
assert(missing.some((e) => e.event_id === "evt-ops-committee-review"), "missing ownership list");
console.log("test:calendar:core-record-model PASS");
