/**
 * CAE-11.6-W6 — Calendar certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getCalendarConstitution, OPS_CALENDAR_PRINCIPLE, REQUIRED_CALENDAR_SERVICES } from "./constitution";
import { checkOpsW6Invariants, OPS_W6_INVARIANTS } from "./invariants";
import { allOpsW6TestsPassed, runOpsW6CalendarTests } from "./w6-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/06_CALENDAR_TIME_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/CALENDAR_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/EVENT_LIFECYCLE.md",
  "docs/phase-11/11.6-institutional-operations/SCHEDULING_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/TIME_ZONE_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_6_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/calendar_vocabulary.json",
  "data/phase-11/event_lifecycle.json",
  "data/phase-11/calendar_views.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/calendar/constitution.ts",
  "src/lib/civic-action/builds/11.6/calendar/w6.ts",
  "src/lib/civic-action/builds/11.6/calendar/services/calendar-service.ts",
  "src/app/api/v1/calendar/route.ts",
];

export interface Wave6Certification {
  wave_id: "11.6-W6";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Universal Calendar, Scheduling & Time Intelligence Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW6Certification(): Wave6Certification {
  const constitution = getCalendarConstitution();
  const registry = loadRequirementsRegistry();
  const w6Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W6");
  const testResults = runOpsW6CalendarTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/calendar_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/calendar_vocabulary.json"), "utf8"))
    : { terms: [] };
  const lifecycle = existsSync(join(ROOT, "data/phase-11/event_lifecycle.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/event_lifecycle.json"), "utf8"))
    : { stages: [] };
  const views = existsSync(join(ROOT, "data/phase-11/calendar_views.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/calendar_views.json"), "utf8"))
    : { views: [] };

  const gates = [
    { id: "CAE-11.6-W6-G01", name: "Calendar principle", passed: constitution.governing_principle === OPS_CALENDAR_PRINCIPLE, detail: "one canonical time engine" },
    { id: "CAE-11.6-W6-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W6-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + lifecycle + views" },
    { id: "CAE-11.6-W6-G04", name: "Event lifecycle", passed: lifecycle.stages?.length >= 7, detail: `${lifecycle.stages?.length ?? 0} stages` },
    { id: "CAE-11.6-W6-G05", name: "Calendar views", passed: views.views?.length >= 10, detail: `${views.views?.length ?? 0} views` },
    { id: "CAE-11.6-W6-G06", name: "W6 requirements", passed: w6Reqs.length >= 30 && w6Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w6Reqs.length} requirements` },
    { id: "CAE-11.6-W6-G07", name: "Calendar services", passed: REQUIRED_CALENDAR_SERVICES.length === 15, detail: REQUIRED_CALENDAR_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W6-G08", name: "Calendar tests", passed: allOpsW6TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W6-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W6-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW6Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W6_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW6TestsPassed();

  return {
    wave_id: "11.6-W6",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Universal Calendar, Scheduling & Time Intelligence Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW6Complete(): boolean {
  return runOpsW6Certification().all_passed;
}
