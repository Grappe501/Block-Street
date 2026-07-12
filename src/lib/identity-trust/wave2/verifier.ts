import { loadHumanIdentities } from "../data";
import { loadWave2Flags, loadWave2Policy, loadVerifierQualifications, persistVerifierQualifications } from "./data";
import type { VerifierQualification } from "./types";
import { itlId, nowIso } from "../utils";

export function getVerifierQualification(humanId: string): VerifierQualification | null {
  return loadVerifierQualifications().find((q) => q.human_id === humanId && q.status === "eligible") ?? null;
}

export function isVerifierEligible(humanId: string): { eligible: boolean; reason?: string } {
  const flags = loadWave2Flags();
  if (!flags.IDENTITY_VERIFICATION_ENGINE_ENABLED) {
    return { eligible: false, reason: "Verification engine is not enabled." };
  }

  const human = loadHumanIdentities().find((h) => h.user_id === humanId);
  if (!human) return { eligible: false, reason: "Human record not found." };
  if (human.identity_status === "restricted") {
    return { eligible: false, reason: "Identity is restricted." };
  }

  const qual = getVerifierQualification(humanId);
  if (flags.VERIFIER_EDUCATION_REQUIRED && !qual) {
    return { eligible: false, reason: "Verifier education must be completed first." };
  }

  const trustOk = human.trust_level >= 2 || human.institution_leader;
  if (!trustOk) {
    return { eligible: false, reason: "Verifier must have Verified status or institution authorization." };
  }

  return { eligible: true };
}

export function completeVerifierEducation(humanId: string): VerifierQualification {
  const flags = loadWave2Flags();
  if (!flags.VERIFIER_EDUCATION_REQUIRED) {
    throw new Error("Verifier education is not required.");
  }

  const policy = loadWave2Policy();
  const existing = loadVerifierQualifications().find((q) => q.human_id === humanId);
  if (existing?.status === "eligible") return existing;

  const qual: VerifierQualification = {
    id: itlId("vqual"),
    human_id: humanId,
    qualification_type: "standard_verifier",
    education_version: policy.verifier_education_version,
    qualified_at: nowIso(),
    expires_at: null,
    status: "eligible",
    restricted_at: null,
    restriction_reason: null,
  };

  const all = loadVerifierQualifications().filter((q) => q.human_id !== humanId);
  all.push(qual);
  persistVerifierQualifications(all);
  return qual;
}

export function checkIndependence(
  subjectId: string,
  verifierId: string,
  sponsorId: string | null
): { independent: boolean; is_sponsor: boolean } {
  const isSponsor = Boolean(sponsorId && verifierId === sponsorId);
  return { independent: !isSponsor, is_sponsor: isSponsor };
}
