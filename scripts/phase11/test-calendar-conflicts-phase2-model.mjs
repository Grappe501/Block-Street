import "../h-drive-env.mjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const fixtures = JSON.parse(readFileSync(join(root, "data/calendar/conflict-phase2-test-fixtures.json"), "utf8"));
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
cal.clearConflictStoreForTest();

const travelFixture = fixtures.find((f) => f.expectTravelBuffer);
const kelly = cal.getEventById(travelFixture.eventId);
const henderson = cal.getEventById(travelFixture.pairedEventId);
assert(kelly && henderson, "travel pair events");
const buffers = cal.detectKellyTravelBuffers([kelly, henderson]);
assert(buffers.some((b) => b.eventIds.includes(kelly.event_id) && b.eventIds.includes(henderson.event_id)), "travel buffer detected");

const resourceFixture = fixtures.find((f) => f.expectResourceOverlap);
const a = cal.getEventById(resourceFixture.eventId);
const b = cal.getEventById(resourceFixture.overlapWith);
assert(a && b, "resource pair base");
const overlapA = { ...a, start_at: b.start_at, end_at: b.end_at, assigned_human_ids: [resourceFixture.sharedHuman] };
const overlapB = { ...b, assigned_human_ids: [resourceFixture.sharedHuman] };
const resources = cal.detectResourceOverlaps([overlapA, overlapB]);
assert(resources.length >= 1, "resource overlap detected");

cal.ensureConflictsFromEvents([kelly, henderson, overlapA, overlapB]);
const travelRecords = cal.listTravelBufferConflicts();
assert(travelRecords.length >= 1, "travel records");
assert(cal.canTransitionConflictResolution("open", "resolved"), "resolution transition");

const conflictId = "conf-kelly-asu-buffer";
cal.ensureConflictsForEvent(kelly);
const items = cal.listConflictItems({ conflictId });
for (const item of items.filter((i) => i.blocksResolution)) {
  cal.markConflictItemReady(item.itemId, "usr-mgr-001");
}
assert(cal.isConflictRecordResolvable(conflictId), "resolvable");
const resolved = cal.resolveConflictRecord(conflictId, "usr-mgr-001", "Schedule adjusted");
assert(resolved?.resolutionStatus === "resolved", "resolved record");
assert(cal.listResolvedConflicts().some((r) => r.conflictId === conflictId), "resolved list");

cal.clearConflictStoreForTest();
cal.ensureConflictsFromEvents(cal.SEED_EVENTS);
const override = cal.approveConflictOverride("conf-kelly-asu-buffer", "usr-mgr-001", "Campaign priority override");
assert(override?.resolutionStatus === "override_approved", "override");

console.log("test:calendar:conflicts-phase2-model PASS");
