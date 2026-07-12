/**
 * CAE-11.2-W6 — Objective Intelligence certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW6TestsPassed, runObjW6IntelligenceTests } from "./w6-tests";
import { nowIso } from "../../utils";
import { AI_PROHIBITED_ACTIONS } from "./intelligence";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.2-objectives/06_INTELLIGENCE_LAYER.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_INTELLIGENCE_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_6_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.2/intelligence/recommendation-engine.ts",
  "src/lib/civic-action/builds/11.2/intelligence/duplicate-detection.ts",
  "src/lib/civic-action/builds/11.2/intelligence/copilot.ts",
  "src/lib/civic-action/builds/11.2/w6-tests.ts",
  "src/app/api/v1/intelligence/objectives/recommendations/route.ts",
  "src/app/api/v1/ai/objectives/query/route.ts",
  "src/features/objectives/components/ObjectiveRecommendationCard.tsx",
];

export interface Wave6Certification {
  wave_id: "11.2-W6";
  build: "11.2";
  subsystem: "OBJ-INT-001";
  name: "Objective Intelligence, Analytics & Decision Support";
  certified_at: string | null;
  all_passed: boolean;
  intelligence_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runObjW6Certification(): Wave6Certification {
  const testResults = runObjW6IntelligenceTests();
  const testsPassed = allW6TestsPassed();

  const gates = [
    { id: "CAE-11.2-W6-G01", name: "Intelligence documentation", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.2-W6-G02", name: "Intelligence modules", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.2-W6-G03", name: "Advisory-only constitution", passed: AI_PROHIBITED_ACTIONS.length >= 10, detail: "prohibited actions" },
    { id: "CAE-11.2-W6-G04", name: "Explainable recommendations", passed: testResults.find((t) => t.name === "recommendations_explainable")?.passed ?? false, detail: "why+evidence" },
    { id: "CAE-11.2-W6-G05", name: "Copilot governance", passed: testResults.find((t) => t.name === "copilot_blocks_approval")?.passed ?? false, detail: "no approve" },
    { id: "CAE-11.2-W6-G06", name: "Dismissible feedback", passed: testResults.find((t) => t.name === "feedback_dismiss_non_mutating")?.passed ?? false, detail: "feedback store" },
    { id: "CAE-11.2-W6-G07", name: "Duplicate detection", passed: testResults.find((t) => t.name === "duplicate_detection_runs")?.passed ?? false, detail: "similarity" },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.2-W6",
    build: "11.2",
    subsystem: "OBJ-INT-001",
    name: "Objective Intelligence, Analytics & Decision Support",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    intelligence_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}
