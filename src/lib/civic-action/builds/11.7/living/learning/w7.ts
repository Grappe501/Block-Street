/**
 * CAE-11.7-W7 — Learning certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getLearningConstitution, LIX_LEARNING_PRINCIPLE, REQUIRED_LEARNING_SERVICES } from "./constitution";
import { checkLixW7Invariants, LIX_W7_INVARIANTS } from "./invariants";
import { allLixW7TestsPassed, runLixW7CertificationTests } from "./w7-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/07_AI_LEARNING_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/LEARNING_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_7_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/learning/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/learning/w7.ts",
  "src/lib/civic-action/builds/11.7/living/learning/services/learning-service.ts",
  "src/app/api/v1/localbrain/learning/route.ts",
];

export interface Wave7LearningCertification {
  wave_id: "11.7-W7";
  build: "11.7";
  subsystem: "LIX-007";
  name: "AI Learning, Competency & Institutional Education Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW7Certification(): Wave7LearningCertification {
  const constitution = getLearningConstitution();
  const registry = loadRequirementsRegistry();
  const w7Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W7");
  const testResults = runLixW7CertificationTests();

  const gates = [
    { id: "CAE-11.7-W7-G01", name: "Learning principle", passed: constitution.governing_principle === LIX_LEARNING_PRINCIPLE, detail: "experience to capability" },
    { id: "CAE-11.7-W7-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W7-G03", name: "W7 requirements", passed: w7Reqs.length >= 25, detail: `${w7Reqs.length} requirements` },
    { id: "CAE-11.7-W7-G04", name: "Learning services", passed: REQUIRED_LEARNING_SERVICES.length === 13, detail: REQUIRED_LEARNING_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W7-G05", name: "Learning tests", passed: allLixW7TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W7-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW7Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W7_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW7TestsPassed();

  return {
    wave_id: "11.7-W7",
    build: "11.7",
    subsystem: "LIX-007",
    name: "AI Learning, Competency & Institutional Education Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW7Complete(): boolean {
  return runLixW7Certification().all_passed;
}
