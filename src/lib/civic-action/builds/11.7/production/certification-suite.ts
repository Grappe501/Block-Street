/**
 * CAE-11.7-W8 — Certification suite (W1–W7 + constitutional compliance)
 */
import { readFileSync } from "fs";
import { join } from "path";
import { runComW1Certification } from "../w1";
import { runComW2Certification } from "../w2";
import { runComW3Certification } from "../w3";
import { runComW4Certification } from "../w4";
import { runComW5Certification } from "../w5";
import { runComW6Certification } from "../w6";
import { runComW7Certification } from "../w7";
import { allW3TestsPassed } from "../w3-tests";
import { allW4TestsPassed } from "../w4-tests";
import { allW5TestsPassed } from "../w5-tests";
import { allW6TestsPassed } from "../w6-tests";
import { allW7TestsPassed } from "../w7-tests";
import type { ReadinessCheck } from "./contracts";

const ROOT = process.cwd();
const CONSTITUTION_PATH = join(ROOT, "docs/phase-11/11.7-communications/01_CONSTITUTION.md");

export type WaveCertificationSummary = {
  wave: string;
  name: string;
  all_passed: boolean;
  gate_pass_count: number;
  gate_total: number;
};

function readConstitutionMd(): string {
  return readFileSync(CONSTITUTION_PATH, "utf8");
}

export function runCommunicationCertificationSuite(): {
  waves: WaveCertificationSummary[];
  constitutional_checks: ReadinessCheck[];
  suite_passed: boolean;
} {
  const waveCerts = [
    { wave: "W1", cert: runComW1Certification() },
    { wave: "W2", cert: runComW2Certification() },
    { wave: "W3", cert: runComW3Certification() },
    { wave: "W4", cert: runComW4Certification() },
    { wave: "W5", cert: runComW5Certification() },
    { wave: "W6", cert: runComW6Certification() },
    { wave: "W7", cert: runComW7Certification() },
  ];

  const waves: WaveCertificationSummary[] = waveCerts.map(({ wave, cert }) => ({
    wave,
    name: "name" in cert ? String(cert.name) : cert.protocol_name,
    all_passed: cert.all_passed,
    gate_pass_count: cert.gates.filter((g) => g.passed).length,
    gate_total: cert.gates.length,
  }));

  const constitutionMd = readConstitutionMd();
  const constitutional_checks: ReadinessCheck[] = [
    {
      check_id: "const-governing-mission",
      category: "constitutional",
      title: "Governing mission defined",
      status: constitutionMd.includes("Communication exists to improve execution") ? "pass" : "fail",
      detail: "constitutional doctrine",
      blocking: true,
    },
    {
      check_id: "const-ai-prohibitions",
      category: "constitutional",
      title: "AI approval prohibition",
      status:
        constitutionMd.toLowerCase().includes("approve decisions") &&
        constitutionMd.toLowerCase().includes("ai may never")
          ? "pass"
          : "fail",
      detail: "AI doctrine in constitution",
      blocking: true,
    },
    {
      check_id: "test-domain-services",
      category: "lifecycle_testing",
      title: "Communications engine tests",
      status: allW3TestsPassed() ? "pass" : "fail",
      detail: "W3 domain service test suite",
      blocking: true,
    },
    {
      check_id: "test-api-governance",
      category: "permission_testing",
      title: "API context and command tests",
      status: allW5TestsPassed() ? "pass" : "fail",
      detail: "W5 API constitution tests",
      blocking: true,
    },
    {
      check_id: "test-ui-workflows",
      category: "lifecycle_testing",
      title: "Human experience assembler tests",
      status: allW4TestsPassed() ? "pass" : "fail",
      detail: "W4 UX assembler tests",
      blocking: true,
    },
    {
      check_id: "test-intelligence-governance",
      category: "security_testing",
      title: "Intelligence advisory governance",
      status: allW6TestsPassed() ? "pass" : "fail",
      detail: "W6 copilot prohibition tests",
      blocking: true,
    },
    {
      check_id: "test-optimization-governance",
      category: "security_testing",
      title: "Optimization advisory governance",
      status: allW7TestsPassed() ? "pass" : "fail",
      detail: "W7 advisor prohibition tests",
      blocking: true,
    },
    {
      check_id: "test-spanish",
      category: "spanish_certification",
      title: "Spanish communication standard",
      status: constitutionMd.toLowerCase().includes("spanish") ? "pass" : "attention",
      detail: "COMMUNICATION_SPANISH_STANDARD.md registered",
      blocking: false,
    },
    {
      check_id: "test-accessibility",
      category: "accessibility_testing",
      title: "Keyboard operable workflows (W4 requirement)",
      status: waves.find((w) => w.wave === "W4")?.all_passed ? "pass" : "attention",
      detail: "Semantic HTML + W4 a11y requirement registered",
      blocking: false,
    },
    {
      check_id: "test-mobile",
      category: "mobile_certification",
      title: "Responsive communication UI",
      status: "attention",
      detail: "Manual mobile verification recommended before statewide launch",
      blocking: false,
    },
    {
      check_id: "test-performance",
      category: "performance_certification",
      title: "Performance baseline",
      status: "attention",
      detail: "Run load test against staging before statewide deployment",
      blocking: false,
    },
  ];

  const suite_passed =
    waves.every((w) => w.all_passed) &&
    constitutional_checks.filter((c) => c.blocking).every((c) => c.status === "pass");

  return { waves, constitutional_checks, suite_passed };
}
