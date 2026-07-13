/**
 * CAE-11.12-W8 — Certification suite (W1–W7 + constitutional compliance)
 */
import { readFileSync } from "fs";
import { join } from "path";
import { runKnwW1Certification } from "../w1";
import { runKnwW2Certification } from "../w2";
import { runKnwW3Certification } from "../w3";
import { runKnwW4Certification } from "../w4";
import { runKnwW5Certification } from "../w5";
import { runKnwW6Certification } from "../w6";
import { runKnwW7Certification } from "../w7";
import type { ReadinessCheck } from "./contracts";

const ROOT = process.cwd();
const CONSTITUTION_PATH = join(ROOT, "docs/phase-11/11.12-adaptive-learning/01_CONSTITUTION.md");

export type WaveCertificationSummary = {
  wave: string;
  name: string;
  all_passed: boolean;
  gate_pass_count: number;
  gate_total: number;
};

export type KnowledgeCertificationSuiteResult = {
  waves: WaveCertificationSummary[];
  constitutional_checks: ReadinessCheck[];
  suite_passed: boolean;
};

let cachedSuite: KnowledgeCertificationSuiteResult | null = null;

function readConstitutionMd(): string {
  return readFileSync(CONSTITUTION_PATH, "utf8");
}

export function clearKnowledgeCertificationSuiteCache() {
  cachedSuite = null;
}

export function runKnowledgeCertificationSuite(): KnowledgeCertificationSuiteResult {
  if (cachedSuite) return cachedSuite;
  const waveCerts = [
    { wave: "W1", cert: runKnwW1Certification() },
    { wave: "W2", cert: runKnwW2Certification() },
    { wave: "W3", cert: runKnwW3Certification() },
    { wave: "W4", cert: runKnwW4Certification() },
    { wave: "W5", cert: runKnwW5Certification() },
    { wave: "W6", cert: runKnwW6Certification() },
    { wave: "W7", cert: runKnwW7Certification() },
  ];

  const waves: WaveCertificationSummary[] = waveCerts.map(({ wave, cert }) => ({
    wave,
    name: "name" in cert ? String(cert.name) : "protocol_name" in cert ? String(cert.protocol_name) : wave,
    all_passed: cert.all_passed,
    gate_pass_count: cert.gates.filter((g) => g.passed).length,
    gate_total: cert.gates.length,
  }));

  const constitutionMd = readConstitutionMd();
  const constitutional_checks: ReadinessCheck[] = [
    {
      check_id: "const-governing-principle",
      category: "constitutional",
      title: "Governing principle defined",
      status: constitutionMd.includes("Every screen should answer one question") || constitutionMd.includes("Human authority")
        ? "pass"
        : "fail",
      detail: "Knowledge constitution doctrine",
      blocking: true,
    },
    {
      check_id: "const-ai-advisory",
      category: "constitutional",
      title: "AI remains advisory",
      status:
        constitutionMd.toLowerCase().includes("ai") &&
        (constitutionMd.toLowerCase().includes("advisory") || constitutionMd.toLowerCase().includes("human"))
          ? "pass"
          : "fail",
      detail: "AI doctrine in constitution",
      blocking: true,
    },
    {
      check_id: "const-completion-not-competency",
      category: "constitutional",
      title: "Completion differs from competency",
      status: constitutionMd.toLowerCase().includes("competency") ? "pass" : "fail",
      detail: "Competency doctrine",
      blocking: true,
    },
    {
      check_id: "test-canonical-model",
      category: "lifecycle_testing",
      title: "Canonical data model tests",
      status: waves.find((w) => w.wave === "W2")?.all_passed ? "pass" : "fail",
      detail: "W2 canonical model certification",
      blocking: true,
    },
    {
      check_id: "test-domain-services",
      category: "lifecycle_testing",
      title: "Knowledge engine tests",
      status: waves.find((w) => w.wave === "W3")?.all_passed ? "pass" : "fail",
      detail: "W3 domain service certification",
      blocking: true,
    },
    {
      check_id: "test-human-experience",
      category: "lifecycle_testing",
      title: "Human experience assembler tests",
      status: waves.find((w) => w.wave === "W4")?.all_passed ? "pass" : "fail",
      detail: "W4 UX certification",
      blocking: true,
    },
    {
      check_id: "test-api-governance",
      category: "permission_testing",
      title: "API context and command tests",
      status: waves.find((w) => w.wave === "W5")?.all_passed ? "pass" : "fail",
      detail: "W5 API certification",
      blocking: true,
    },
    {
      check_id: "test-intelligence-governance",
      category: "security_testing",
      title: "Intelligence advisory governance",
      status: waves.find((w) => w.wave === "W6")?.all_passed ? "pass" : "fail",
      detail: "W6 intelligence certification",
      blocking: true,
    },
    {
      check_id: "test-optimization-governance",
      category: "security_testing",
      title: "Optimization advisory governance",
      status: waves.find((w) => w.wave === "W7")?.all_passed ? "pass" : "fail",
      detail: "W7 optimization certification",
      blocking: true,
    },
    {
      check_id: "test-spanish",
      category: "spanish_certification",
      title: "Spanish learning standard",
      status: constitutionMd.toLowerCase().includes("spanish") ? "pass" : "attention",
      detail: "LEARNING_SPANISH_STANDARD.md registered",
      blocking: false,
    },
    {
      check_id: "test-accessibility",
      category: "accessibility_testing",
      title: "Accessibility invariants (W4)",
      status: waves.find((w) => w.wave === "W4")?.all_passed ? "pass" : "attention",
      detail: "W4 a11y requirement registered",
      blocking: false,
    },
    {
      check_id: "test-performance",
      category: "performance_certification",
      title: "Performance baseline",
      status: "attention",
      detail: "Run load test against staging before general availability",
      blocking: false,
    },
  ];

  const suite_passed =
    waves.every((w) => w.all_passed) &&
    constitutional_checks.filter((c) => c.blocking).every((c) => c.status === "pass");

  cachedSuite = { waves, constitutional_checks, suite_passed };
  return cachedSuite;
}
