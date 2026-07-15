/**
 * CAL-P2 Wave 1B — series exception tests.
 */
import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

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
cal.clearSessionProposedEventsForTest();
cal.clearSeriesStoreForTest();
cal.clearSeriesExceptionsForTest();

const { series, events } = cal.createEventSeries({
  title: "Exception test series",
  series: {
    title: "Exception test series",
    recurrenceRule: { frequency: "weekly", interval: 1, daysOfWeek: ["TU"], count: 3 },
    timezone: "America/Chicago",
    seriesStartDate: "2026-07-15",
    defaultStartTime: "19:00",
    defaultDurationMinutes: 90,
    scope: { collegeSlugs: ["uca"], countySlugs: [], citySlugs: [], teamIds: [], campaignWide: false },
    status: "active",
    eventType: "community_meeting",
    visibility: "internal",
    kellyRequested: false,
  },
});

const target = events[1] ?? events[0];
cal.addSeriesException({
  exceptionId: "exc-cancel-1",
  seriesId: series.seriesId,
  occurrenceKey: target.occurrence_key,
  eventId: target.event_id,
  type: "cancel",
  changes: {},
  reason: "Room unavailable",
  createdBy: "test-actor",
  createdAt: new Date().toISOString(),
});

assert(cal.isOccurrenceCanceled(series.seriesId, target.occurrence_key), "cancel exception");
const listed = cal.listSeriesExceptions(series.seriesId);
assert(listed.length === 1 && listed[0].reason === "Room unavailable", "auditable exception");

cal.addSeriesException({
  exceptionId: "exc-reschedule-1",
  seriesId: series.seriesId,
  occurrenceKey: events[2]?.occurrence_key ?? target.occurrence_key,
  eventId: events[2]?.event_id ?? target.event_id,
  type: "reschedule",
  changes: { start_at: "2026-08-01T01:00:00.000Z" },
  reason: "Rescheduled for finals week",
  createdBy: "test-actor",
  createdAt: new Date().toISOString(),
});
assert(cal.listSeriesExceptions(series.seriesId).length === 2, "reschedule stored");

const candidateTpl = cal.getTemplateById("tpl-candidate-appearance");
const preview = JSON.stringify(cal.buildTemplatePreview(candidateTpl));
assert(!preview.includes("PRIVATE"), "candidate preview excludes private defaults");

console.log("test:calendar:series-exceptions PASS");
