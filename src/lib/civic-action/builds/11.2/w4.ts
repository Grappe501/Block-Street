/**
 * CAE-11.2-W4 — Human experience certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { allW4TestsPassed, runObjW4ExperienceTests } from "./w4-tests";
import { nowIso } from "../../utils";
import { UX_INVARIANTS } from "./ux/locale";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.2-objectives/OBJECTIVE_WORKBENCH_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_DASHBOARD.md",
  "docs/phase-11/11.2-objectives/MISSION_WORKSPACE.md",
  "docs/phase-11/11.2-objectives/WORKSTREAM_BOARD.md",
  "docs/phase-11/11.2-objectives/TODAYS_WORK_EXPERIENCE.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_PROGRESS_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_ACCESSIBILITY_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_SPANISH_EXPERIENCE.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_EMPTY_STATE_GUIDE.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_4_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.2/ux/assemble-workspace.ts",
  "src/lib/civic-action/builds/11.2/ux/assemble-portfolio.ts",
  "src/lib/civic-action/builds/11.2/ux/human-messages.ts",
  "src/lib/civic-action/builds/11.2/ux/ui-actions.ts",
  "src/lib/civic-action/builds/11.2/w4-tests.ts",
  "src/features/objectives/components/ObjectiveWorkspaceShell.tsx",
  "src/app/(site)/initiatives/[id]/objectives/page.tsx",
  "src/app/api/v1/civic-action/objectives/commands/route.ts",
];

export interface Protocol4Certification {
  protocol_id: "11.2-W4";
  build: "11.2";
  subsystem: "OBJ-UX-001";
  protocol_name: "Objective Human Experience & Execution Workbench Protocol";
  certified_at: string | null;
  all_passed: boolean;
  experience_tests_passed: boolean;
  ux_invariants: string[];
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runObjW4Certification(): Protocol4Certification {
  const registry = loadRequirementsRegistry();
  const w4Reqs = registry.requirements.filter((r) => r.build === "11.2" && r.wave === "W4");
  const testResults = runObjW4ExperienceTests();
  const testsPassed = allW4TestsPassed();

  const gates = [
    { id: "CAE-11.2-W4-G01", name: "UX documentation", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.2-W4-G02", name: "UX modules and routes", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.2-W4-G03", name: "UX invariants registered", passed: UX_INVARIANTS.length >= 8, detail: `${UX_INVARIANTS.length} invariants` },
    { id: "CAE-11.2-W4-G04", name: "W4 requirements", passed: w4Reqs.length >= 20 && w4Reqs.every((r) => r.status === "implemented"), detail: `${w4Reqs.length} requirements` },
    { id: "CAE-11.2-W4-G05", name: "Experience tests pass", passed: testsPassed, detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.2-W4-G06", name: "Human error translation", passed: testResults.find((t) => t.name.includes("humanize"))?.passed ?? false, detail: "human-messages" },
    { id: "CAE-11.2-W4-G07", name: "Dashboard assembler", passed: testResults.find((t) => t.name.includes("dashboard"))?.passed ?? false, detail: "six questions" },
    { id: "CAE-11.2-W4-G08", name: "No status dropdown", passed: testResults.find((t) => t.name.includes("no status dropdown"))?.passed ?? false, detail: "lifecycle actions" },
    { id: "CAE-11.2-W4-G09", name: "Spanish experience", passed: testResults.find((t) => t.name.includes("Spanish"))?.passed ?? false, detail: "locale" },
    { id: "CAE-11.2-W4-G10", name: "Today's work assembler", passed: testResults.find((t) => t.name.includes("today"))?.passed ?? false, detail: "todays work" },
  ];

  const allPassed = gates.every((g) => g.passed);

  return {
    protocol_id: "11.2-W4",
    build: "11.2",
    subsystem: "OBJ-UX-001",
    protocol_name: "Objective Human Experience & Execution Workbench Protocol",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    experience_tests_passed: testsPassed,
    ux_invariants: [...UX_INVARIANTS],
    gates,
    test_results: testResults,
  };
}

export function isObjW4Complete(): boolean {
  return runObjW4Certification().all_passed;
}
