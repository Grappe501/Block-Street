/**
 * CAE-11.1-W7 — Institutional Optimization certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW7TestsPassed, runIniW7OptimizationTests } from "./w7-tests";
import { nowIso } from "../../utils";
import { OPTIMIZATION_PROHIBITED_ACTIONS } from "./optimization/contracts";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.1-initiatives/07_OPTIMIZATION_LAYER.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_OPTIMIZATION_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/WAVE_7_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.1/optimization/continuous-improvement.ts",
  "src/lib/civic-action/builds/11.1/optimization/institutional-memory.ts",
  "src/lib/civic-action/builds/11.1/optimization/optimization-advisor.ts",
  "src/lib/civic-action/builds/11.1/w7-tests.ts",
  "src/app/api/v1/optimization/route.ts",
  "src/app/api/v1/simulation/run/route.ts",
  "src/features/initiatives/components/ImprovementDashboard.tsx",
];

export interface Wave7Certification {
  wave_id: "11.1-W7";
  build: "11.1";
  subsystem: "INI-OPT-001";
  name: "Institutional Optimization Layer";
  certified_at: string | null;
  all_passed: boolean;
  optimization_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runIniW7Certification(): Wave7Certification {
  const testResults = runIniW7OptimizationTests();
  const testsPassed = allW7TestsPassed();

  const gates = [
    { id: "CAE-11.1-W7-G01", name: "Optimization documentation", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.1-W7-G02", name: "Optimization modules", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.1-W7-G03", name: "Advisory-only constitution", passed: OPTIMIZATION_PROHIBITED_ACTIONS.length >= 8, detail: "prohibited actions" },
    { id: "CAE-11.1-W7-G04", name: "Explainable optimizations", passed: testResults.find((t) => t.name === "optimizations_explainable")?.passed ?? false, detail: "why+evidence" },
    { id: "CAE-11.1-W7-G05", name: "Advisor governance", passed: testResults.find((t) => t.name === "advisor_blocks_approval")?.passed ?? false, detail: "no approve" },
    { id: "CAE-11.1-W7-G06", name: "Feedback loop", passed: testResults.find((t) => t.name === "feedback_rejection_learns")?.passed ?? false, detail: "accept/reject" },
    { id: "CAE-11.1-W7-G07", name: "Simulation sandbox", passed: testResults.find((t) => t.name === "simulation_non_mutating")?.passed ?? false, detail: "no mutations" },
    { id: "CAE-11.1-W7-G08", name: "Digital twin", passed: testResults.find((t) => t.name === "digital_twin_snapshot")?.passed ?? false, detail: "safe test" },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.1-W7",
    build: "11.1",
    subsystem: "INI-OPT-001",
    name: "Institutional Optimization Layer",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    optimization_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}
