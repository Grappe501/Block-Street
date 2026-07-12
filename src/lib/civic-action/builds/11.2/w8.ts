/**
 * CAE-11.2-W8 — Production readiness certification + Build 11.2 completion
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW8TestsPassed, runObjW8ProductionTests } from "./w8-tests";
import { runObjectiveCertificationSuite } from "./production/certification-suite";
import { runObjW1Certification } from "./w1";
import { runObjW2Certification } from "./w2";
import { runObjW3Certification } from "./w3";
import { runObjW4Certification } from "./w4";
import { runObjW5Certification } from "./w5";
import { runObjW6Certification } from "./w6";
import { runObjW7Certification } from "./w7";
import { nowIso } from "../../utils";
import { BUILD_112_WAVES } from "./production/contracts";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.2-objectives/08_PRODUCTION_READINESS.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_PRODUCTION_CONSTITUTION.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_8_CERTIFICATION.md",
  "docs/phase-11/11.2-objectives/BUILD_11.2_COMPLETE.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.2/production/launch-control.ts",
  "src/lib/civic-action/builds/11.2/production/certification-suite.ts",
  "src/lib/civic-action/builds/11.2/w8-tests.ts",
  "src/app/api/v1/objectives/production/launch/route.ts",
  "src/features/objectives/components/ObjectiveLaunchControlCenter.tsx",
  "data/phase-11/objective_production_manifest.json",
];

export interface Wave8Certification {
  wave_id: "11.2-W8";
  build: "11.2";
  subsystem: "OBJ-PRD-001";
  name: "Objective Production Readiness, Operational Certification, and Launch";
  certified_at: string | null;
  all_passed: boolean;
  production_tests_passed: boolean;
  build_complete: boolean;
  waves_summary: { wave: string; all_passed: boolean }[];
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runObjW8Certification(): Wave8Certification {
  const testResults = runObjW8ProductionTests();
  const testsPassed = allW8TestsPassed();
  const suite = runObjectiveCertificationSuite();

  const waves_summary = [
    { wave: "W1", all_passed: runObjW1Certification().all_passed },
    { wave: "W2", all_passed: runObjW2Certification().all_passed },
    { wave: "W3", all_passed: runObjW3Certification().all_passed },
    { wave: "W4", all_passed: runObjW4Certification().all_passed },
    { wave: "W5", all_passed: runObjW5Certification().all_passed },
    { wave: "W6", all_passed: runObjW6Certification().all_passed },
    { wave: "W7", all_passed: runObjW7Certification().all_passed },
    { wave: "W8", all_passed: false },
  ];

  const gates = [
    { id: "CAE-11.2-W8-G01", name: "Production documentation", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.2-W8-G02", name: "Production modules", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.2-W8-G03", name: "Configuration validation", passed: testResults.find((t) => t.name === "configuration_validation")?.passed ?? false, detail: "env + flags" },
    { id: "CAE-11.2-W8-G04", name: "Certification suite W1–W7", passed: suite.suite_passed, detail: `${suite.waves.filter((w) => w.all_passed).length}/7 waves` },
    { id: "CAE-11.2-W8-G05", name: "Launch control center", passed: testResults.find((t) => t.name === "launch_control_generated")?.passed ?? false, detail: "go/no-go" },
    { id: "CAE-11.2-W8-G06", name: "Production certification levels", passed: testResults.find((t) => t.name === "production_certification_levels")?.passed ?? false, detail: "4 levels" },
    { id: "CAE-11.2-W8-G07", name: "Operator training", passed: testResults.find((t) => t.name === "operator_training_modules")?.passed ?? false, detail: "onboarding" },
    { id: "CAE-11.2-W8-G08", name: "Continuous verification", passed: testResults.find((t) => t.name === "continuous_verification")?.passed ?? false, detail: "schedules" },
    { id: "CAE-11.2-W8-G09", name: "Executive sign-off", passed: testResults.find((t) => t.name === "executive_sign_off_recorded")?.passed ?? false, detail: "human approval" },
    { id: "CAE-11.2-W8-G10", name: "Health checks", passed: testResults.find((t) => t.name === "health_summary")?.passed ?? false, detail: "production health" },
    { id: "CAE-11.2-W8-G11", name: "W8 documentation", passed: testResults.find((t) => t.name === "w8_documentation")?.passed ?? false, detail: "build complete doc" },
    { id: "CAE-11.2-W8-G12", name: "Full wave suite", passed: testResults.find((t) => t.name === "certification_suite_passed")?.passed ?? false, detail: "W1–W7" },
  ];

  const w8Passed = gates.every((g) => g.passed) && testsPassed;
  waves_summary.find((w) => w.wave === "W8")!.all_passed = w8Passed;

  const build_complete =
    w8Passed && waves_summary.every((w) => w.all_passed) && BUILD_112_WAVES.length === 8;

  return {
    wave_id: "11.2-W8",
    build: "11.2",
    subsystem: "OBJ-PRD-001",
    name: "Objective Production Readiness, Operational Certification, and Launch",
    certified_at: w8Passed ? nowIso() : null,
    all_passed: w8Passed,
    production_tests_passed: testsPassed,
    build_complete,
    waves_summary,
    gates,
    test_results: testResults,
  };
}

export function isBuild112Complete(): boolean {
  return runObjW8Certification().build_complete;
}

export function runBuild112Certification() {
  return {
    build: "11.2",
    name: "Objective Execution System",
    waves: BUILD_112_WAVES,
    w1: runObjW1Certification(),
    w2: runObjW2Certification(),
    w3: runObjW3Certification(),
    w4: runObjW4Certification(),
    w5: runObjW5Certification(),
    w6: runObjW6Certification(),
    w7: runObjW7Certification(),
    w8: runObjW8Certification(),
    complete: isBuild112Complete(),
    certified_at: isBuild112Complete() ? nowIso() : null,
  };
}
