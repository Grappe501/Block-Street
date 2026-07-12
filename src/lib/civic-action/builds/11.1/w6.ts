/**
 * CAE-11.1-W6 — Initiative Intelligence certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW6TestsPassed, runIniW6IntelligenceTests } from "./w6-tests";
import { nowIso } from "../../utils";
import { AI_PROHIBITED_ACTIONS } from "./intelligence";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.1-initiatives/06_INTELLIGENCE_LAYER.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_INTELLIGENCE_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/WAVE_6_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.1/intelligence/recommendation-engine.ts",
  "src/lib/civic-action/builds/11.1/intelligence/duplicate-detection.ts",
  "src/lib/civic-action/builds/11.1/intelligence/copilot.ts",
  "src/lib/civic-action/builds/11.1/w6-tests.ts",
  "src/app/api/v1/intelligence/recommendations/route.ts",
  "src/app/api/v1/initiatives/duplicates/candidates/route.ts",
  "src/app/api/v1/ai/query/route.ts",
  "src/features/initiatives/components/RecommendationCard.tsx",
];

export interface Wave6Certification {
  wave_id: "11.1-W6";
  build: "11.1";
  subsystem: "INI-INT-001";
  name: "Initiative Intelligence Layer";
  certified_at: string | null;
  all_passed: boolean;
  intelligence_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runIniW6Certification(): Wave6Certification {
  const testResults = runIniW6IntelligenceTests();
  const testsPassed = allW6TestsPassed();

  const gates = [
    { id: "CAE-11.1-W6-G01", name: "Intelligence documentation", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.1-W6-G02", name: "Intelligence modules", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.1-W6-G03", name: "Advisory-only constitution", passed: AI_PROHIBITED_ACTIONS.length >= 8, detail: "prohibited actions" },
    { id: "CAE-11.1-W6-G04", name: "Explainable recommendations", passed: testResults.find((t) => t.name === "recommendations_explainable")?.passed ?? false, detail: "why+evidence" },
    { id: "CAE-11.1-W6-G05", name: "Copilot governance", passed: testResults.find((t) => t.name === "copilot_blocks_approval")?.passed ?? false, detail: "no approve" },
    { id: "CAE-11.1-W6-G06", name: "Dismissible feedback", passed: testResults.find((t) => t.name === "feedback_dismiss_non_mutating")?.passed ?? false, detail: "feedback store" },
    { id: "CAE-11.1-W6-G07", name: "Duplicate detection", passed: testResults.find((t) => t.name === "duplicate_detection_runs")?.passed ?? false, detail: "similarity" },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.1-W6",
    build: "11.1",
    subsystem: "INI-INT-001",
    name: "Initiative Intelligence Layer",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    intelligence_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}
