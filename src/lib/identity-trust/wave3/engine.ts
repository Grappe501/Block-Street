import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { isWave2FoundationComplete } from "../wave2/engine";
import { checkWave3Invariants, WAVE3_INVARIANTS } from "./invariants";
import { loadWave3Flags, loadIdentityCases, loadIdentityAppealRecords } from "./data";
import type { Wave3Certification, Wave3CertificationGate } from "./types";
import { nowIso } from "../utils";

const CERT_PATH = join(process.cwd(), "data", "identity-trust", "wave3_certification.json");

function gate(id: string, name: string, passed: boolean, detail: string): Wave3CertificationGate {
  return { id, name, passed, detail };
}

export function loadWave3Certification(): Wave3Certification | null {
  try {
    return JSON.parse(readFileSync(CERT_PATH, "utf8")) as Wave3Certification;
  } catch {
    return null;
  }
}

export function persistWave3Certification(cert: Wave3Certification) {
  writeFileSync(CERT_PATH, JSON.stringify(cert, null, 2));
}

export function runWave3Certification(): Wave3Certification {
  const flags = loadWave3Flags();
  const cases = loadIdentityCases();

  const gates: Wave3CertificationGate[] = [
    gate("w3-g1", "Case integrity", Boolean(flags.IDENTITY_CASE_MANAGEMENT_ENABLED), `${cases.length} governed cases`),
    gate("w3-g2", "Reviewer independence", Boolean(flags.IDENTITY_CONFLICT_RECUSAL_REQUIRED), "Conflict recusal required"),
    gate("w3-g3", "Notice and response", Boolean(flags.IDENTITY_NOTICE_AND_RESPONSE_REQUIRED), "Notice path enabled"),
    gate("w3-g4", "Containment", Boolean(flags.IDENTITY_TEMPORARY_CONTAINMENT_ENABLED), "Temporary containment enabled"),
    gate("w3-g5", "Decision quality", Boolean(flags.AI_IDENTITY_DECISION_PROHIBITED), "Human-only decisions"),
    gate("w3-g6", "Duplicate resolution", Boolean(flags.IDENTITY_DUPLICATE_MERGE_GOVERNANCE_ENABLED), "Two-reviewer merge"),
    gate("w3-g7", "Alias governance", Boolean(flags.IDENTITY_ALIAS_GOVERNANCE_ENABLED), "Alias review enabled"),
    gate("w3-g8", "Removal and restoration", Boolean(flags.IDENTITY_RESTORATION_ENABLED), "Restoration enabled"),
    gate("w3-g9", "Appeals", Boolean(flags.IDENTITY_APPEALS_ENABLED), `${loadIdentityAppealRecords().length} appeals`),
    gate("w3-g10", "Privacy and security", Boolean(flags.IDENTITY_CASE_AUDIT_REQUIRED), "Case audit required"),
  ];

  for (const inv of checkWave3Invariants()) {
    gates.push(gate(`w3-inv-${inv.id}`, inv.id, inv.passed, inv.detail));
  }

  const allPassed = gates.every((g) => g.passed) && isWave2FoundationComplete();
  const cert: Wave3Certification = {
    wave_id: "ITL-W3-001",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    gates,
  };
  if (allPassed) persistWave3Certification(cert);
  return cert;
}

export function getWave3Overview() {
  return {
    wave_id: "ITL-W3-001",
    status: loadWave3Flags().WAVE3_IMPLEMENTATION_STATUS,
    cases: loadIdentityCases().length,
    appeals: loadIdentityAppealRecords().length,
    invariants: checkWave3Invariants(),
    invariant_docs: WAVE3_INVARIANTS,
    flags: loadWave3Flags(),
  };
}

export function isWave3FoundationComplete(): boolean {
  const stored = loadWave3Certification();
  if (stored?.all_passed) return true;
  const live = runWave3Certification();
  return live.all_passed;
}

export function assertWave3Foundation(operation: string) {
  if (!isWave3FoundationComplete()) {
    throw new Error(
      `ITL-W3-001 foundation incomplete. ${operation} requires Wave 3 certification (identity governance and appeals).`
    );
  }
}

export function getWave3DependencyStatus() {
  const w2 = isWave2FoundationComplete();
  const cert = loadWave3Certification() ?? runWave3Certification();
  return {
    wave2: { complete: w2 },
    wave3: { id: "ITL-W3-001", complete: cert.all_passed, certified_at: cert.certified_at },
    wave4_blocked: !cert.all_passed,
    wave5_blocked: !cert.all_passed,
    message: cert.all_passed
      ? "Wave 3 certified. Identity governance operational."
      : w2
        ? "Wave 3 implementation in progress."
        : "Wave 3 blocked until Wave 2 foundation is certified.",
  };
}
