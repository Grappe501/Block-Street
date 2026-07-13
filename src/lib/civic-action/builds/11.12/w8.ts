/**
 * CAE-11.12-W8 — Production readiness certification + Build 11.12 completion
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { allW8TestsPassed, runKnwW8ProductionTests } from "./w8-tests";
import { runKnowledgeCertificationSuite } from "./production/certification-suite";
import { nowIso } from "../../utils";
import { BUILD_1112_WAVES, PRODUCTION_INVARIANTS } from "./production/contracts";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.12-adaptive-learning/08_PRODUCTION_READINESS_CERTIFICATION.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_PRODUCTION_CONSTITUTION.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_8_CERTIFICATION.md",
  "docs/phase-11/11.12-adaptive-learning/BUILD_11.12_COMPLETE.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.12/production/launch-control.ts",
  "src/lib/civic-action/builds/11.12/production/certification-suite.ts",
  "src/lib/civic-action/builds/11.12/production/certification-registry.ts",
  "src/lib/civic-action/builds/11.12/w8-tests.ts",
  "src/app/api/v1/knowledge-certification/status/route.ts",
  "src/app/api/v1/knowledge-launch/go-no-go/route.ts",
  "src/features/knowledge/components/KnowledgeLaunchControlCenter.tsx",
  "data/phase-11/knowledge_production_manifest.json",
];

export interface Wave8Certification {
  wave_id: "11.12-W8";
  build: "11.12";
  subsystem: "KNW-PRD-001";
  name: "Knowledge Production Readiness, Certification & Institutional Launch";
  certified_at: string | null;
  all_passed: boolean;
  production_tests_passed: boolean;
  build_complete: boolean;
  waves_summary: { wave: string; all_passed: boolean }[];
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runKnwW8Certification(): Wave8Certification {
  const registry = loadRequirementsRegistry();
  const w8Reqs = registry.requirements.filter((r) => r.build === "11.12" && r.wave === "W8");
  const testResults = runKnwW8ProductionTests();
  const testsPassed = allW8TestsPassed();
  const suite = runKnowledgeCertificationSuite();

  const waves_summary = [
    ...suite.waves.map((w) => ({ wave: w.wave, all_passed: w.all_passed })),
    { wave: "W8", all_passed: false },
  ];

  const gates = [
    {
      id: "CAE-11.12-W8-G01",
      name: "Production documentation",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.12-W8-G02",
      name: "Production modules and APIs",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.12-W8-G03",
      name: "Production invariants",
      passed: PRODUCTION_INVARIANTS.length >= 8,
      detail: `${PRODUCTION_INVARIANTS.length} invariants`,
    },
    {
      id: "CAE-11.12-W8-G04",
      name: "W8 requirements",
      passed: w8Reqs.length >= 15 && w8Reqs.every((r) => r.status === "implemented"),
      detail: `${w8Reqs.length} requirements`,
    },
    {
      id: "CAE-11.12-W8-G05",
      name: "Configuration validation",
      passed: testResults.find((t) => t.name === "configuration_validation")?.passed ?? false,
      detail: "env + flags",
    },
    {
      id: "CAE-11.12-W8-G06",
      name: "Certification suite W1–W7",
      passed: (testResults.find((t) => t.name === "certification_suite_runs")?.passed ?? false) && suite.waves.filter((w) => w.all_passed).length >= 6,
      detail: `${suite.waves.filter((w) => w.all_passed).length}/7 waves`,
    },
    {
      id: "CAE-11.12-W8-G07",
      name: "Critical certification gates",
      passed: testResults.find((t) => t.name === "certification_gate_registry")?.passed ?? false,
      detail: "10 gate domains",
    },
    {
      id: "CAE-11.12-W8-G08",
      name: "Launch control center",
      passed: testResults.find((t) => t.name === "launch_control_generated")?.passed ?? false,
      detail: "go/no-go",
    },
    {
      id: "CAE-11.12-W8-G09",
      name: "Production certification levels",
      passed: testResults.find((t) => t.name === "production_certification_levels")?.passed ?? false,
      detail: "4 levels",
    },
    {
      id: "CAE-11.12-W8-G10",
      name: "Certification run orchestration",
      passed: testResults.find((t) => t.name === "certification_run_completed")?.passed ?? false,
      detail: "run lifecycle",
    },
    {
      id: "CAE-11.12-W8-G11",
      name: "Continuous verification",
      passed: testResults.find((t) => t.name === "continuous_verification")?.passed ?? false,
      detail: "schedules",
    },
    {
      id: "CAE-11.12-W8-G12",
      name: "Build completion",
      passed: testResults.find((t) => t.name === "build_complete_doc")?.passed ?? false,
      detail: "BUILD_11.12_COMPLETE.md",
    },
  ];

  const w8Passed = gates.every((g) => g.passed) && testsPassed;
  waves_summary.find((w) => w.wave === "W8")!.all_passed = w8Passed;

  const build_complete =
    w8Passed && waves_summary.every((w) => w.all_passed) && BUILD_1112_WAVES.length === 8;

  return {
    wave_id: "11.12-W8",
    build: "11.12",
    subsystem: "KNW-PRD-001",
    name: "Knowledge Production Readiness, Certification & Institutional Launch",
    certified_at: w8Passed ? nowIso() : null,
    all_passed: w8Passed,
    production_tests_passed: testsPassed,
    build_complete,
    waves_summary,
    gates,
    test_results: testResults,
  };
}

export function isBuild1112Complete(): boolean {
  return runKnwW8Certification().build_complete;
}

export function runBuild1112Certification() {
  const suite = runKnowledgeCertificationSuite();
  const w8 = runKnwW8Certification();
  return {
    build: "11.12",
    name: "Knowledge, Learning & Institutional Intelligence Engine",
    waves: BUILD_1112_WAVES,
    suite,
    w8,
    complete: isBuild1112Complete(),
    certified_at: isBuild1112Complete() ? nowIso() : null,
  };
}
