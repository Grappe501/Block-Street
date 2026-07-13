/**
 * CAE-11.6-W13 — Improvement certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getImprovementConstitution, OPS_IMPROVEMENT_PRINCIPLE, REQUIRED_IMPROVEMENT_SERVICES } from "./constitution";
import { checkOpsW13Invariants, OPS_W13_INVARIANTS } from "./invariants";
import { allOpsW13TestsPassed, runOpsW13ImprovementTests } from "./w13-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/13_IMPROVEMENT_MEASUREMENT_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/IMPROVEMENT_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/KPI_REGISTRY.md",
  "docs/phase-11/11.6-institutional-operations/CONTINUOUS_IMPROVEMENT.md",
  "docs/phase-11/11.6-institutional-operations/OUTCOME_MEASUREMENT.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_13_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/improvement_vocabulary.json",
  "data/phase-11/measurement_categories.json",
  "data/phase-11/outcome_types.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/improvement/constitution.ts",
  "src/lib/civic-action/builds/11.6/improvement/w13.ts",
  "src/lib/civic-action/builds/11.6/improvement/services/improvement-service.ts",
  "src/app/api/v1/improvement/dashboard/route.ts",
];

export interface Wave13Certification {
  wave_id: "11.6-W13";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Institutional Measurement, Performance, Outcomes & Continuous Improvement Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW13Certification(): Wave13Certification {
  const constitution = getImprovementConstitution();
  const registry = loadRequirementsRegistry();
  const w13Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W13");
  const testResults = runOpsW13ImprovementTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/improvement_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/improvement_vocabulary.json"), "utf8"))
    : { terms: [] };
  const categories = existsSync(join(ROOT, "data/phase-11/measurement_categories.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/measurement_categories.json"), "utf8"))
    : { categories: [] };
  const outcomes = existsSync(join(ROOT, "data/phase-11/outcome_types.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/outcome_types.json"), "utf8"))
    : { types: [] };

  const gates = [
    { id: "CAE-11.6-W13-G01", name: "Improvement principle", passed: constitution.governing_principle === OPS_IMPROVEMENT_PRINCIPLE, detail: "mission impact over activity" },
    { id: "CAE-11.6-W13-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W13-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + categories + outcomes" },
    { id: "CAE-11.6-W13-G04", name: "Measurement categories", passed: categories.categories?.length >= 18, detail: `${categories.categories?.length ?? 0} categories` },
    { id: "CAE-11.6-W13-G05", name: "Outcome types", passed: outcomes.types?.length >= 8, detail: `${outcomes.types?.length ?? 0} types` },
    { id: "CAE-11.6-W13-G06", name: "W13 requirements", passed: w13Reqs.length >= 30 && w13Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w13Reqs.length} requirements` },
    { id: "CAE-11.6-W13-G07", name: "Improvement services", passed: REQUIRED_IMPROVEMENT_SERVICES.length === 15, detail: REQUIRED_IMPROVEMENT_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W13-G08", name: "Improvement tests", passed: allOpsW13TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W13-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W13-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW13Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W13_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW13TestsPassed();

  return {
    wave_id: "11.6-W13",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Institutional Measurement, Performance, Outcomes & Continuous Improvement Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW13Complete(): boolean {
  return runOpsW13Certification().all_passed;
}
