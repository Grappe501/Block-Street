/**
 * CAE-11.6-W6 — Calendar tests
 */
import { calendarEngineService } from "./services/calendar-service";
import { seedCalendarIfEmpty } from "./services/seed";
import { getCalendarConstitution, OPS_CALENDAR_PRINCIPLE, REQUIRED_CALENDAR_SERVICES } from "./constitution";
import { checkOpsW6Invariants } from "./invariants";
import { explainEventInstitutionalContext } from "./traceability";
import { CALENDAR_EVENT_CATALOG } from "./events/catalog";

export type OpsW6TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW6CalendarTests(): OpsW6TestResult[] {
  seedCalendarIfEmpty();
  const results: OpsW6TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getCalendarConstitution();
  results.push({
    name: "calendar_principle",
    passed: constitution.governing_principle === OPS_CALENDAR_PRINCIPLE,
  });

  results.push({
    name: "required_calendar_services",
    passed: REQUIRED_CALENDAR_SERVICES.length === 15,
    detail: `${REQUIRED_CALENDAR_SERVICES.length} services`,
  });

  results.push({
    name: "w6_invariants",
    passed: checkOpsW6Invariants().every((i) => i.passed),
  });

  const calendar = calendarEngineService.calendar.get(institutionId);
  results.push({
    name: "canonical_calendar",
    passed: calendar.calendar_type === "institutional" && calendar.institution_id === institutionId,
    detail: calendar.calendar_id,
  });

  const events = calendarEngineService.events.list(institutionId);
  results.push({
    name: "seeded_events",
    passed: events.length >= 2,
    detail: `${events.length} events`,
  });

  const missionView = calendarEngineService.calendar.projectView(institutionId, "mission", { missionId: "opm-volunteer-training-001" });
  results.push({
    name: "mission_calendar_projection",
    passed: missionView.canonical === true && missionView.events.length >= 1,
    detail: `${missionView.events.length} mission events`,
  });

  const agenda = calendarEngineService.timeline.agenda(institutionId, "usr-001");
  results.push({
    name: "personal_agenda_view",
    passed: agenda.view === "agenda",
    detail: `${agenda.events.length} upcoming`,
  });

  const availability = calendarEngineService.availability.compute(institutionId, "usr-001", "2026-08-01", "2026-08-31");
  results.push({
    name: "availability_engine",
    passed: typeof availability.committed_hours === "number",
    detail: `committed=${availability.committed_hours}h`,
  });

  const conflicts = calendarEngineService.conflicts.detect(institutionId);
  results.push({
    name: "conflict_detection",
    passed: Array.isArray(conflicts),
    detail: `${conflicts.length} conflicts`,
  });

  const deadlines = calendarEngineService.deadlines.list(institutionId);
  results.push({
    name: "deadline_engine",
    passed: deadlines.length >= 1,
    detail: deadlines[0]?.title,
  });

  const timeline = calendarEngineService.timeline.build(institutionId);
  results.push({
    name: "historical_timeline",
    passed: timeline.searchable === true && timeline.institutional_memory === true,
    detail: `${timeline.events.length} timeline events`,
  });

  const trace = explainEventInstitutionalContext({
    event_id: events[0].event_id,
    institution_id: institutionId,
    mission_id: events[0].mission_id,
    calendar_id: calendar.calendar_id,
  });
  results.push({
    name: "event_traceability",
    passed: trace.includes("Calendar") && trace.includes("Institution"),
    detail: trace.slice(0, 60),
  });

  const ai = calendarEngineService.ai.analyze(institutionId);
  results.push({
    name: "ai_scheduling_advisory",
    passed: ai.advisory_only === true && ai.may_not_silently_schedule === true,
  });

  const intel = calendarEngineService.intelligence.analyze(institutionId);
  results.push({
    name: "time_intelligence",
    passed: !!intel.schedule_risk,
    detail: `risk=${intel.schedule_risk}`,
  });

  results.push({
    name: "calendar_event_catalog",
    passed: CALENDAR_EVENT_CATALOG.length >= 11,
    detail: `${CALENDAR_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW6TestsPassed(): boolean {
  return runOpsW6CalendarTests().every((t) => t.passed);
}
