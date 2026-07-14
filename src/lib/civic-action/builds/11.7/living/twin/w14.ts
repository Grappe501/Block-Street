/**
 * CAE-11.7-W14 — Digital Twin certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getTwinConstitution, LIX_TWIN_PRINCIPLE, REQUIRED_TWIN_SERVICES } from "./constitution";
import { checkLixW14Invariants, LIX_W14_INVARIANTS } from "./invariants";
import { allLixW14TestsPassed, runLixW14CertificationTests } from "./w14-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/14_DIGITAL_TWIN.md",
  "docs/phase-11/11.7-living-intelligence/TWIN_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_14_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/twin/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/twin/w14.ts",
  "src/lib/civic-action/builds/11.7/living/twin/services/twin-service.ts",
  "src/app/api/v1/localbrain/digital-twin/route.ts",
];

export interface Wave14TwinCertification {
  wave_id: "11.7-W14";
  build: "11.7";
  subsystem: "LIX-014";
  name: "Digital Twin, Institutional Simulation & Enterprise Sandbox Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW14Certification(): Wave14TwinCertification {
  const constitution = getTwinConstitution();
  const registry = loadRequirementsRegistry();
  const w14Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W14");
  const testResults = runLixW14CertificationTests();

  const gates = [
    { id: "CAE-11.7-W14-G01", name: "Twin principle", passed: constitution.governing_principle === LIX_TWIN_PRINCIPLE, detail: "experiment then approve" },
    { id: "CAE-11.7-W14-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W14-G03", name: "W14 requirements", passed: w14Reqs.length >= 25, detail: `${w14Reqs.length} requirements` },
    { id: "CAE-11.7-W14-G04", name: "Twin services", passed: REQUIRED_TWIN_SERVICES.length === 13, detail: REQUIRED_TWIN_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W14-G05", name: "Twin tests", passed: allLixW14TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W14-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW14Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W14_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW14TestsPassed();

  return {
    wave_id: "11.7-W14",
    build: "11.7",
    subsystem: "LIX-014",
    name: "Digital Twin, Institutional Simulation & Enterprise Sandbox Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW14Complete(): boolean {
  return runLixW14Certification().all_passed;
}
