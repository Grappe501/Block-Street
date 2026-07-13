/**
 * CAE-11.12-W4 — Human Experience certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { allW4TestsPassed, runKnwW4ExperienceTests } from "./w4-tests";
import { nowIso } from "../../utils";
import { UX_INVARIANTS } from "./ux/locale";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.12-adaptive-learning/04_HUMAN_EXPERIENCE_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_WORKBENCH_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_ACCESSIBILITY_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_SPANISH_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_4_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.12/ux/assemble-home.ts",
  "src/lib/civic-action/builds/11.12/ux/assemble-workbench-shell.ts",
  "src/lib/civic-action/builds/11.12/w4-tests.ts",
  "src/features/knowledge/components/LearningWorkbenchShell.tsx",
  "src/app/(site)/learning/page.tsx",
  "src/app/api/v1/workspace/home/route.ts",
];

export interface Wave4Certification {
  wave_id: "11.12-W4";
  build: "11.12";
  subsystem: "KNW-UX-001";
  name: "Human Experience, Learning Journey & Institutional Workspace";
  certified_at: string | null;
  all_passed: boolean;
  experience_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runKnwW4Certification(): Wave4Certification {
  const registry = loadRequirementsRegistry();
  const w4Reqs = registry.requirements.filter((r) => r.build === "11.12" && r.wave === "W4");
  const testResults = runKnwW4ExperienceTests();
  const testsPassed = allW4TestsPassed();

  const gates = [
    {
      id: "CAE-11.12-W4-G01",
      name: "UX documentation",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.12-W4-G02",
      name: "UX modules and routes",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.12-W4-G03",
      name: "UX invariants",
      passed: UX_INVARIANTS.length >= 8,
      detail: `${UX_INVARIANTS.length} invariants`,
    },
    {
      id: "CAE-11.12-W4-G04",
      name: "W4 requirements",
      passed: w4Reqs.length >= 16 && w4Reqs.every((r) => r.status === "implemented"),
      detail: `${w4Reqs.length} requirements`,
    },
    {
      id: "CAE-11.12-W4-G05",
      name: "Experience tests",
      passed: testsPassed,
      detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}`,
    },
    {
      id: "CAE-11.12-W4-G06",
      name: "Home primary question",
      passed: testResults.find((t) => t.name === "home_primary_question")?.passed ?? false,
      detail: "what to do next",
    },
    {
      id: "CAE-11.12-W4-G07",
      name: "Role-aware shell",
      passed: testResults.find((t) => t.name === "role_aware_shell")?.passed ?? false,
      detail: "nav by role",
    },
    {
      id: "CAE-11.12-W4-G08",
      name: "No status dropdown",
      passed: testResults.find((t) => t.name === "no_status_dropdown_actions")?.passed ?? false,
      detail: "governed actions",
    },
    {
      id: "CAE-11.12-W4-G09",
      name: "Spanish experience",
      passed: testResults.find((t) => t.name === "Spanish_home_title")?.passed ?? false,
      detail: "locale",
    },
    {
      id: "CAE-11.12-W4-G10",
      name: "AI advisory only",
      passed: testResults.find((t) => t.name === "ai_command_bar_advisory")?.passed ?? false,
      detail: "tutor + command bar",
    },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.12-W4",
    build: "11.12",
    subsystem: "KNW-UX-001",
    name: "Human Experience, Learning Journey & Institutional Workspace",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    experience_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function isKnwW4Complete(): boolean {
  return runKnwW4Certification().all_passed;
}
