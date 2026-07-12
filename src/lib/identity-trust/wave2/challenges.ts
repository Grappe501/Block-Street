import { assertWave1Foundation } from "../wave1/wave-prerequisite";
import { appendLedgerEvent } from "./ledger";
import { loadIdentityChallenges, loadWave2Flags, persistIdentityChallenges } from "./data";
import { evaluateAssuranceAndTrust } from "./trust-lifecycle";
import type { IdentityChallenge, IdentityChallengeType } from "./types";
import { itlId, nowIso } from "../utils";

export function createIdentityChallenge(input: {
  subject_human_id: string;
  reported_by_human_id: string;
  institution_id?: string;
  challenge_type: IdentityChallengeType;
  description: string;
  evidence_reference?: string;
  severity?: IdentityChallenge["severity"];
}): IdentityChallenge {
  assertWave1Foundation("Identity Challenge (Wave 2)");
  const flags = loadWave2Flags();
  if (!flags.IDENTITY_CHALLENGE_ENABLED) throw new Error("Identity challenges are not enabled.");

  if (input.subject_human_id === input.reported_by_human_id) {
    throw new Error("A Human cannot challenge their own identity through this path.");
  }

  const challenge: IdentityChallenge = {
    id: itlId("ichal"),
    subject_human_id: input.subject_human_id,
    reported_by_human_id: input.reported_by_human_id,
    institution_id: input.institution_id ?? null,
    challenge_type: input.challenge_type,
    description: input.description,
    evidence_reference: input.evidence_reference ?? null,
    severity: input.severity ?? "moderate",
    status: "open",
    created_at: nowIso(),
    assigned_to: null,
    resolved_at: null,
    resolution: null,
  };

  const challenges = loadIdentityChallenges();
  challenges.push(challenge);
  persistIdentityChallenges(challenges);

  try {
    const { openIdentityCase } = require("../wave3/cases") as typeof import("../wave3/cases");
    openIdentityCase({
      case_type: mapChallengeToCaseType(input.challenge_type),
      subject_human_id: input.subject_human_id,
      institution_id: input.institution_id,
      reporting_human_id: input.reported_by_human_id,
      originating_event_id: challenge.id,
      scope: input.challenge_type === "duplicate_human" ? "global_human_record" : "institution_membership",
      summary: input.description,
      severity: input.severity === "critical" ? "IG-4" : input.severity === "high" ? "IG-3" : "IG-2",
    });
  } catch {
    // Wave 3 may be unavailable until Wave 2 certified
  }

  appendLedgerEvent({
    human_id: input.subject_human_id,
    institution_id: input.institution_id ?? null,
    event_type: "identity.challenge_opened",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: input.reported_by_human_id,
    service_identity_id: null,
    source_system: "ITL-TRU-001",
    source_record_type: "identity_challenge",
    source_record_id: challenge.id,
    previous_state: null,
    new_state: "open",
    reason_code: input.challenge_type,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  if (challenge.severity === "high" || challenge.severity === "critical") {
    evaluateAssuranceAndTrust(input.subject_human_id, input.institution_id ?? "inst-block-street", challenge.id);
  }

  return challenge;
}

export function containChallenge(challengeId: string, actorId: string, action: string) {
  const challenges = loadIdentityChallenges();
  const idx = challenges.findIndex((c) => c.id === challengeId);
  if (idx < 0) throw new Error("Challenge not found.");

  challenges[idx] = { ...challenges[idx], status: "contained", assigned_to: actorId };
  persistIdentityChallenges(challenges);

  evaluateAssuranceAndTrust(
    challenges[idx].subject_human_id,
    challenges[idx].institution_id ?? "inst-block-street",
    challengeId
  );

  return challenges[idx];
}

export function resolveChallenge(challengeId: string, actorId: string, resolution: string) {
  const challenges = loadIdentityChallenges();
  const idx = challenges.findIndex((c) => c.id === challengeId);
  if (idx < 0) throw new Error("Challenge not found.");

  challenges[idx] = {
    ...challenges[idx],
    status: "resolved",
    resolved_at: nowIso(),
    resolution,
    assigned_to: actorId,
  };
  persistIdentityChallenges(challenges);

  appendLedgerEvent({
    human_id: challenges[idx].subject_human_id,
    institution_id: challenges[idx].institution_id,
    event_type: "identity.challenge_resolved",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: actorId,
    service_identity_id: null,
    source_system: "ITL-TRU-001",
    source_record_type: "identity_challenge",
    source_record_id: challengeId,
    previous_state: "contained",
    new_state: "resolved",
    reason_code: resolution,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  evaluateAssuranceAndTrust(
    challenges[idx].subject_human_id,
    challenges[idx].institution_id ?? "inst-block-street",
    challengeId
  );

  return challenges[idx];
}

export function listChallengesForHuman(humanId: string) {
  return loadIdentityChallenges().filter((c) => c.subject_human_id === humanId || c.reported_by_human_id === humanId);
}

function mapChallengeToCaseType(
  t: IdentityChallengeType
): import("../wave3/types").IdentityCaseType {
  const map: Partial<Record<IdentityChallengeType, import("../wave3/types").IdentityCaseType>> = {
    duplicate_human: "duplicate_human",
    impersonation: "impersonation",
    alias_conflict: "alias_dispute",
    false_public_name: "false_public_identity",
    verification_conflict: "verification_conflict",
    compromised_account: "compromised_account",
    mistaken_identity: "other_identity_matter",
    authentication_conflict: "authentication_conflict",
    recipient_mismatch: "mistaken_invitation",
    other: "other_identity_matter",
  };
  return map[t] ?? "other_identity_matter";
}
