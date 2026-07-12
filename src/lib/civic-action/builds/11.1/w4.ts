/**
 * CAE-11.1-W4 — Human workflow certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW4TestsPassed, runIniW4ExperienceTests } from "./w4-tests";
import { nowIso } from "../../utils";
import { UX_INVARIANTS } from "./ux/locale";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.1-initiatives/04_UI_AND_WORKFLOWS.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_EXPERIENCE_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/WAVE_4_CERTIFICATION.md",
  "docs/phase-11/11.1-initiatives/WAVE_5_API_HANDOFF.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.1/ux/assemble-portfolio.ts",
  "src/lib/civic-action/builds/11.1/ux/assemble-workspace.ts",
  "src/lib/civic-action/builds/11.1/ux/human-messages.ts",
  "src/lib/civic-action/builds/11.1/ux/ui-actions.ts",
  "src/lib/civic-action/builds/11.1/w4-tests.ts",
  "src/app/(site)/initiatives/page.tsx",
  "src/app/(site)/initiatives/[id]/layout.tsx",
  "src/app/api/v1/civic-action/initiatives/commands/route.ts",
];

export interface Wave4Certification {
  wave_id: "11.1-W4";
  build: "11.1";
  subsystem: "INI-UX-001";
  name: "Initiative Human Workflows, Workbench, and User Interface";
  certified_at: string | null;
  all_passed: boolean;
  experience_tests_passed: boolean;
  ux_invariants: string[];
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runIniW4Certification(): Wave4Certification {
  const testResults = runIniW4ExperienceTests();
  const testsPassed = allW4TestsPassed();

  const gates = [
    { id: "CAE-11.1-W4-G01", name: "UX documentation", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.1-W4-G02", name: "UX modules and routes", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.1-W4-G03", name: "UX invariants registered", passed: UX_INVARIANTS.length >= 8, detail: `${UX_INVARIANTS.length} invariants` },
    { id: "CAE-11.1-W4-G04", name: "Experience tests pass", passed: testsPassed, detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.1-W4-G05", name: "Human error translation", passed: testResults.find((t) => t.name.includes("humanize"))?.passed ?? false, detail: "human-messages" },
    { id: "CAE-11.1-W4-G06", name: "Portfolio assembler", passed: testResults.find((t) => t.name.includes("portfolio"))?.passed ?? false, detail: "portfolio" },
    { id: "CAE-11.1-W4-G07", name: "No direct status edit actions", passed: testResults.find((t) => t.name.includes("no status dropdown"))?.passed ?? false, detail: "lifecycle actions" },
    { id: "CAE-11.1-W4-G08", name: "Spanish path strings", passed: testResults.find((t) => t.name.includes("Spanish"))?.passed ?? false, detail: "locale" },
  ];

  const allPassed = gates.every((g) => g.passed);

  return {
    wave_id: "11.1-W4",
    build: "11.1",
    subsystem: "INI-UX-001",
    name: "Initiative Human Workflows, Workbench, and User Interface",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    experience_tests_passed: testsPassed,
    ux_invariants: [...UX_INVARIANTS],
    gates,
    test_results: testResults,
  };
}

export function getIniW4Overview() {
  const cert = runIniW4Certification();
  return {
    wave_id: cert.wave_id,
    subsystem: cert.subsystem,
    status: cert.all_passed ? "complete" : "in_progress",
    gates_passed: cert.gates.filter((g) => g.passed).length,
    gates_total: cert.gates.length,
    ux_invariant_count: cert.ux_invariants.length,
    routes: [
      "/initiatives",
      "/initiatives/new",
      "/initiatives/[id]",
      "/initiatives/[id]/charter",
      "/initiatives/[id]/readiness",
      "/initiatives/[id]/people",
      "/initiatives/[id]/manage",
      "/initiatives/[id]/history",
    ],
  };
}

export function isIniW4Complete(): boolean {
  return runIniW4Certification().all_passed;
}
