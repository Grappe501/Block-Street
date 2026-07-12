/**
 * CAE-11.1-W8 — Certification suite (W1–W7 + constitutional compliance)
 */
import { runIniW1Certification } from "../w1";
import { runIniW2Certification } from "../w2";
import { runIniW3Certification } from "../w3";
import { runIniW4Certification } from "../w4";
import { runIniW5Certification } from "../w5";
import { runIniW6Certification } from "../w6";
import { runIniW7Certification } from "../w7";
import { allW3TestsPassed } from "../w3-tests";
import { allW4TestsPassed } from "../w4-tests";
import { allW5TestsPassed } from "../w5-tests";
import { allW6TestsPassed } from "../w6-tests";
import { allW7TestsPassed } from "../w7-tests";
import { getInitiativeConstitution } from "../constitution";
import type { ReadinessCheck } from "./contracts";

export type WaveCertificationSummary = {
  wave: string;
  name: string;
  all_passed: boolean;
  gate_pass_count: number;
  gate_total: number;
};

export function runCertificationSuite(): {
  waves: WaveCertificationSummary[];
  constitutional_checks: ReadinessCheck[];
  suite_passed: boolean;
} {
  const waveCerts = [
    { wave: "W1", cert: runIniW1Certification() },
    { wave: "W2", cert: runIniW2Certification() },
    { wave: "W3", cert: runIniW3Certification() },
    { wave: "W4", cert: runIniW4Certification() },
    { wave: "W5", cert: runIniW5Certification() },
    { wave: "W6", cert: runIniW6Certification() },
    { wave: "W7", cert: runIniW7Certification() },
  ];

  const waves: WaveCertificationSummary[] = waveCerts.map(({ wave, cert }) => ({
    wave,
    name: cert.name,
    all_passed: cert.all_passed,
    gate_pass_count: cert.gates.filter((g) => g.passed).length,
    gate_total: cert.gates.length,
  }));

  const constitution = getInitiativeConstitution();
  const constitutional_checks: ReadinessCheck[] = [
    {
      check_id: "const-governing-principle",
      category: "constitutional",
      title: "Governing principle defined",
      status: !!constitution.governing_principle ? "pass" : "fail",
      detail: constitution.governing_principle?.slice(0, 80) ?? "",
      blocking: true,
    },
    {
      check_id: "const-ai-prohibitions",
      category: "constitutional",
      title: "AI ownership prohibition",
      status: constitution.ai_may_not.some((s) => s.toLowerCase().includes("owner")) ? "pass" : "fail",
      detail: `${constitution.ai_may_not.length} prohibitions registered`,
      blocking: true,
    },
    {
      check_id: "test-lifecycle",
      category: "lifecycle_testing",
      title: "Lifecycle service tests",
      status: allW3TestsPassed() ? "pass" : "fail",
      detail: "W3 domain service test suite",
      blocking: true,
    },
    {
      check_id: "test-permissions",
      category: "permission_testing",
      title: "API context and command tests",
      status: allW5TestsPassed() ? "pass" : "fail",
      detail: "W5 API constitution tests",
      blocking: true,
    },
    {
      check_id: "test-ui-workflows",
      category: "lifecycle_testing",
      title: "Human workflow assembler tests",
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
      title: "Spanish core vocabulary",
      status: Object.keys(constitution.spanish_glossary).length >= 20 ? "pass" : "attention",
      detail: `${Object.keys(constitution.spanish_glossary).length} glossary terms`,
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
      title: "Responsive initiative UI",
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
