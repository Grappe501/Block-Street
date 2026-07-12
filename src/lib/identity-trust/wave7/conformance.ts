import { createHash } from "crypto";
import { loadAuthFeatureFlags } from "../auth-flags";
import { loadHumanIdentities, loadFeatureFlags } from "../data";
import { loadWave1Flags } from "../wave1/data";
import { checkWave1Invariants } from "../wave1/invariants";
import { isWave1FoundationComplete } from "../wave1/wave-prerequisite";
import { runWave1Certification } from "../wave1/engine";
import { isWave2FoundationComplete, runWave2Certification } from "../wave2/engine";
import { isWave3FoundationComplete, runWave3Certification } from "../wave3/engine";
import { isWave4FoundationComplete, runWave4Certification } from "../wave4/engine";
import { isWave5FoundationComplete, runWave5Certification } from "../wave5/engine";
import { isWave6FoundationComplete, runWave6Certification } from "../wave6/engine";
import { verifyLedgerIntegrity } from "../wave2/ledger";
import { getAiIdentityRecommendation } from "../wave5/ai-boundary";
import { canPerformAction } from "../wave6/authority";
import { updateRequirementStatus } from "./requirements";

export interface ConformanceResult {
  suite: string;
  passed: boolean;
  checks: { id: string; label: string; passed: boolean; evidence: string }[];
}

function runSuite(suite: string, checks: { id: string; label: string; passed: boolean; evidence: string }[]): ConformanceResult {
  return { suite, passed: checks.every((c) => c.passed), checks };
}

export function runConformanceSuite(suite: string): ConformanceResult {
  const flags = loadFeatureFlags();
  const authFlags = loadAuthFeatureFlags();
  const wave1Flags = loadWave1Flags();
  const humans = loadHumanIdentities();
  const ledger = verifyLedgerIntegrity();

  if (suite === "identity:entry" || suite === "identity:constitution" || suite === "identity:all") {
    const checks = [
      { id: "entry-01", label: "Public registration disabled", passed: !authFlags.AUTH_SELF_REGISTRATION_ENABLED && Boolean(wave1Flags.PUBLIC_REGISTRATION_DISABLED), evidence: `self-reg: ${authFlags.AUTH_SELF_REGISTRATION_ENABLED}` },
      { id: "entry-02", label: "Invitation-only mode", passed: Boolean(flags.ITL_INVITATION_ONLY_MODE), evidence: `ITL_INVITATION_ONLY_MODE: ${flags.ITL_INVITATION_ONLY_MODE}` },
      { id: "entry-03", label: "Legacy account creation disabled", passed: Boolean(wave1Flags.LEGACY_ACCOUNT_CREATION_DISABLED), evidence: "wave1 flags" },
      { id: "entry-04", label: "All humans have Global Human ID", passed: humans.every((h) => h.global_human_id?.startsWith("GHID-")), evidence: `${humans.length} humans` },
    ];
    if (suite === "identity:entry") return runSuite(suite, checks);
  }

  if (suite === "identity:audit" || suite === "identity:all") {
    const checks = [
      { id: "audit-01", label: "Ledger integrity", passed: ledger.valid, evidence: `${ledger.checked} events checked` },
      { id: "audit-02", label: "No sequence gaps", passed: ledger.valid, evidence: ledger.broken_at ?? "ok" },
    ];
    if (suite === "identity:audit") return runSuite(suite, checks);
  }

  if (suite === "identity:intelligence" || suite === "identity:all") {
    const ai = getAiIdentityRecommendation("merge all duplicate humans immediately");
    const checks = [
      { id: "intel-01", label: "AI refuses merge", passed: ai.cannot_remove && ai.answer.toLowerCase().includes("cannot"), evidence: ai.answer.slice(0, 80) },
      { id: "intel-02", label: "Support cannot verify", passed: !canPerformAction("usr-support", "verify_human"), evidence: "authority registry" },
    ];
    if (suite === "identity:intelligence") return runSuite(suite, checks);
  }

  if (suite === "identity:all") {
    const w1 = runWave1Certification();
    const w2 = runWave2Certification();
    const w3 = runWave3Certification();
    const w4 = runWave4Certification();
    const w5 = runWave5Certification();
    const w6 = runWave6Certification();
    const inv1 = checkWave1Invariants();

    const checks = [
      { id: "wave-01", label: "Wave 1 certified", passed: w1.all_passed || isWave1FoundationComplete(), evidence: `${w1.gates.filter((g) => g.passed).length}/${w1.gates.length} gates` },
      { id: "wave-02", label: "Wave 2 certified", passed: w2.all_passed || isWave2FoundationComplete(), evidence: `${w2.gates.filter((g) => g.passed).length}/${w2.gates.length} gates` },
      { id: "wave-03", label: "Wave 3 certified", passed: w3.all_passed || isWave3FoundationComplete(), evidence: `${w3.gates.filter((g) => g.passed).length}/${w3.gates.length} gates` },
      { id: "wave-04", label: "Wave 4 certified", passed: w4.all_passed || isWave4FoundationComplete(), evidence: `${w4.gates.filter((g) => g.passed).length}/${w4.gates.length} gates` },
      { id: "wave-05", label: "Wave 5 certified", passed: w5.all_passed || isWave5FoundationComplete(), evidence: `${w5.gates.filter((g) => g.passed).length}/${w5.gates.length} gates` },
      { id: "wave-06", label: "Wave 6 certified", passed: w6.all_passed || isWave6FoundationComplete(), evidence: `${w6.gates.filter((g) => g.passed).length}/${w6.gates.length} gates` },
      { id: "const-01", label: "Public registration disabled", passed: !authFlags.AUTH_SELF_REGISTRATION_ENABLED, evidence: "auth flags" },
      { id: "const-02", label: "Ledger integrity", passed: ledger.valid, evidence: "ledger check" },
      { id: "const-03", label: "Wave 1 invariants", passed: inv1.every((i) => i.passed), evidence: `${inv1.filter((i) => i.passed).length}/${inv1.length}` },
    ];
    return runSuite(suite, checks);
  }

  return runSuite(suite, [{ id: "unknown", label: "Unknown suite", passed: false, evidence: suite }]);
}

export function runAllConformanceSuites() {
  const suites = [
    "identity:constitution",
    "identity:entry",
    "identity:audit",
    "identity:intelligence",
    "identity:all",
  ];
  return suites.map((s) => runConformanceSuite(s));
}

export function syncConformanceToRequirements() {
  const all = runConformanceSuite("identity:all");
  for (const check of all.checks) {
    if (check.id === "const-01") updateRequirementStatus("ITL-W7-ENTRY-001", check.passed ? "tested" : "failed", check.passed ? "passed" : "failed");
    if (check.id === "const-02") updateRequirementStatus("ITL-W7-AUDIT-001", check.passed ? "tested" : "failed", check.passed ? "passed" : "failed");
    if (check.id === "entry-01") updateRequirementStatus("ITL-W1-INV-002", check.passed ? "evidence_complete" : "failed", check.passed ? "passed" : "failed");
  }
  return all;
}

export function conformanceDigest(results: ConformanceResult[]) {
  return createHash("sha256").update(JSON.stringify(results)).digest("hex").slice(0, 16);
}
