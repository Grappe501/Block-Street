/**
 * CAE-11.1-W8 — Production readiness certification + Build 11.1 completion
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW8TestsPassed, runIniW8ProductionTests } from "./w8-tests";
import { runCertificationSuite } from "./production/certification-suite";
import { runIniW1Certification } from "./w1";
import { runIniW2Certification } from "./w2";
import { runIniW3Certification } from "./w3";
import { runIniW4Certification } from "./w4";
import { runIniW5Certification } from "./w5";
import { runIniW6Certification } from "./w6";
import { runIniW7Certification } from "./w7";
import { nowIso } from "../../utils";
import { BUILD_111_WAVES } from "./production/contracts";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.1-initiatives/08_PRODUCTION_READINESS.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_PRODUCTION_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/WAVE_8_CERTIFICATION.md",
  "docs/phase-11/11.1-initiatives/BUILD_11.1_COMPLETE.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.1/production/launch-control.ts",
  "src/lib/civic-action/builds/11.1/production/certification-suite.ts",
  "src/lib/civic-action/builds/11.1/w8-tests.ts",
  "src/app/api/v1/production/launch/route.ts",
  "src/features/initiatives/components/LaunchControlCenter.tsx",
  "data/phase-11/initiative_production_manifest.json",
];

export interface Wave8Certification {
  wave_id: "11.1-W8";
  build: "11.1";
  subsystem: "INI-PRD-001";
  name: "Production Readiness, Operational Certification, and Launch";
  certified_at: string | null;
  all_passed: boolean;
  production_tests_passed: boolean;
  build_complete: boolean;
  waves_summary: { wave: string; all_passed: boolean }[];
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runIniW8Certification(): Wave8Certification {
  const testResults = runIniW8ProductionTests();
  const testsPassed = allW8TestsPassed();
  const suite = runCertificationSuite();

  const waves_summary = [
    { wave: "W1", all_passed: runIniW1Certification().all_passed },
    { wave: "W2", all_passed: runIniW2Certification().all_passed },
    { wave: "W3", all_passed: runIniW3Certification().all_passed },
    { wave: "W4", all_passed: runIniW4Certification().all_passed },
    { wave: "W5", all_passed: runIniW5Certification().all_passed },
    { wave: "W6", all_passed: runIniW6Certification().all_passed },
    { wave: "W7", all_passed: runIniW7Certification().all_passed },
    { wave: "W8", all_passed: false },
  ];

  const gates = [
    { id: "CAE-11.1-W8-G01", name: "Production documentation", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.1-W8-G02", name: "Production modules", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.1-W8-G03", name: "Configuration validation", passed: testResults.find((t) => t.name === "configuration_validation")?.passed ?? false, detail: "env + flags" },
    { id: "CAE-11.1-W8-G04", name: "Certification suite W1–W7", passed: suite.suite_passed, detail: `${suite.waves.filter((w) => w.all_passed).length}/7 waves` },
    { id: "CAE-11.1-W8-G05", name: "Launch control center", passed: testResults.find((t) => t.name === "launch_control_generated")?.passed ?? false, detail: "go/no-go" },
    { id: "CAE-11.1-W8-G06", name: "Production certification levels", passed: testResults.find((t) => t.name === "production_certification_levels")?.passed ?? false, detail: "4 levels" },
    { id: "CAE-11.1-W8-G07", name: "Operator training", passed: testResults.find((t) => t.name === "operator_training_modules")?.passed ?? false, detail: "onboarding" },
    { id: "CAE-11.1-W8-G08", name: "Continuous verification", passed: testResults.find((t) => t.name === "continuous_verification")?.passed ?? false, detail: "schedules" },
    { id: "CAE-11.1-W8-G09", name: "Executive sign-off", passed: testResults.find((t) => t.name === "executive_sign_off_recorded")?.passed ?? false, detail: "human approval" },
    { id: "CAE-11.1-W8-G10", name: "Health checks", passed: testResults.find((t) => t.name === "health_summary")?.passed ?? false, detail: "production health" },
    { id: "CAE-11.1-W8-G11", name: "W8 documentation", passed: testResults.find((t) => t.name === "w8_documentation")?.passed ?? false, detail: "build complete doc" },
    { id: "CAE-11.1-W8-G12", name: "Full wave suite", passed: testResults.find((t) => t.name === "certification_suite_passed")?.passed ?? false, detail: "W1–W7" },
  ];

  const w8Passed = gates.every((g) => g.passed) && testsPassed;
  waves_summary.find((w) => w.wave === "W8")!.all_passed = w8Passed;

  const build_complete =
    w8Passed &&
    waves_summary.every((w) => w.all_passed) &&
    BUILD_111_WAVES.length === 8;

  return {
    wave_id: "11.1-W8",
    build: "11.1",
    subsystem: "INI-PRD-001",
    name: "Production Readiness, Operational Certification, and Launch",
    certified_at: w8Passed ? nowIso() : null,
    all_passed: w8Passed,
    production_tests_passed: testsPassed,
    build_complete,
    waves_summary,
    gates,
    test_results: testResults,
  };
}

export function isBuild111Complete(): boolean {
  return runIniW8Certification().build_complete;
}

export function runBuild111Certification() {
  return {
    build: "11.1",
    name: "Initiative Engine",
    waves: BUILD_111_WAVES,
    w1: runIniW1Certification(),
    w2: runIniW2Certification(),
    w3: runIniW3Certification(),
    w4: runIniW4Certification(),
    w5: runIniW5Certification(),
    w6: runIniW6Certification(),
    w7: runIniW7Certification(),
    w8: runIniW8Certification(),
    complete: isBuild111Complete(),
    certified_at: isBuild111Complete() ? nowIso() : null,
  };
}
