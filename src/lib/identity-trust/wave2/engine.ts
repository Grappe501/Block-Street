import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { loadHumanIdentities } from "../data";
import { isWave1FoundationComplete } from "../wave1/wave-prerequisite";
import { checkWave2Invariants, WAVE2_INVARIANTS } from "./invariants";
import { loadWave2Flags, loadVerificationStatements, loadIdentityLedgerEvents } from "./data";
import { verifyLedgerIntegrity } from "./ledger";
import { evaluateAssuranceAndTrust, startProvisionalPeriod } from "./trust-lifecycle";
import { completeVerifierEducation } from "./verifier";
import type { Wave2Certification, Wave2CertificationGate } from "./types";
import { nowIso, itlId } from "../utils";

const CERT_PATH = join(process.cwd(), "data", "identity-trust", "wave2_certification.json");

function gate(id: string, name: string, passed: boolean, detail: string): Wave2CertificationGate {
  return { id, name, passed, detail };
}

export function loadWave2Certification(): Wave2Certification | null {
  try {
    return JSON.parse(readFileSync(CERT_PATH, "utf8")) as Wave2Certification;
  } catch {
    return null;
  }
}

export function persistWave2Certification(cert: Wave2Certification) {
  writeFileSync(CERT_PATH, JSON.stringify(cert, null, 2));
}

export function runWave2Certification(): Wave2Certification {
  const flags = loadWave2Flags();
  const statements = loadVerificationStatements();
  const selfVerify = statements.some((s) => s.subject_human_id === s.verifier_human_id && s.status === "active");
  const ledgerCheck = verifyLedgerIntegrity();

  const gates: Wave2CertificationGate[] = [
    gate("w2-g1", "Verification integrity", Boolean(flags.IDENTITY_VERIFICATION_ENGINE_ENABLED) && !selfVerify, "No self-verification"),
    gate("w2-g2", "Independent confirmation", Boolean(flags.INDEPENDENT_SECOND_VERIFICATION_REQUIRED), "Two-person standard enforced"),
    gate("w2-g3", "Provisional controls", Boolean(flags.PROVISIONAL_IDENTITY_PERIOD_ENABLED), "Provisional period enabled"),
    gate("w2-g4", "Trust-state integrity", Boolean(flags.TRUST_LIFECYCLE_ENABLED), "Named trust states, no hidden score"),
    gate("w2-g5", "Restriction and recovery", Boolean(flags.PROVISIONAL_EXPIRATION_RESTRICTION_ENABLED), "Restriction path enabled"),
    gate("w2-g6", "Privacy", Boolean(flags.IDENTITY_VERIFICATION_ENGINE_ENABLED), "Private verification evidence"),
    gate("w2-g7", "Ledger integrity", ledgerCheck.valid && Boolean(flags.IDENTITY_LEDGER_ENABLED), `${ledgerCheck.checked} events checked`),
  ];

  for (const inv of checkWave2Invariants()) {
    gates.push(gate(`w2-inv-${inv.id}`, inv.id, inv.passed, inv.detail));
  }

  const allPassed = gates.every((g) => g.passed) && isWave1FoundationComplete();
  const cert: Wave2Certification = {
    wave_id: "ITL-W2-001",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    gates,
  };
  if (allPassed) persistWave2Certification(cert);
  return cert;
}

export function migrateWave1HumansToWave2(actorId: string) {
  if (!isWave1FoundationComplete()) {
    throw new Error("Wave 1 foundation must be certified before Wave 2 migration.");
  }

  const migrated: { human_id: string; assurance: string }[] = [];
  for (const human of loadHumanIdentities()) {
    const institutionId = human.institution_id ?? "inst-block-street";
    startProvisionalPeriod(human.user_id, institutionId);

    if (human.institution_leader || human.trust_level >= 2) {
      completeVerifierEducation(human.user_id);
    }

    const result = evaluateAssuranceAndTrust(human.user_id, institutionId, itlId("migrate"));
    migrated.push({ human_id: human.user_id, assurance: result?.assurance ?? "sponsored" });
  }

  return { migrated, actor_id: actorId };
}

export function getWave2Overview() {
  return {
    wave_id: "ITL-W2-001",
    status: loadWave2Flags().WAVE2_IMPLEMENTATION_STATUS,
    invariants: checkWave2Invariants(),
    invariant_docs: WAVE2_INVARIANTS,
    ledger_events: loadIdentityLedgerEvents().length,
    verification_statements: loadVerificationStatements().length,
    flags: loadWave2Flags(),
  };
}

export function isWave2FoundationComplete(): boolean {
  const stored = loadWave2Certification();
  if (stored?.all_passed) return true;
  const live = runWave2Certification();
  return live.all_passed;
}

export function assertWave2Foundation(operation: string) {
  if (!isWave2FoundationComplete()) {
    throw new Error(
      `ITL-W2-001 foundation incomplete. ${operation} requires Wave 2 certification (verification, trust lifecycle, identity ledger).`
    );
  }
}

export function getWave2DependencyStatus() {
  const w1 = isWave1FoundationComplete();
  const cert = loadWave2Certification() ?? runWave2Certification();
  return {
    wave1: { complete: w1 },
    wave2: { id: "ITL-W2-001", complete: cert.all_passed, certified_at: cert.certified_at },
    wave3_blocked: !cert.all_passed,
    wave4_blocked: !cert.all_passed,
    wave5_blocked: !cert.all_passed,
    message: cert.all_passed
      ? "Wave 2 certified. Identity verification and trust lifecycle operational."
      : w1
        ? "Wave 2 implementation in progress. Complete certification before Wave 3+."
        : "Wave 2 blocked until Wave 1 foundation is certified.",
  };
}
