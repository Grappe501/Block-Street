/**
 * CAL-P2 Wave 1B — recurrence generation tests.
 */
import "../h-drive-env.mjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/recurrence/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/recurrence/index.ts"));
  }
}

const rec = await load();
const cases = JSON.parse(readFileSync(join(root, "data/calendar/recurrence-test-cases.json"), "utf8"));

for (const tc of cases.rules) {
  const occ = rec.generateOccurrences("ser-test", tc.rule, tc.seriesStartDate, tc.defaultStartTime ?? "18:00", tc.durationMinutes ?? 60, tc.options ?? {});
  assert(occ.length > 0, `${tc.id} generates occurrences`);
  assert(occ.length <= 12, `${tc.id} preview bounded`);
  const keys = occ.map((o) => o.occurrenceKey);
  assert(new Set(keys).size === keys.length, `${tc.id} stable unique keys`);
  const again = rec.generateOccurrences("ser-test", tc.rule, tc.seriesStartDate, tc.defaultStartTime ?? "18:00", tc.durationMinutes ?? 60, tc.options ?? {});
  assert(again[0].occurrenceKey === occ[0].occurrenceKey, `${tc.id} deterministic keys`);
}

const weekly = rec.generateOccurrences("ser-wk", { frequency: "weekly", interval: 1, daysOfWeek: ["MO"], count: 3 }, "2026-07-13", "18:00", 60);
assert(weekly.length === 3, "end by count");
assert(rec.describeRecurrence({ frequency: "weekly", interval: 2, daysOfWeek: ["WE"] }, "19:00").includes("week"), "plain language");

console.log("test:calendar:recurrence PASS");
