/**
 * CAE-11.7-W12 — Automation certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getAutomationConstitution, LIX_AUTOMATION_PRINCIPLE, REQUIRED_AUTOMATION_SERVICES } from "./constitution";
import { checkLixW12Invariants, LIX_W12_INVARIANTS } from "./invariants";
import { allLixW12TestsPassed, runLixW12CertificationTests } from "./w12-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/12_AUTONOMOUS_INSTITUTIONAL_OPERATIONS.md",
  "docs/phase-11/11.7-living-intelligence/AUTOMATION_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_12_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/automation/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/automation/w12.ts",
  "src/lib/civic-action/builds/11.7/living/automation/services/automation-service.ts",
  "src/app/api/v1/localbrain/automation/route.ts",
];

export interface Wave12AutomationCertification {
  wave_id: "11.7-W12";
  build: "11.7";
  subsystem: "LIX-012";
  name: "Autonomous Institutional Operations, Human-Supervised Automation & Workflow Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW12Certification(): Wave12AutomationCertification {
  const constitution = getAutomationConstitution();
  const registry = loadRequirementsRegistry();
  const w12Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W12");
  const testResults = runLixW12CertificationTests();

  const gates = [
    { id: "CAE-11.7-W12-G01", name: "Automation principle", passed: constitution.governing_principle === LIX_AUTOMATION_PRINCIPLE, detail: "oversight never disappears" },
    { id: "CAE-11.7-W12-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W12-G03", name: "W12 requirements", passed: w12Reqs.length >= 25, detail: `${w12Reqs.length} requirements` },
    { id: "CAE-11.7-W12-G04", name: "Automation services", passed: REQUIRED_AUTOMATION_SERVICES.length === 12, detail: REQUIRED_AUTOMATION_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W12-G05", name: "Automation tests", passed: allLixW12TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W12-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW12Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W12_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW12TestsPassed();

  return {
    wave_id: "11.7-W12",
    build: "11.7",
    subsystem: "LIX-012",
    name: "Autonomous Institutional Operations, Human-Supervised Automation & Workflow Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW12Complete(): boolean {
  return runLixW12Certification().all_passed;
}
