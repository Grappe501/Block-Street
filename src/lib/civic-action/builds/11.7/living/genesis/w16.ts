/**
 * CAE-11.7-W16 — Genesis certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getGenesisConstitution, LIX_GENESIS_PRINCIPLE, REQUIRED_GENESIS_SERVICES } from "./constitution";
import { checkLixW16Invariants, LIX_W16_INVARIANTS } from "./invariants";
import { allLixW16TestsPassed, runLixW16CertificationTests } from "./w16-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/16_LIVING_CIVILIZATION.md",
  "docs/phase-11/11.7-living-intelligence/GENESIS_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_16_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/genesis/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/genesis/w16.ts",
  "src/lib/civic-action/builds/11.7/living/genesis/services/genesis-service.ts",
  "src/app/api/v1/localbrain/genesis/route.ts",
];

export interface Wave16GenesisCertification {
  wave_id: "11.7-W16";
  build: "11.7";
  subsystem: "LIX-016";
  name: "Living Civilization Runtime, Canonical Genesis & Institutional Continuity Framework";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW16Certification(): Wave16GenesisCertification {
  const constitution = getGenesisConstitution();
  const registry = loadRequirementsRegistry();
  const w16Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W16");
  const testResults = runLixW16CertificationTests();

  const gates = [
    { id: "CAE-11.7-W16-G01", name: "Genesis principle", passed: constitution.governing_principle === LIX_GENESIS_PRINCIPLE, detail: "institutions outlive builders" },
    { id: "CAE-11.7-W16-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W16-G03", name: "W16 requirements", passed: w16Reqs.length >= 25, detail: `${w16Reqs.length} requirements` },
    { id: "CAE-11.7-W16-G04", name: "Genesis services", passed: REQUIRED_GENESIS_SERVICES.length === 13, detail: REQUIRED_GENESIS_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W16-G05", name: "Genesis tests", passed: allLixW16TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W16-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW16Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W16_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW16TestsPassed();

  return {
    wave_id: "11.7-W16",
    build: "11.7",
    subsystem: "LIX-016",
    name: "Living Civilization Runtime, Canonical Genesis & Institutional Continuity Framework",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW16Complete(): boolean {
  return runLixW16Certification().all_passed;
}
