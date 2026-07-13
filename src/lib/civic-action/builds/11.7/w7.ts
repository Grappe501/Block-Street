/**
 * CAE-11.7-W7 — Communication Optimization certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW7TestsPassed, runComW7OptimizationTests } from "./w7-tests";
import { nowIso } from "../../utils";
import { OPTIMIZATION_PROHIBITED_ACTIONS } from "./optimization/contracts";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-communications/07_OPTIMIZATION_LAYER.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_OPTIMIZATION_PROTOCOL.md",
  "docs/phase-11/11.7-communications/PROTOCOL_7_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/optimization/continuous-improvement.ts",
  "src/lib/civic-action/builds/11.7/optimization/lesson-engine.ts",
  "src/lib/civic-action/builds/11.7/optimization/optimization-advisor.ts",
  "src/lib/civic-action/builds/11.7/w7-tests.ts",
  "src/app/api/v1/optimization/communications/route.ts",
  "src/app/api/v1/ai/communications/optimize/route.ts",
  "src/features/communications/components/CommunicationOptimizationCenter.tsx",
];

export interface Wave7Certification {
  wave_id: "11.7-W7";
  build: "11.7";
  subsystem: "COM-OPT-001";
  name: "Communication Continuous Improvement & Optimization";
  certified_at: string | null;
  all_passed: boolean;
  optimization_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runComW7Certification(): Wave7Certification {
  const testResults = runComW7OptimizationTests();
  const testsPassed = allW7TestsPassed();

  const gates = [
    {
      id: "CAE-11.7-W7-G01",
      name: "Optimization documentation",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.7-W7-G02",
      name: "Optimization modules",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.7-W7-G03",
      name: "Advisory-only constitution",
      passed: OPTIMIZATION_PROHIBITED_ACTIONS.length >= 8,
      detail: "prohibited actions",
    },
    {
      id: "CAE-11.7-W7-G04",
      name: "Explainable optimizations",
      passed: testResults.find((t) => t.name === "optimizations_explainable")?.passed ?? false,
      detail: "why+evidence",
    },
    {
      id: "CAE-11.7-W7-G05",
      name: "Advisor governance",
      passed: testResults.find((t) => t.name === "advisor_blocks_approval")?.passed ?? false,
      detail: "no approve/send",
    },
    {
      id: "CAE-11.7-W7-G06",
      name: "Feedback loop",
      passed: testResults.find((t) => t.name === "feedback_rejection_learns")?.passed ?? false,
      detail: "accept/reject",
    },
    {
      id: "CAE-11.7-W7-G07",
      name: "Simulation sandbox",
      passed: testResults.find((t) => t.name === "simulation_non_mutating")?.passed ?? false,
      detail: "no mutations",
    },
    {
      id: "CAE-11.7-W7-G08",
      name: "Lessons from archive",
      passed: testResults.find((t) => t.name === "lessons_engine_runs")?.passed ?? false,
      detail: "lesson engine",
    },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.7-W7",
    build: "11.7",
    subsystem: "COM-OPT-001",
    name: "Communication Continuous Improvement & Optimization",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    optimization_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function isComW7Complete(): boolean {
  return runComW7Certification().all_passed;
}
