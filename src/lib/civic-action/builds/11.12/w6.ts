/**
 * CAE-11.12-W6 — Knowledge Intelligence certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW6TestsPassed, runKnwW6IntelligenceTests } from "./w6-tests";
import { nowIso } from "../../utils";
import { AI_PROHIBITED_ACTIONS } from "./intelligence";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.12-adaptive-learning/06_KNOWLEDGE_INTELLIGENCE_ADAPTIVE_LEARNING.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_INTELLIGENCE_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_6_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.12/intelligence/orchestrator.ts",
  "src/lib/civic-action/builds/11.12/intelligence/semantic-retrieval.ts",
  "src/lib/civic-action/builds/11.12/intelligence/tutor-orchestrator.ts",
  "src/lib/civic-action/builds/11.12/w6-tests.ts",
  "src/app/api/v1/intelligence/knowledge/query/route.ts",
  "src/app/api/v1/ai/knowledge/query/route.ts",
  "data/phase-11/knowledge_intelligence_registry.json",
];

export interface Wave6Certification {
  wave_id: "11.12-W6";
  build: "11.12";
  subsystem: "KNW-INT-001";
  name: "Knowledge Intelligence, Adaptive Learning & Explainable AI";
  certified_at: string | null;
  all_passed: boolean;
  intelligence_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runKnwW6Certification(): Wave6Certification {
  const testResults = runKnwW6IntelligenceTests();
  const testsPassed = allW6TestsPassed();

  const gates = [
    {
      id: "CAE-11.12-W6-G01",
      name: "Intelligence documentation",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.12-W6-G02",
      name: "Intelligence modules",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.12-W6-G03",
      name: "Canonical boundary",
      passed: testsPassed,
      detail: "no direct mutation",
    },
    {
      id: "CAE-11.12-W6-G04",
      name: "Permission safety",
      passed: testResults.find((t) => t.name === "permission_filter_before_retrieval")?.passed ?? false,
      detail: "pre-retrieval filter",
    },
    {
      id: "CAE-11.12-W6-G05",
      name: "Explainable recommendations",
      passed: testResults.find((t) => t.name === "recommendations_explainable")?.passed ?? false,
      detail: "why+evidence",
    },
    {
      id: "CAE-11.12-W6-G06",
      name: "Copilot governance",
      passed: testResults.find((t) => t.name === "copilot_blocks_prohibited")?.passed ?? false,
      detail: "no publish/certify",
    },
    {
      id: "CAE-11.12-W6-G07",
      name: "Tutor assessment safety",
      passed: testResults.find((t) => t.name === "tutor_blocks_exam")?.passed ?? false,
      detail: "protected assessment",
    },
    {
      id: "CAE-11.12-W6-G08",
      name: "No Human ranking",
      passed: testResults.find((t) => t.name === "no_human_ranking")?.passed ?? false,
      detail: "capability coverage",
    },
    {
      id: "CAE-11.12-W6-G09",
      name: "Evaluation suite",
      passed: testResults.find((t) => t.name === "evaluation_suite_runs")?.passed ?? false,
      detail: "benchmark cases",
    },
    {
      id: "CAE-11.12-W6-G10",
      name: "AI prohibited actions",
      passed: AI_PROHIBITED_ACTIONS.length >= 10,
      detail: `${AI_PROHIBITED_ACTIONS.length} rules`,
    },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.12-W6",
    build: "11.12",
    subsystem: "KNW-INT-001",
    name: "Knowledge Intelligence, Adaptive Learning & Explainable AI",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    intelligence_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function isKnwW6Complete(): boolean {
  return runKnwW6Certification().all_passed;
}
