/**
 * CAE-11.7-W8 — Prediction certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getPredictionConstitution, LIX_PREDICTION_PRINCIPLE, REQUIRED_PREDICTION_SERVICES } from "./constitution";
import { checkLixW8Invariants, LIX_W8_INVARIANTS } from "./invariants";
import { allLixW8TestsPassed, runLixW8CertificationTests } from "./w8-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/08_AI_PREDICTION_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/PREDICTION_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_8_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/prediction/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/prediction/w8.ts",
  "src/lib/civic-action/builds/11.7/living/prediction/services/prediction-service.ts",
  "src/app/api/v1/localbrain/prediction/route.ts",
];

export interface Wave8PredictionCertification {
  wave_id: "11.7-W8";
  build: "11.7";
  subsystem: "LIX-008";
  name: "AI Prediction, Strategic Modeling & Future Scenario Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW8Certification(): Wave8PredictionCertification {
  const constitution = getPredictionConstitution();
  const registry = loadRequirementsRegistry();
  const w8Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W8");
  const testResults = runLixW8CertificationTests();

  const gates = [
    { id: "CAE-11.7-W8-G01", name: "Prediction principle", passed: constitution.governing_principle === LIX_PREDICTION_PRINCIPLE, detail: "forecasts advisory" },
    { id: "CAE-11.7-W8-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W8-G03", name: "W8 requirements", passed: w8Reqs.length >= 25, detail: `${w8Reqs.length} requirements` },
    { id: "CAE-11.7-W8-G04", name: "Prediction services", passed: REQUIRED_PREDICTION_SERVICES.length === 12, detail: REQUIRED_PREDICTION_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W8-G05", name: "Prediction tests", passed: allLixW8TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W8-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW8Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W8_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW8TestsPassed();

  return {
    wave_id: "11.7-W8",
    build: "11.7",
    subsystem: "LIX-008",
    name: "AI Prediction, Strategic Modeling & Future Scenario Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW8Complete(): boolean {
  return runLixW8Certification().all_passed;
}
