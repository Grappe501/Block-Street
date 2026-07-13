/**
 * CAE-11.7-W4 — Human experience certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { allW4TestsPassed, runComW4ExperienceTests } from "./w4-tests";
import { nowIso } from "../../utils";
import { UX_INVARIANTS } from "./ux/locale";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-communications/04_HUMAN_EXPERIENCE_PROTOCOL.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_WORKBENCH_PROTOCOL.md",
  "docs/phase-11/11.7-communications/MISSION_CONVERSATION_STANDARD.md",
  "docs/phase-11/11.7-communications/MEETING_WORKSPACE_STANDARD.md",
  "docs/phase-11/11.7-communications/DOCUMENT_COLLABORATION_STANDARD.md",
  "docs/phase-11/11.7-communications/DAILY_BRIEF_STANDARD.md",
  "docs/phase-11/11.7-communications/KNOWLEDGE_EXPLORER_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_MOBILE_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_ACCESSIBILITY_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_SPANISH_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_OFFLINE_STANDARD.md",
  "docs/phase-11/11.7-communications/PROTOCOL_4_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/ux/assemble-home.ts",
  "src/lib/civic-action/builds/11.7/ux/assemble-workbench-shell.ts",
  "src/lib/civic-action/builds/11.7/ux/human-messages.ts",
  "src/lib/civic-action/builds/11.7/ux/ui-actions.ts",
  "src/lib/civic-action/builds/11.7/application-service.ts",
  "src/lib/civic-action/builds/11.7/w4-tests.ts",
  "src/features/communications/components/CollaborationWorkbenchShell.tsx",
  "src/app/(site)/communications/page.tsx",
  "src/app/api/v1/civic-action/communications/commands/route.ts",
];

export interface Protocol4Certification {
  protocol_id: "11.7-W4";
  build: "11.7";
  subsystem: "COM-UX-001";
  protocol_name: "Communications Human Experience & Collaboration Workbench Protocol";
  certified_at: string | null;
  all_passed: boolean;
  experience_tests_passed: boolean;
  ux_invariants: string[];
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runComW4Certification(): Protocol4Certification {
  const registry = loadRequirementsRegistry();
  const w4Reqs = registry.requirements.filter((r) => r.build === "11.7" && r.wave === "W4");
  const testResults = runComW4ExperienceTests();
  const testsPassed = allW4TestsPassed();

  const gates = [
    {
      id: "CAE-11.7-W4-G01",
      name: "UX documentation",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.7-W4-G02",
      name: "UX modules and routes",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.7-W4-G03",
      name: "UX invariants registered",
      passed: UX_INVARIANTS.length >= 8,
      detail: `${UX_INVARIANTS.length} invariants`,
    },
    {
      id: "CAE-11.7-W4-G04",
      name: "W4 requirements",
      passed: w4Reqs.length >= 20 && w4Reqs.every((r) => r.status === "implemented"),
      detail: `${w4Reqs.length} requirements`,
    },
    {
      id: "CAE-11.7-W4-G05",
      name: "Experience tests pass",
      passed: testsPassed,
      detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}`,
    },
    {
      id: "CAE-11.7-W4-G06",
      name: "Human error translation",
      passed: testResults.find((t) => t.name.includes("humanize"))?.passed ?? false,
      detail: "human-messages",
    },
    {
      id: "CAE-11.7-W4-G07",
      name: "Home assembler",
      passed: testResults.find((t) => t.name.includes("home assembler"))?.passed ?? false,
      detail: "four questions",
    },
    {
      id: "CAE-11.7-W4-G08",
      name: "No status dropdown",
      passed: testResults.find((t) => t.name.includes("no status dropdown"))?.passed ?? false,
      detail: "governed actions",
    },
    {
      id: "CAE-11.7-W4-G09",
      name: "Spanish experience",
      passed: testResults.find((t) => t.name.includes("Spanish"))?.passed ?? false,
      detail: "locale",
    },
    {
      id: "CAE-11.7-W4-G10",
      name: "Daily brief assembler",
      passed: testResults.find((t) => t.name.includes("daily brief"))?.passed ?? false,
      detail: "daily brief",
    },
    {
      id: "CAE-11.7-W4-G11",
      name: "Role-aware shell",
      passed: testResults.find((t) => t.name.includes("role-aware shell"))?.passed ?? false,
      detail: "executive vs volunteer",
    },
    {
      id: "CAE-11.7-W4-G12",
      name: "Mission conversation workspace",
      passed: testResults.find((t) => t.name.includes("mission conversation"))?.passed ?? false,
      detail: "mission workspace",
    },
    {
      id: "CAE-11.7-W4-G13",
      name: "Offline cache manifest",
      passed: testResults.find((t) => t.name.includes("offline cache"))?.passed ?? false,
      detail: "offline stub",
    },
    {
      id: "CAE-11.7-W4-G14",
      name: "Accessibility invariants",
      passed: testResults.find((t) => t.name.includes("accessibility"))?.passed ?? false,
      detail: "a11y",
    },
    {
      id: "CAE-11.7-W4-G15",
      name: "Application service",
      passed: existsSync(join(ROOT, "src/lib/civic-action/builds/11.7/application-service.ts")),
      detail: "read helpers",
    },
    {
      id: "CAE-11.7-W4-G16",
      name: "Command API route",
      passed: existsSync(join(ROOT, "src/app/api/v1/civic-action/communications/commands/route.ts")),
      detail: "commands POST",
    },
    {
      id: "CAE-11.7-W4-G17",
      name: "Collaboration workbench shell",
      passed: existsSync(join(ROOT, "src/features/communications/components/CollaborationWorkbenchShell.tsx")),
      detail: "React shell",
    },
    {
      id: "CAE-11.7-W4-G18",
      name: "Communications home page",
      passed: existsSync(join(ROOT, "src/app/(site)/communications/page.tsx")),
      detail: "home route",
    },
    {
      id: "CAE-11.7-W4-G19",
      name: "AI assistant component",
      passed: existsSync(join(ROOT, "src/features/communications/components/AICommunicationAssistant.tsx")),
      detail: "suggestions only",
    },
    {
      id: "CAE-11.7-W4-G20",
      name: "Four collaboration questions",
      passed: testResults.find((t) => t.name.includes("four collaboration"))?.passed ?? false,
      detail: "home questions",
    },
  ];

  const allPassed = gates.every((g) => g.passed);

  return {
    protocol_id: "11.7-W4",
    build: "11.7",
    subsystem: "COM-UX-001",
    protocol_name: "Communications Human Experience & Collaboration Workbench Protocol",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    experience_tests_passed: testsPassed,
    ux_invariants: [...UX_INVARIANTS],
    gates,
    test_results: testResults,
  };
}

export function isComW4Complete(): boolean {
  return runComW4Certification().all_passed;
}
