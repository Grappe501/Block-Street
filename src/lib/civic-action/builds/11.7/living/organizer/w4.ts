/**
 * CAE-11.7-W4 — Organizer certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getOrganizerConstitution, LIX_ORGANIZER_PRINCIPLE, REQUIRED_ORGANIZER_SERVICES } from "./constitution";
import { checkLixW4Invariants, LIX_W4_INVARIANTS } from "./invariants";
import { allLixW4TestsPassed, runLixW4CertificationTests } from "./w4-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/04_AI_ORGANIZER_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/ORGANIZER_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_4_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/organizer/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/organizer/w4.ts",
  "src/lib/civic-action/builds/11.7/living/organizer/services/organizer-service.ts",
  "src/app/api/v1/localbrain/organizer/route.ts",
];

export interface Wave4OrganizerCertification {
  wave_id: "11.7-W4";
  build: "11.7";
  subsystem: "LIX-004";
  name: "AI Organizer, Daily Operations & Mission Coordination Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW4Certification(): Wave4OrganizerCertification {
  const constitution = getOrganizerConstitution();
  const registry = loadRequirementsRegistry();
  const w4Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W4");
  const testResults = runLixW4CertificationTests();

  const gates = [
    { id: "CAE-11.7-W4-G01", name: "Organizer principle", passed: constitution.governing_principle === LIX_ORGANIZER_PRINCIPLE, detail: "humans perform work" },
    { id: "CAE-11.7-W4-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W4-G03", name: "W4 requirements", passed: w4Reqs.length >= 25, detail: `${w4Reqs.length} requirements` },
    { id: "CAE-11.7-W4-G04", name: "Organizer services", passed: REQUIRED_ORGANIZER_SERVICES.length === 14, detail: REQUIRED_ORGANIZER_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W4-G05", name: "Organizer tests", passed: allLixW4TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W4-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW4Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W4_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW4TestsPassed();

  return {
    wave_id: "11.7-W4",
    build: "11.7",
    subsystem: "LIX-004",
    name: "AI Organizer, Daily Operations & Mission Coordination Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW4Complete(): boolean {
  return runLixW4Certification().all_passed;
}
