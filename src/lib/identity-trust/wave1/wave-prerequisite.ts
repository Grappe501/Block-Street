import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Wave1Certification } from "./types";
import { runWave1Certification } from "./engine";

const CERT_PATH = join(process.cwd(), "data", "identity-trust", "wave1_certification.json");

export function loadWave1Certification(): Wave1Certification | null {
  try {
    return JSON.parse(readFileSync(CERT_PATH, "utf8")) as Wave1Certification;
  } catch {
    return null;
  }
}

export function persistWave1Certification(cert: Wave1Certification) {
  writeFileSync(CERT_PATH, JSON.stringify(cert, null, 2));
}

/** Wave 1 must be complete before verification, federation identity, or identity intelligence may depend on it. */
export function isWave1FoundationComplete(): boolean {
  const stored = loadWave1Certification();
  if (stored?.all_passed) return true;
  const live = runWave1Certification();
  if (live.all_passed) {
    persistWave1Certification(live);
    return true;
  }
  return false;
}

export function assertWave1Foundation(operation: string) {
  if (!isWave1FoundationComplete()) {
    throw new Error(
      `ITL-W1-001 foundation incomplete. ${operation} requires Wave 1 certification (immutable human record and lawful entrance).`
    );
  }
}

export function getWaveDependencyStatus() {
  const cert = loadWave1Certification() ?? runWave1Certification();
  return {
    wave1: { id: "ITL-W1-001", complete: cert.all_passed, certified_at: cert.certified_at },
    wave2_blocked: !cert.all_passed,
    wave3_blocked: !cert.all_passed,
    wave4_blocked: !cert.all_passed,
    wave5_blocked: !cert.all_passed,
    message: cert.all_passed
      ? "Wave 1 foundation certified. Later waves may depend on immutable human record and invitation lineage."
      : "Wave 2+ blocked until Wave 1 certification passes all gates.",
  };
}
