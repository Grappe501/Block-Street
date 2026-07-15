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
cal.clearStaffingStoreForTest();
cal.clearSeriesStoreForTest();
const tpl = cal.getTemplateById("tpl-campus-voter-registration-drive");
const apply = cal.applyTemplate({
  template: tpl,
  scopeSelection: { collegeSlugs: ["henderson-state"], countySlugs: ["clark"], citySlugs: [], teamIds: [], campaignWide: false },
  overrides: { start_at: "2026-08-01T15:00:00.000Z" },
});
const { events } = cal.createEventSeries({
  title: "VR series staffing test",
  templateId: tpl.templateId,
  templateVersion: tpl.version,
  applyResult: apply,
  series: {
    title: "VR series staffing test",
    recurrenceRule: { frequency: "weekly", interval: 1, daysOfWeek: ["MO"], count: 2 },
    timezone: "America/Chicago",
    seriesStartDate: "2026-08-04",
    defaultStartTime: "18:00",
    defaultDurationMinutes: 60,
    scope: { collegeSlugs: [], countySlugs: ["clark"], citySlugs: [], teamIds: [], campaignWide: false },
    status: "active",
    eventType: tpl.eventType,
    visibility: "public",
    kellyRequested: false,
  },
});
const r1 = cal.ensureStaffingFromEvent(events[0]);
const r2 = cal.ensureStaffingFromEvent(events[1]);
assert(r1.length > 0 && r2.length > 0, "requirements per occurrence");
assert(r1[0].requirementId !== r2[0].requirementId, "unique requirement IDs per occurrence");
console.log("test:calendar:staffing-series PASS");
