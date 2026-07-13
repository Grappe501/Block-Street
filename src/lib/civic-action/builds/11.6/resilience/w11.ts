/**
 * CAE-11.6-W11 — Resilience certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getResilienceConstitution, OPS_RESILIENCE_PRINCIPLE, REQUIRED_RESILIENCE_SERVICES } from "./constitution";
import { checkOpsW11Invariants, OPS_W11_INVARIANTS } from "./invariants";
import { allOpsW11TestsPassed, runOpsW11ResilienceTests } from "./w11-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/11_RESILIENCE_CONTINUITY_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/RESILIENCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/CONTINUITY_PLANNING.md",
  "docs/phase-11/11.6-institutional-operations/INCIDENT_COMMAND.md",
  "docs/phase-11/11.6-institutional-operations/RECOVERY_PLANNING.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_11_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/resilience_vocabulary.json",
  "data/phase-11/critical_functions.json",
  "data/phase-11/incident_levels.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/resilience/constitution.ts",
  "src/lib/civic-action/builds/11.6/resilience/w11.ts",
  "src/lib/civic-action/builds/11.6/resilience/services/resilience-service.ts",
  "src/app/api/v1/resilience/plans/route.ts",
];

export interface Wave11Certification {
  wave_id: "11.6-W11";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Institutional Resilience, Continuity & Emergency Operations Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW11Certification(): Wave11Certification {
  const constitution = getResilienceConstitution();
  const registry = loadRequirementsRegistry();
  const w11Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W11");
  const testResults = runOpsW11ResilienceTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/resilience_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/resilience_vocabulary.json"), "utf8"))
    : { terms: [] };
  const functions = existsSync(join(ROOT, "data/phase-11/critical_functions.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/critical_functions.json"), "utf8"))
    : { functions: [] };
  const levels = existsSync(join(ROOT, "data/phase-11/incident_levels.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/incident_levels.json"), "utf8"))
    : { levels: [] };

  const gates = [
    { id: "CAE-11.6-W11-G01", name: "Resilience principle", passed: constitution.governing_principle === OPS_RESILIENCE_PRINCIPLE, detail: "testable continuity plans" },
    { id: "CAE-11.6-W11-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W11-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + functions + levels" },
    { id: "CAE-11.6-W11-G04", name: "Critical functions", passed: functions.functions?.length >= 10, detail: `${functions.functions?.length ?? 0} functions` },
    { id: "CAE-11.6-W11-G05", name: "Incident levels", passed: levels.levels?.length >= 5, detail: `${levels.levels?.length ?? 0} levels` },
    { id: "CAE-11.6-W11-G06", name: "W11 requirements", passed: w11Reqs.length >= 30 && w11Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w11Reqs.length} requirements` },
    { id: "CAE-11.6-W11-G07", name: "Resilience services", passed: REQUIRED_RESILIENCE_SERVICES.length === 14, detail: REQUIRED_RESILIENCE_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W11-G08", name: "Resilience tests", passed: allOpsW11TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W11-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W11-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW11Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W11_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW11TestsPassed();

  return {
    wave_id: "11.6-W11",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Institutional Resilience, Continuity & Emergency Operations Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW11Complete(): boolean {
  return runOpsW11Certification().all_passed;
}
