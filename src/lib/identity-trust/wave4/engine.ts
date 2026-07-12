import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { isWave3FoundationComplete } from "../wave3/engine";
import { checkWave4Invariants, WAVE4_INVARIANTS } from "./invariants";
import {
  loadWave4Flags,
  loadFederationMembershipsV4,
  loadCrossInstitutionInvitations,
  loadPortableAssurances,
  loadActiveContexts,
} from "./data";
import type { Wave4Certification, Wave4CertificationGate } from "./types";
import { nowIso } from "../utils";
import { migrateLegacyMemberships } from "./memberships";

const CERT_PATH = join(process.cwd(), "data", "identity-trust", "wave4_certification.json");

function gate(id: string, name: string, passed: boolean, detail: string): Wave4CertificationGate {
  return { id, name, passed, detail };
}

export function loadWave4Certification(): Wave4Certification | null {
  try {
    return JSON.parse(readFileSync(CERT_PATH, "utf8")) as Wave4Certification;
  } catch {
    return null;
  }
}

export function persistWave4Certification(cert: Wave4Certification) {
  writeFileSync(CERT_PATH, JSON.stringify(cert, null, 2));
}

export function runWave4Certification(): Wave4Certification {
  const flags = loadWave4Flags();
  migrateLegacyMemberships();

  const gates: Wave4CertificationGate[] = [
    gate("w4-g1", "One Human integrity", Boolean(flags.GLOBAL_HUMAN_MULTI_INSTITUTION_ENABLED), `${loadFederationMembershipsV4().length} memberships`),
    gate("w4-g2", "Invitation requirement", Boolean(flags.CROSS_INSTITUTION_INVITATIONS_ENABLED), `${loadCrossInstitutionInvitations().length} cross-institution invitations`),
    gate("w4-g3", "Assurance portability", Boolean(flags.PORTABLE_IDENTITY_ASSURANCE_ENABLED), `${loadPortableAssurances().length} portable assurances`),
    gate("w4-g4", "Trust isolation", Boolean(flags.INSTITUTION_TRUST_ISOLATION_REQUIRED), "Institution trust isolated"),
    gate("w4-g5", "Context integrity", Boolean(flags.INSTITUTION_CONTEXT_RESOLVER_ENABLED), `${loadActiveContexts().length} active contexts`),
    gate("w4-g6", "Data firewall", Boolean(flags.CROSS_INSTITUTION_DATA_FIREWALL_ENABLED), "Data boundaries enforced"),
    gate("w4-g7", "Membership independence", Boolean(flags.MEMBERSHIP_TRANSFER_ENABLED), "Transfers do not carry roles"),
    gate("w4-g8", "Agreement governance", Boolean(flags.IDENTITY_AGREEMENTS_ENABLED), "Agreements required for expanded sharing"),
    gate("w4-g9", "Directory privacy", Boolean(flags.FEDERATION_DIRECTORY_ENABLED), "Directory discoverability governed"),
    gate("w4-g10", "AI linking prohibited", Boolean(flags.AI_CROSS_INSTITUTION_LINKING_PROHIBITED), "AI cannot link memberships"),
  ];

  for (const inv of checkWave4Invariants()) {
    gates.push(gate(`w4-inv-${inv.id}`, inv.id, inv.passed, inv.detail));
  }

  const allPassed = gates.every((g) => g.passed) && isWave3FoundationComplete();
  const cert: Wave4Certification = {
    wave_id: "ITL-W4-001",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    gates,
  };
  if (allPassed) persistWave4Certification(cert);
  return cert;
}

export function getWave4Overview() {
  return {
    wave_id: "ITL-W4-001",
    status: loadWave4Flags().WAVE4_IMPLEMENTATION_STATUS,
    memberships: loadFederationMembershipsV4().length,
    invitations: loadCrossInstitutionInvitations().length,
    assurances: loadPortableAssurances().length,
    active_contexts: loadActiveContexts().length,
    invariants: checkWave4Invariants(),
    invariant_docs: WAVE4_INVARIANTS,
    flags: loadWave4Flags(),
  };
}

export function isWave4FoundationComplete(): boolean {
  const stored = loadWave4Certification();
  if (stored?.all_passed) return true;
  const live = runWave4Certification();
  return live.all_passed;
}

export function assertWave4Foundation(operation: string) {
  if (!isWave3FoundationComplete()) {
    throw new Error(`ITL-W4-001 blocked. ${operation} requires Wave 3 certification.`);
  }
  if (!isWave4FoundationComplete()) {
    throw new Error(`ITL-W4-001 foundation incomplete. ${operation} requires Wave 4 certification.`);
  }
}

export function getWave4DependencyStatus() {
  const w3 = isWave3FoundationComplete();
  const cert = loadWave4Certification() ?? runWave4Certification();
  return {
    wave3: { complete: w3 },
    wave4: { id: "ITL-W4-001", complete: cert.all_passed, certified_at: cert.certified_at },
    wave5_blocked: !cert.all_passed,
    message: cert.all_passed
      ? "Wave 4 certified. Federation identity operational."
      : w3
        ? "Wave 4 implementation in progress."
        : "Wave 4 blocked until Wave 3 foundation is certified.",
  };
}
