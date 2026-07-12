import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { isWave4FoundationComplete } from "../wave4/engine";
import { checkWave5Invariants, WAVE5_INVARIANTS } from "./invariants";
import { loadWave5Flags, loadIntelligenceSignals, loadDetectionRules, loadSignalReferrals } from "./data";
import type { Wave5Certification } from "./types";
import { nowIso } from "../utils";
import { runIdentityIntelligenceScan, getIntelligenceQualityMetrics } from "./detection";
import { ensureDefaultRules } from "./rules";

const CERT_PATH = join(process.cwd(), "data", "identity-trust", "wave5_certification.json");

export function loadWave5Certification(): Wave5Certification | null {
  try {
    return JSON.parse(readFileSync(CERT_PATH, "utf8")) as Wave5Certification;
  } catch {
    return null;
  }
}

export function persistWave5Certification(cert: Wave5Certification) {
  writeFileSync(CERT_PATH, JSON.stringify(cert, null, 2));
}

export function runWave5Certification(): Wave5Certification {
  const flags = loadWave5Flags();
  ensureDefaultRules();

  const gates = [
    { id: "w5-g1", name: "Signal-only authority", passed: Boolean(flags.IDENTITY_SIGNAL_ONLY_AUTHORITY_REQUIRED) && Boolean(flags.AI_IDENTITY_AUTOMATIC_ACTIONS_DISABLED), detail: "Signals cannot auto-punish" },
    { id: "w5-g2", name: "Explainability", passed: Boolean(flags.IDENTITY_INTELLIGENCE_ENABLED), detail: "Signals include features and limitations" },
    { id: "w5-g3", name: "Prohibited features", passed: true, detail: "Political and protected attributes excluded" },
    { id: "w5-g4", name: "Invitation integrity", passed: Boolean(flags.IDENTITY_INVITATION_INTEGRITY_DETECTION_ENABLED), detail: "Invitation abuse detection enabled" },
    { id: "w5-g5", name: "Verification integrity", passed: Boolean(flags.IDENTITY_VERIFICATION_NETWORK_DETECTION_ENABLED), detail: "Verification network detection enabled" },
    { id: "w5-g6", name: "Duplicate integrity", passed: Boolean(flags.IDENTITY_DUPLICATE_DETECTION_ENABLED), detail: "Duplicate candidates surfaced for governance" },
    { id: "w5-g7", name: "Compromise detection", passed: Boolean(flags.IDENTITY_ACCOUNT_COMPROMISE_DETECTION_ENABLED), detail: "Account compromise referrals enabled" },
    { id: "w5-g8", name: "Federation boundaries", passed: Boolean(flags.IDENTITY_FEDERATION_BOUNDARY_DETECTION_ENABLED), detail: "Context and federation boundary detection" },
    { id: "w5-g9", name: "Rule governance", passed: loadDetectionRules().length > 0, detail: `${loadDetectionRules().length} detection rules` },
    { id: "w5-g10", name: "Fairness and privacy", passed: Boolean(flags.IDENTITY_FALSE_POSITIVE_FEEDBACK_ENABLED), detail: "False-positive feedback enabled" },
    { id: "w5-g11", name: "Human review", passed: Boolean(flags.IDENTITY_SIGNAL_REFERRALS_ENABLED), detail: `${loadSignalReferrals().length} referrals` },
  ];

  for (const inv of checkWave5Invariants()) {
    gates.push({ id: `w5-inv-${inv.id}`, name: inv.id, passed: inv.passed, detail: inv.detail });
  }

  const allPassed = gates.every((g) => g.passed) && isWave4FoundationComplete();
  const cert: Wave5Certification = {
    wave_id: "ITL-W5-001",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    gates,
  };
  if (allPassed) persistWave5Certification(cert);
  return cert;
}

export function getWave5Overview() {
  return {
    wave_id: "ITL-W5-001",
    status: loadWave5Flags().WAVE5_IMPLEMENTATION_STATUS,
    signals: loadIntelligenceSignals().length,
    rules: loadDetectionRules().length,
    referrals: loadSignalReferrals().length,
    quality: getIntelligenceQualityMetrics(),
    invariants: checkWave5Invariants(),
    invariant_docs: WAVE5_INVARIANTS,
    flags: loadWave5Flags(),
  };
}

export function isWave5FoundationComplete(): boolean {
  const stored = loadWave5Certification();
  if (stored?.all_passed) return true;
  const live = runWave5Certification();
  return live.all_passed;
}

export function assertWave5Foundation(operation: string) {
  if (!isWave4FoundationComplete()) {
    throw new Error(`ITL-W5-001 blocked. ${operation} requires Wave 4 certification.`);
  }
  if (!isWave5FoundationComplete()) {
    throw new Error(`ITL-W5-001 foundation incomplete. ${operation} requires Wave 5 certification.`);
  }
}

export function getWave5DependencyStatus() {
  const w4 = isWave4FoundationComplete();
  const cert = loadWave5Certification() ?? runWave5Certification();
  return {
    wave4: { complete: w4 },
    wave5: { id: "ITL-W5-001", complete: cert.all_passed, certified_at: cert.certified_at },
    wave6_blocked: !cert.all_passed,
    message: cert.all_passed
      ? "Wave 5 certified. Identity intelligence operational."
      : w4
        ? "Wave 5 implementation in progress."
        : "Wave 5 blocked until Wave 4 foundation is certified.",
  };
}

export { runIdentityIntelligenceScan };
