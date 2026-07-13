/**
 * CAE-11.12-W7 — Knowledge Evolution certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW7TestsPassed, runKnwW7OptimizationTests } from "./w7-tests";
import { nowIso } from "../../utils";
import { OPTIMIZATION_PROHIBITED_ACTIONS } from "./optimization";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.12-adaptive-learning/07_KNOWLEDGE_EVOLUTION_INSTITUTIONAL_WISDOM.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_EVOLUTION_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_7_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.12/optimization/continuous-improvement.ts",
  "src/lib/civic-action/builds/11.12/optimization/improvement-governance.ts",
  "src/lib/civic-action/builds/11.12/optimization/improvement-implementation.ts",
  "src/lib/civic-action/builds/11.12/optimization/optimization-advisor.ts",
  "src/lib/civic-action/builds/11.12/w7-tests.ts",
  "src/app/api/v1/improvements/route.ts",
  "src/app/api/v1/optimization/knowledge/route.ts",
  "src/app/api/v1/ai/knowledge/optimize/route.ts",
  "data/phase-11/knowledge_improvement_registry.json",
];

export interface Wave7Certification {
  wave_id: "11.12-W7";
  build: "11.12";
  subsystem: "KNW-OPT-001";
  name: "Knowledge Evolution, Institutional Wisdom & Continuous Improvement";
  certified_at: string | null;
  all_passed: boolean;
  optimization_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runKnwW7Certification(): Wave7Certification {
  const testResults = runKnwW7OptimizationTests();
  const testsPassed = allW7TestsPassed();

  const gates = [
    {
      id: "CAE-11.12-W7-G01",
      name: "Evolution documentation",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.12-W7-G02",
      name: "Optimization modules",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.12-W7-G03",
      name: "Advisory-only constitution",
      passed: OPTIMIZATION_PROHIBITED_ACTIONS.length >= 8,
      detail: "prohibited actions",
    },
    {
      id: "CAE-11.12-W7-G04",
      name: "Canonical boundary",
      passed: testResults.find((t) => t.name === "canonical_command_boundary")?.passed ?? false,
      detail: "W3 only",
    },
    {
      id: "CAE-11.12-W7-G05",
      name: "Explainable optimizations",
      passed: testResults.find((t) => t.name === "optimizations_explainable")?.passed ?? false,
      detail: "why+evidence",
    },
    {
      id: "CAE-11.12-W7-G06",
      name: "Advisor governance",
      passed: testResults.find((t) => t.name === "advisor_blocks_self_implement")?.passed ?? false,
      detail: "no self-implement",
    },
    {
      id: "CAE-11.12-W7-G07",
      name: "Pilot isolation",
      passed: testResults.find((t) => t.name === "pilot_isolation_and_failed_visible")?.passed ?? false,
      detail: "production isolated",
    },
    {
      id: "CAE-11.12-W7-G08",
      name: "Outcome measurement",
      passed: testResults.find((t) => t.name === "outcome_measurement")?.passed ?? false,
      detail: "benefit realization",
    },
    {
      id: "CAE-11.12-W7-G09",
      name: "AI improvement governance",
      passed: testResults.find((t) => t.name === "ai_improvement_governance")?.passed ?? false,
      detail: "no auto deploy",
    },
    {
      id: "CAE-11.12-W7-G10",
      name: "No Human ranking",
      passed: testResults.find((t) => t.name === "maturity_institution_not_human")?.passed ?? false,
      detail: "institution only",
    },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.12-W7",
    build: "11.12",
    subsystem: "KNW-OPT-001",
    name: "Knowledge Evolution, Institutional Wisdom & Continuous Improvement",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    optimization_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function isKnwW7Complete(): boolean {
  return runKnwW7Certification().all_passed;
}
