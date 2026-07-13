/**
 * CAE-11.6-W5 — Resource certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getResourceConstitution, OPS_RESOURCE_PRINCIPLE, REQUIRED_RESOURCE_SERVICES } from "./constitution";
import { checkOpsW5Invariants, OPS_W5_INVARIANTS } from "./invariants";
import { allOpsW5TestsPassed, runOpsW5ResourceTests } from "./w5-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/05_RESOURCE_STEWARDSHIP_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/RESOURCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/RESOURCE_LIFECYCLE.md",
  "docs/phase-11/11.6-institutional-operations/BUDGET_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/FACILITIES_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_5_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/resource_vocabulary.json",
  "data/phase-11/resource_lifecycle.json",
  "data/phase-11/budget_model.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/resources/constitution.ts",
  "src/lib/civic-action/builds/11.6/resources/w5.ts",
  "src/lib/civic-action/builds/11.6/resources/services/resource-service.ts",
  "src/app/api/v1/assets/route.ts",
];

export interface Wave5Certification {
  wave_id: "11.6-W5";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Resource, Asset, Facilities & Financial Stewardship Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW5Certification(): Wave5Certification {
  const constitution = getResourceConstitution();
  const registry = loadRequirementsRegistry();
  const w5Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W5");
  const testResults = runOpsW5ResourceTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/resource_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/resource_vocabulary.json"), "utf8"))
    : { terms: [] };
  const lifecycle = existsSync(join(ROOT, "data/phase-11/resource_lifecycle.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/resource_lifecycle.json"), "utf8"))
    : { stages: [] };
  const budgetModel = existsSync(join(ROOT, "data/phase-11/budget_model.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/budget_model.json"), "utf8"))
    : { scopes: [] };

  const gates = [
    { id: "CAE-11.6-W5-G01", name: "Resource principle", passed: constitution.governing_principle === OPS_RESOURCE_PRINCIPLE, detail: "mission-aligned resources" },
    { id: "CAE-11.6-W5-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W5-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + lifecycle + budget" },
    { id: "CAE-11.6-W5-G04", name: "Resource lifecycle", passed: lifecycle.stages?.length >= 10, detail: `${lifecycle.stages?.length ?? 0} stages` },
    { id: "CAE-11.6-W5-G05", name: "Budget scopes", passed: budgetModel.scopes?.length >= 6, detail: `${budgetModel.scopes?.length ?? 0} scopes` },
    { id: "CAE-11.6-W5-G06", name: "W5 requirements", passed: w5Reqs.length >= 30 && w5Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w5Reqs.length} requirements` },
    { id: "CAE-11.6-W5-G07", name: "Resource services", passed: REQUIRED_RESOURCE_SERVICES.length === 15, detail: REQUIRED_RESOURCE_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W5-G08", name: "Resource tests", passed: allOpsW5TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W5-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W5-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 20, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW5Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W5_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW5TestsPassed();

  return {
    wave_id: "11.6-W5",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Resource, Asset, Facilities & Financial Stewardship Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW5Complete(): boolean {
  return runOpsW5Certification().all_passed;
}
