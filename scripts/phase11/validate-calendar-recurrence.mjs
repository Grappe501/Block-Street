/**
 * CAL-P2 Wave 1B — recurrence rule validation + fixture sync.
 */
import "../h-drive-env.mjs";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const dataDir = join(root, "data/calendar");

async function loadRecurrence() {
  try {
    const { createJiti } = await import("jiti");
    const jiti = createJiti(import.meta.url);
    return jiti(join(root, "src/lib/calendar/recurrence/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const jiti = require("jiti")(import.meta.url);
    return jiti(join(root, "src/lib/calendar/recurrence/index.ts"));
  }
}

const rec = await loadRecurrence();
const casesPath = join(dataDir, "recurrence-test-cases.json");
const cases = JSON.parse(readFileSync(casesPath, "utf8"));
const errors = [];

for (const tc of cases.rules) {
  errors.push(...rec.validateRecurrence(tc.rule, tc.seriesStartDate, tc.seriesEndDate).map((e) => `${tc.id}: ${e}`));
  const occ = rec.generateOccurrences("ser-validate", tc.rule, tc.seriesStartDate, tc.defaultStartTime ?? "18:00", tc.durationMinutes ?? 60, tc.options ?? {});
  const keys = occ.map((o) => o.occurrenceKey);
  const unique = new Set(keys);
  if (unique.size !== keys.length) errors.push(`${tc.id}: duplicate occurrence keys`);
  if (occ.length > 12 && !(tc.options?.maxOccurrences)) errors.push(`${tc.id}: preview not bounded`);
}

writeFileSync(
  join(dataDir, "recurring-series-fixtures.json"),
  JSON.stringify(
    {
      sampleWeekly: {
        title: "County organizing meeting",
        templateId: "tpl-county-organizing-meeting",
        seriesStartDate: "2026-08-04",
        defaultStartTime: "18:00",
        defaultDurationMinutes: 60,
        recurrenceRule: { frequency: "weekly", interval: 1, daysOfWeek: ["MO"], count: 8 },
      },
    },
    null,
    2,
  ),
);

if (errors.length) {
  console.error("Recurrence validation FAILED:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`Recurrence validation PASS — ${cases.rules.length} rule fixtures`);
