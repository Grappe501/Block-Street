/**
 * CAE-11.2-W7 — Objective Optimization certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW7TestsPassed, runObjW7OptimizationTests } from "./w7-tests";
import { nowIso } from "../../utils";
import { OPTIMIZATION_PROHIBITED_ACTIONS } from "./optimization/contracts";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.2-objectives/07_OPTIMIZATION_LAYER.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_OPTIMIZATION_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_7_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.2/optimization/continuous-improvement.ts",
  "src/lib/civic-action/builds/11.2/optimization/lesson-engine.ts",
  "src/lib/civic-action/builds/11.2/optimization/optimization-advisor.ts",
  "src/lib/civic-action/builds/11.2/w7-tests.ts",
  "src/app/api/v1/optimization/objectives/route.ts",
  "src/app/api/v1/ai/objectives/optimize/route.ts",
  "src/features/objectives/components/ObjectiveOptimizationPanel.tsx",
];

export interface Wave7Certification {
  wave_id: "11.2-W7";
  build: "11.2";
  subsystem: "OBJ-OPT-001";
  name: "Objective Continuous Improvement, Institutional Learning & Optimization";
  certified_at: string | null;
  all_passed: boolean;
  optimization_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runObjW7Certification(): Wave7Certification {
  const testResults = runObjW7OptimizationTests();
  const testsPassed = allW7TestsPassed();

  const gates = [
    { id: "CAE-11.2-W7-G01", name: "Optimization documentation", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.2-W7-G02", name: "Optimization modules", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.2-W7-G03", name: "Advisory-only constitution", passed: OPTIMIZATION_PROHIBITED_ACTIONS.length >= 8, detail: "prohibited actions" },
    { id: "CAE-11.2-W7-G04", name: "Explainable optimizations", passed: testResults.find((t) => t.name === "optimizations_explainable")?.passed ?? false, detail: "why+evidence" },
    { id: "CAE-11.2-W7-G05", name: "Advisor governance", passed: testResults.find((t) => t.name === "advisor_blocks_approval")?.passed ?? false, detail: "no approve" },
    { id: "CAE-11.2-W7-G06", name: "Feedback loop", passed: testResults.find((t) => t.name === "feedback_rejection_learns")?.passed ?? false, detail: "accept/reject" },
    { id: "CAE-11.2-W7-G07", name: "Simulation sandbox", passed: testResults.find((t) => t.name === "simulation_non_mutating")?.passed ?? false, detail: "no mutations" },
    { id: "CAE-11.2-W7-G08", name: "Lessons from completion", passed: testResults.find((t) => t.name === "lessons_engine_runs")?.passed ?? false, detail: "lesson engine" },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.2-W7",
    build: "11.2",
    subsystem: "OBJ-OPT-001",
    name: "Objective Continuous Improvement, Institutional Learning & Optimization",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    optimization_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}
