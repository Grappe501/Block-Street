/**
 * CAE-11.7-W10 — Partnership certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getPartnershipConstitution, LIX_PARTNERSHIP_PRINCIPLE, REQUIRED_PARTNERSHIP_SERVICES } from "./constitution";
import { checkLixW10Invariants, LIX_W10_INVARIANTS } from "./invariants";
import { allLixW10TestsPassed, runLixW10CertificationTests } from "./w10-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/10_AI_HUMAN_PARTNERSHIP_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/PARTNERSHIP_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_10_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/partnership/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/partnership/w10.ts",
  "src/lib/civic-action/builds/11.7/living/partnership/services/partnership-service.ts",
  "src/app/api/v1/localbrain/partnership/route.ts",
];

export interface Wave10PartnershipCertification {
  wave_id: "11.7-W10";
  build: "11.7";
  subsystem: "LIX-010";
  name: "AI Human Partnership, Trust Calibration & Living Institution Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW10Certification(): Wave10PartnershipCertification {
  const constitution = getPartnershipConstitution();
  const registry = loadRequirementsRegistry();
  const w10Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W10");
  const testResults = runLixW10CertificationTests();

  const gates = [
    { id: "CAE-11.7-W10-G01", name: "Partnership principle", passed: constitution.governing_principle === LIX_PARTNERSHIP_PRINCIPLE, detail: "trust through transparency" },
    { id: "CAE-11.7-W10-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W10-G03", name: "W10 requirements", passed: w10Reqs.length >= 25, detail: `${w10Reqs.length} requirements` },
    { id: "CAE-11.7-W10-G04", name: "Partnership services", passed: REQUIRED_PARTNERSHIP_SERVICES.length === 12, detail: REQUIRED_PARTNERSHIP_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W10-G05", name: "Partnership tests", passed: allLixW10TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W10-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW10Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W10_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW10TestsPassed();

  return {
    wave_id: "11.7-W10",
    build: "11.7",
    subsystem: "LIX-010",
    name: "AI Human Partnership, Trust Calibration & Living Institution Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW10Complete(): boolean {
  return runLixW10Certification().all_passed;
}
