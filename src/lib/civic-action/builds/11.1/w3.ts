import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { allW3TestsPassed, runIniW3ServiceTests } from "./w3-tests";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.1-initiatives/03_SERVICE_ARCHITECTURE.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_COMMAND_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_LIFECYCLE_ENGINE.md",
  "docs/phase-11/11.1-initiatives/WAVE_3_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.1/services/domain-service.ts",
  "src/lib/civic-action/builds/11.1/services/commands.ts",
  "src/lib/civic-action/builds/11.1/services/charter-validator.ts",
  "src/lib/civic-action/builds/11.1/services/owner-eligibility.ts",
  "src/lib/civic-action/builds/11.1/services/dependency-graph.ts",
  "src/lib/civic-action/builds/11.1/w3-tests.ts",
];

export interface Wave3Certification {
  wave_id: "11.1-W3";
  build: "11.1";
  subsystem: "INI-SVC-001";
  name: "Initiative Core Services and Lifecycle Engine";
  certified_at: string | null;
  all_passed: boolean;
  service_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runIniW3Certification(): Wave3Certification {
  const registry = loadRequirementsRegistry();
  const w3Reqs = registry.requirements.filter((r) => r.build === "11.1" && r.wave === "W3");
  const testResults = runIniW3ServiceTests();
  const testsPassed = allW3TestsPassed();

  const gates = [
    { id: "CAE-11.1-W3-G01", name: "Service architecture docs", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.1-W3-G02", name: "Domain service modules", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} modules` },
    { id: "CAE-11.1-W3-G03", name: "W3 requirements registered", passed: w3Reqs.length >= 40, detail: `${w3Reqs.length} requirements` },
    { id: "CAE-11.1-W3-G04", name: "Service tests pass", passed: testsPassed, detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.1-W3-G05", name: "Illegal transitions rejected", passed: testResults.find((t) => t.name.includes("concept→active"))?.passed ?? false, detail: "state machine" },
    { id: "CAE-11.1-W3-G06", name: "Service identity owner rejected", passed: testResults.find((t) => t.name.includes("service identity"))?.passed ?? false, detail: "ownership" },
    { id: "CAE-11.1-W3-G07", name: "Circular dependency detected", passed: testResults.find((t) => t.name.includes("circular"))?.passed ?? false, detail: "dependency graph" },
    { id: "CAE-11.1-W3-G08", name: "Direct mutation forbidden", passed: testResults.find((t) => t.name.includes("direct mutation"))?.passed ?? false, detail: "SVC-001" },
    { id: "CAE-11.1-W3-G09", name: "Draft creation works", passed: testResults.find((t) => t.name.includes("create draft"))?.passed ?? false, detail: "createDraft" },
    { id: "CAE-11.1-W3-G10", name: "Restore to active denied", passed: testResults.find((t) => t.name.includes("restore to active"))?.passed ?? false, detail: "restoration" },
  ];

  const allPassed = gates.every((g) => g.passed);

  return {
    wave_id: "11.1-W3",
    build: "11.1",
    subsystem: "INI-SVC-001",
    name: "Initiative Core Services and Lifecycle Engine",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    service_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function getIniW3Overview() {
  return {
    subsystem: "INI-SVC-001",
    certification: runIniW3Certification(),
    requirements: loadRequirementsRegistry().requirements.filter((r) => r.build === "11.1" && r.wave === "W3"),
    commands: [
      "CreateInitiativeDraftCommand",
      "SubmitInitiativeForReviewCommand",
      "ApproveInitiativeCommand",
      "ActivateInitiativeCommand",
      "PauseInitiativeCommand",
      "TransferOperationalOwnershipCommand",
      "AddInitiativeDependencyCommand",
      "CompleteInitiativeCommand",
      "ArchiveInitiativeCommand",
      "CreateSuccessorInitiativeCommand",
      "RestoreInitiativeCommand",
    ],
  };
}

export function isIniW3Complete(): boolean {
  return runIniW3Certification().all_passed;
}
