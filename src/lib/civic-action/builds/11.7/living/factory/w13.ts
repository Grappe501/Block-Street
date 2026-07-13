/**
 * CAE-11.7-W13 — Factory certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getFactoryConstitution, LIX_FACTORY_PRINCIPLE, REQUIRED_FACTORY_SERVICES } from "./constitution";
import { checkLixW13Invariants, LIX_W13_INVARIANTS } from "./invariants";
import { allLixW13TestsPassed, runLixW13CertificationTests } from "./w13-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/13_SELF_BUILDING_INSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/FACTORY_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_13_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/factory/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/factory/w13.ts",
  "src/lib/civic-action/builds/11.7/living/factory/services/factory-service.ts",
  "src/app/api/v1/localbrain/factory/route.ts",
];

export interface Wave13FactoryCertification {
  wave_id: "11.7-W13";
  build: "11.7";
  subsystem: "LIX-013";
  name: "Self-Building Institution, Capability Evolution & Platform Factory Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW13Certification(): Wave13FactoryCertification {
  const constitution = getFactoryConstitution();
  const registry = loadRequirementsRegistry();
  const w13Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W13");
  const testResults = runLixW13CertificationTests();

  const gates = [
    { id: "CAE-11.7-W13-G01", name: "Factory principle", passed: constitution.governing_principle === LIX_FACTORY_PRINCIPLE, detail: "constitutional governance" },
    { id: "CAE-11.7-W13-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W13-G03", name: "W13 requirements", passed: w13Reqs.length >= 25, detail: `${w13Reqs.length} requirements` },
    { id: "CAE-11.7-W13-G04", name: "Factory services", passed: REQUIRED_FACTORY_SERVICES.length === 12, detail: REQUIRED_FACTORY_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W13-G05", name: "Factory tests", passed: allLixW13TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W13-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW13Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W13_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW13TestsPassed();

  return {
    wave_id: "11.7-W13",
    build: "11.7",
    subsystem: "LIX-013",
    name: "Self-Building Institution, Capability Evolution & Platform Factory Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW13Complete(): boolean {
  return runLixW13Certification().all_passed;
}
