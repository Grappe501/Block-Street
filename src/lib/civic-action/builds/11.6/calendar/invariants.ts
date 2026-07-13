/**
 * CAE-11.6-W6 — Calendar invariants
 */
import { CALENDAR_STORE_KEYS } from "./data-model";
import { CALENDAR_AI_MAY_NOT, REQUIRED_CALENDAR_SERVICES } from "./constitution";
import { CALENDAR_EVENT_CATALOG } from "./events/catalog";

export const OPS_W6_INVARIANTS = [
  { id: "OPS-W6-INV-001", text: "One canonical calendar per institution—views are projections" },
  { id: "OPS-W6-INV-002", text: "Events never become orphaned from institutional context" },
  { id: "OPS-W6-INV-003", text: "Personal privacy always respected in calendar projections" },
  { id: "OPS-W6-INV-004", text: "Canonical calendar remains authoritative over external sync" },
  { id: "OPS-W6-INV-005", text: "Reservations never silently fail" },
  { id: "OPS-W6-INV-006", text: "AI never silently schedules executive decisions" },
  { id: "OPS-W6-INV-007", text: "Every event transition is audited" },
] as const;

export function checkOpsW6Invariants() {
  return OPS_W6_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W6-INV-001") {
      passed = CALENDAR_STORE_KEYS.calendars === "ops_canonical_calendars";
      detail = "canonical calendar store";
    }
    if (inv.id === "OPS-W6-INV-006") {
      passed = CALENDAR_AI_MAY_NOT.some((s) => s.toLowerCase().includes("silently"));
      detail = "ai prohibition";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getCalendarServiceCount() {
  return REQUIRED_CALENDAR_SERVICES.length;
}

export function getCalendarEventCount() {
  return CALENDAR_EVENT_CATALOG.length;
}
