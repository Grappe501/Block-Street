/**
 * CAL-01.. soft-beta calendar invariants and journey checks.
 */
import "../h-drive-env.mjs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Dynamic import of compiled-less TS via tsx? Prefer spawning with node --import tsx or use jiti.
// Soft approach: read seed via child using existing Next ts transpile isn't available.
// Use dynamic import of .ts through jiti if present, else register ts-node.

async function loadCalendar() {
  try {
    const { register } = await import("node:module");
    // Prefer tsx
  } catch {
    /* ignore */
  }
  const jitiPath = join(root, "node_modules/jiti/lib/index.js");
  try {
    const { createJiti } = await import("jiti");
    const jiti = createJiti(import.meta.url);
    return jiti(join(root, "src/lib/calendar/index.ts"));
  } catch {
    const require = createRequire(import.meta.url);
    try {
      const jiti = require("jiti")(import.meta.url);
      return jiti(join(root, "src/lib/calendar/index.ts"));
    } catch (e) {
      console.error("Need jiti or tsx to load calendar module:", e.message);
      process.exit(1);
    }
  }
}

const cal = await loadCalendar();

const dupes = cal.assertNoDuplicateEventIds();
assert(dupes.length === 0, `duplicate event ids: ${dupes.join(",")}`);

const henderson = cal.getEventById("evt-henderson-vr-drive");
assert(henderson, "henderson event missing");
assert(henderson.city_ready === true, "city_ready required");
assert(henderson.college_slugs.includes("henderson-state"), "college scope");
assert(henderson.county_slugs.includes("clark"), "county scope");
assert(henderson.calendar_scope_ids.includes("universal"), "universal scope ref");

const collegeView = cal.listEventsForScope({ kind: "college", collegeSlug: "henderson-state" });
assert(collegeView.some((e) => e.event_id === henderson.event_id), "college calendar must reference same id");
const countyView = cal.listEventsForScope({ kind: "county", countySlug: "clark" });
assert(countyView.some((e) => e.event_id === henderson.event_id), "county calendar must reference same id");
const uni = cal.listEventsForScope({ kind: "universal" });
assert(uni.some((e) => e.event_id === henderson.event_id), "universal must reference same id");

const uca = cal.getEventById("evt-uca-networking");
assert(uca.security_or_private_notes, "private notes exist internally");
const publicLabel = cal.publicKellyLabel(uca);
assert(publicLabel && !/17:20|lodging|PRIVATE/i.test(publicLabel), "kelly privacy must not leak travel");
const ics = cal.buildIcsCalendar("universal");
assert(ics.includes("BEGIN:VCALENDAR"), "ics export");
assert(!ics.includes("PRIVATE lodging"), "ics must not leak private notes");
assert(!ics.includes(uca.security_or_private_notes), "ics privacy");

const needs = cal.listVolunteerNeeds({ kind: "volunteer" });
assert(needs.length > 0, "volunteer needs");
assert(needs.every((n) => n.event_id), "needs reference event_id");

const kelly = cal.listKellyRequests({ kind: "kelly" });
assert(kelly.length > 0, "kelly requests");

const pending = cal.listPendingApprovals({ kind: "command" });
assert(pending.length >= 1, "pending approvals");

assert(cal.FUTURE_CITY_CALENDAR_READY === true, "future city schema ready");

const proposed = cal.proposeEvent({
  title: "Test soft-beta proposal",
  description: "Sandbox proposal",
  start_time: "2026-09-01T10:00",
  end_time: "2026-09-01T11:00",
  event_type: "networking_event",
  college_slug: "uca",
  kelly_requested: true,
  volunteers_needed: 3,
});
assert(proposed.approval_status === "submitted", "proposal submitted");
assert(proposed.kelly_attendance_status === "requested", "kelly request != confirmed");
assert(proposed.operational_status === "proposed", "ops proposed");
assert(cal.getEventById(proposed.event_id)?.event_id === proposed.event_id, "same record");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      events: cal.allCanonicalEvents().length,
      volunteerNeeds: needs.length,
      kellyRequests: kelly.length,
      pendingApprovals: pending.length,
      cityReady: true,
    },
    null,
    2,
  ),
);
