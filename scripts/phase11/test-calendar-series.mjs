/**
 * CAL-P2 Wave 1B — series creation and occurrence identity tests.
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

const tpl = cal.getTemplateById("tpl-county-organizing-meeting");
const apply = cal.applyTemplate({
  template: tpl,
  scopeSelection: { collegeSlugs: [], countySlugs: ["clark"], citySlugs: [], teamIds: [], campaignWide: false },
  overrides: { start_at: "2026-08-04T23:00:00.000Z" },
});

const { series, events } = cal.createEventSeries({
  title: "Clark county rhythm",
  templateId: tpl.templateId,
  templateVersion: tpl.version,
  applyResult: apply,
  series: {
    title: "Clark county rhythm",
    templateId: tpl.templateId,
    templateVersion: tpl.version,
    recurrenceRule: { frequency: "weekly", interval: 1, daysOfWeek: ["MO"], count: 4 },
    timezone: "America/Chicago",
    seriesStartDate: "2026-08-04",
    defaultStartTime: "18:00",
    defaultDurationMinutes: 60,
    scope: { collegeSlugs: [], countySlugs: ["clark"], citySlugs: [], teamIds: [], campaignWide: false },
    status: "active",
    eventType: tpl.eventType,
    visibility: "internal",
    kellyRequested: false,
  },
});

assert(series.seriesId, "series created");
assert(events.length >= 1 && events.length <= 4, "bounded occurrences");
const ids = new Set(events.map((e) => e.event_id));
assert(ids.size === events.length, "unique event ids");
assert(events.every((e) => e.series_id === series.seriesId), "shared series id");
assert(events.every((e) => e.generated_from_series), "generated flag");

const all = [...cal.SEED_EVENTS, ...cal.getSessionProposedEvents()];
const listed = cal.listEventsForSeries(series.seriesId, all);
assert(listed.length === events.length, "listEventsForSeries");

const first = events[0];
const firstOps = cal.buildEventOperationsSummary(first);
const secondOps = cal.buildEventOperationsSummary(events[1] ?? first);
assert(firstOps.eventId !== secondOps.eventId || events.length === 1, "independent occurrence ops");

if (cal.splitSeriesAtOccurrence) {
  const split = cal.splitSeriesAtOccurrence(series.seriesId, events[1]?.occurrence_key ?? events[0].occurrence_key);
  assert(split.fork.parentSeriesId === series.seriesId, "split creates child series");
}

console.log("test:calendar:series PASS");
