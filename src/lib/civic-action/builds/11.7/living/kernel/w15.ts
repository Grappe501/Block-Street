/**
 * CAE-11.7-W15 — Kernel certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getKernelConstitution, LIX_KERNEL_PRINCIPLE, REQUIRED_KERNEL_SERVICES } from "./constitution";
import { checkLixW15Invariants, LIX_W15_INVARIANTS } from "./invariants";
import { allLixW15TestsPassed, runLixW15CertificationTests } from "./w15-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/15_INSTITUTIONAL_OS_KERNEL.md",
  "docs/phase-11/11.7-living-intelligence/KERNEL_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_15_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/kernel/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/kernel/w15.ts",
  "src/lib/civic-action/builds/11.7/living/kernel/services/kernel-service.ts",
  "src/app/api/v1/localbrain/kernel/route.ts",
];

export interface Wave15KernelCertification {
  wave_id: "11.7-W15";
  build: "11.7";
  subsystem: "LIX-015";
  name: "Institutional Operating System Kernel, Constitutional Runtime & Universal Execution Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW15Certification(): Wave15KernelCertification {
  const constitution = getKernelConstitution();
  const registry = loadRequirementsRegistry();
  const w15Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W15");
  const testResults = runLixW15CertificationTests();

  const gates = [
    { id: "CAE-11.7-W15-G01", name: "Kernel principle", passed: constitution.governing_principle === LIX_KERNEL_PRINCIPLE, detail: "one constitutional runtime" },
    { id: "CAE-11.7-W15-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W15-G03", name: "W15 requirements", passed: w15Reqs.length >= 25, detail: `${w15Reqs.length} requirements` },
    { id: "CAE-11.7-W15-G04", name: "Kernel services", passed: REQUIRED_KERNEL_SERVICES.length === 12, detail: REQUIRED_KERNEL_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W15-G05", name: "Kernel tests", passed: allLixW15TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W15-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW15Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W15_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW15TestsPassed();

  return {
    wave_id: "11.7-W15",
    build: "11.7",
    subsystem: "LIX-015",
    name: "Institutional Operating System Kernel, Constitutional Runtime & Universal Execution Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW15Complete(): boolean {
  return runLixW15Certification().all_passed;
}
