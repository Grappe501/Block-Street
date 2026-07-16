import "../h-drive-env.mjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const fixtures = JSON.parse(readFileSync(join(root, "data/calendar/conflict-test-fixtures.json"), "utf8"));
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
for (const f of fixtures) {
  const event = cal.getEventById(f.eventId);
  assert(event, `event ${f.eventId}`);
  const records = cal.ensureConflictsForEvent(event);
  for (const id of f.expectConflictIds) {
    assert(records.some((r) => r.conflictId === id), `${f.eventId} has ${id}`);
    const record = cal.getConflictRecordById(id);
    assert(record, `record ${id}`);
    if (f.state) assert(record.state === f.state, `${id} state`);
    if (f.kind) assert(record.kind === f.kind, `${id} kind`);
    const items = cal.listConflictItems({ conflictId: id, eventId: f.eventId });
    if (f.expectResolutionItemsMin) {
      assert(items.length >= f.expectResolutionItemsMin, `${f.eventId} resolution items`);
    }
    const summary = cal.buildConflictSummary(id);
    assert(summary, `${id} summary`);
    if (f.linkedToKelly) assert(summary.eventIds.length >= 2, `${id} multi-event`);
  }
}
const seed = cal.getConflictRecordById("conf-kelly-asu-buffer");
assert(seed, "seed conflict");
const unresolved = cal.listUnresolvedConflicts();
assert(unresolved.some((r) => r.conflictId === "conf-kelly-asu-buffer"), "unresolved list");
const candidates = cal.listCandidateConflicts();
assert(candidates.some((r) => r.conflictId === "conf-kelly-asu-buffer"), "candidate list");
const overlaps = cal.detectScheduleOverlaps(cal.SEED_EVENTS);
assert(Array.isArray(overlaps), "overlap detection");
assert(cal.canTransitionConflictItem("not_started", "ready"), "item transition");
console.log("test:calendar:conflicts-model PASS");