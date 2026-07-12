import { loadHumanIdentities, persistHumanIdentities } from "../data";
import { loadWave1Memberships, persistWave1Memberships } from "../wave1/data";
import { appendLedgerEvent } from "./ledger";
import {
  loadHumanTrustStates,
  loadIdentityAssuranceStates,
  loadIdentityChallenges,
  loadProvisionalPeriods,
  loadVerificationStatements,
  loadWave2Flags,
  loadWave2Policy,
  persistHumanTrustStates,
  persistIdentityAssuranceStates,
  persistProvisionalPeriods,
} from "./data";
import { computeCapabilities } from "./capabilities";
import type {
  HumanTrustStateRecord,
  IdentityAssuranceRecord,
  IdentityAssuranceState,
  InstitutionTrustState,
  ProvisionalIdentityPeriod,
  VerificationStatusView,
} from "./types";
import { itlId, nowIso } from "../utils";

function countQualifyingConfirmations(subjectId: string, sponsorId: string | null) {
  const active = loadVerificationStatements().filter(
    (s) => s.subject_human_id === subjectId && s.status === "active" && s.confidence !== "unable_to_confirm"
  );
  const verifiers = new Set(active.map((s) => s.verifier_human_id));
  const hasSponsor = Boolean(sponsorId);
  const independent = active.filter((s) => s.independent).length;
  return {
    total: verifiers.size + (hasSponsor ? 1 : 0),
    independent,
    statements: active.length,
    has_sponsor_confirmation: hasSponsor,
  };
}

export function startProvisionalPeriod(humanId: string, institutionId: string): ProvisionalIdentityPeriod {
  const policy = loadWave2Policy();
  const expires = new Date(Date.now() + policy.default_provisional_days * 86400000).toISOString();
  const period: ProvisionalIdentityPeriod = {
    id: itlId("prov"),
    human_id: humanId,
    institution_id: institutionId,
    started_at: nowIso(),
    expires_at: expires,
    extended_until: null,
    extension_reason: null,
    status: "active",
  };

  const periods = loadProvisionalPeriods().filter((p) => !(p.human_id === humanId && p.status === "active"));
  periods.push(period);
  persistProvisionalPeriods(periods);

  appendLedgerEvent({
    human_id: humanId,
    institution_id: institutionId,
    event_type: "trust.provisional_started",
    occurred_at: nowIso(),
    actor_type: "system",
    actor_human_id: null,
    service_identity_id: null,
    source_system: "ITL-TRU-001",
    source_record_type: "provisional_period",
    source_record_id: period.id,
    previous_state: null,
    new_state: "active",
    reason_code: "invitation_accepted",
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  return period;
}

export function evaluateAssuranceAndTrust(humanId: string, institutionId: string, sourceEventId?: string) {
  const flags = loadWave2Flags();
  if (!flags.TRUST_LIFECYCLE_ENABLED) return null;

  const human = loadHumanIdentities().find((h) => h.user_id === humanId);
  if (!human) return null;

  const policy = loadWave2Policy();
  const counts = countQualifyingConfirmations(humanId, human.primary_sponsor_id);
  const openChallenge = loadIdentityChallenges().find(
    (c) => c.subject_human_id === humanId && ["open", "under_review", "contained"].includes(c.status)
  );

  let assurance: IdentityAssuranceState = "sponsored";
  if (openChallenge) {
    assurance = human.identity_status === "restricted" ? "restricted" : "identity_review";
  } else if (counts.total >= policy.required_total_confirmations && counts.independent >= policy.required_independent_confirmations) {
    assurance = human.institution_leader ? "strongly_verified" : "verified";
  } else if (counts.statements > 0 || loadVerificationStatements().some((s) => s.subject_human_id === humanId)) {
    assurance = "verification_pending";
  } else if (human.primary_sponsor_id) {
    assurance = "sponsored";
  } else {
    assurance = "unconfirmed";
  }

  const provisional = loadProvisionalPeriods().find((p) => p.human_id === humanId && p.status === "active");
  if (
    provisional &&
    new Date(provisional.extended_until ?? provisional.expires_at).getTime() < Date.now() &&
    assurance !== "verified" &&
    assurance !== "strongly_verified"
  ) {
    assurance = "restricted";
  }

  const prevAssurance = loadIdentityAssuranceStates().find((a) => a.human_id === humanId);
  const assuranceRecord: IdentityAssuranceRecord = {
    id: itlId("ias"),
    human_id: humanId,
    state: assurance,
    effective_at: nowIso(),
    expires_at: null,
    reason_code: "trust_evaluation",
    source_event_id: sourceEventId ?? null,
    qualifying_confirmations: counts.total,
    independent_confirmations: counts.independent,
  };

  const assurances = loadIdentityAssuranceStates().filter((a) => a.human_id !== humanId);
  assurances.push(assuranceRecord);
  persistIdentityAssuranceStates(assurances);

  let institutionTrust: InstitutionTrustState = "provisional_member";
  if (assurance === "verified" || assurance === "strongly_verified") institutionTrust = "verified_member";
  if (human.trust_level >= 3) institutionTrust = "active_trusted_member";
  if (human.institution_leader) institutionTrust = "institution_leader";
  if (assurance === "restricted" || assurance === "identity_review") institutionTrust = "restricted_member";

  const trustRecord: HumanTrustStateRecord = {
    id: itlId("hts"),
    human_id: humanId,
    institution_id: institutionId,
    trust_domain: "institution",
    state: institutionTrust,
    effective_at: nowIso(),
    expires_at: null,
    reason_code: "trust_evaluation",
    source_event_id: sourceEventId ?? null,
    status: "active",
  };

  const trusts = loadHumanTrustStates().filter((t) => !(t.human_id === humanId && t.institution_id === institutionId));
  trusts.push(trustRecord);
  persistHumanTrustStates(trusts);

  const memberships = loadWave1Memberships();
  const mIdx = memberships.findIndex((m) => m.human_id === humanId && m.institution_id === institutionId);
  if (mIdx >= 0) {
    memberships[mIdx] = {
      ...memberships[mIdx],
      status: institutionTrust === "provisional_member" ? "provisional" : "active",
    };
    persistWave1Memberships(memberships);
  }

  const identities = loadHumanIdentities();
  const hIdx = identities.findIndex((h) => h.user_id === humanId);
  if (hIdx >= 0) {
    const level =
      assurance === "verified" || assurance === "strongly_verified"
        ? 2
        : assurance === "restricted"
          ? 1
          : human.trust_level;
    identities[hIdx] = {
      ...identities[hIdx],
      trust_level: human.institution_leader ? 4 : level,
      trust_label:
        assurance === "verified" || assurance === "strongly_verified"
          ? "verified"
          : assurance === "restricted"
            ? "sponsored"
            : identities[hIdx].trust_label,
      public_badge:
        assurance === "verified" || assurance === "strongly_verified"
          ? "Verified Human"
          : identities[hIdx].public_badge,
      independent_verification_count: counts.independent,
      identity_status: assurance === "restricted" ? "restricted" : identities[hIdx].identity_status,
      updated_at: nowIso(),
    };
    persistHumanIdentities(identities);
  }

  if (prevAssurance?.state !== assurance) {
    appendLedgerEvent({
      human_id: humanId,
      institution_id: institutionId,
      event_type: assurance === "verified" ? "identity.verified" : "trust.member_verified",
      occurred_at: nowIso(),
      actor_type: "system",
      actor_human_id: null,
      service_identity_id: null,
      source_system: "ITL-TRU-001",
      source_record_type: "identity_assurance",
      source_record_id: assuranceRecord.id,
      previous_state: prevAssurance?.state ?? null,
      new_state: assurance,
      reason_code: "qualifying_confirmations_met",
      evidence_digest: null,
      correlation_id: itlId("corr"),
    });
  }

  return { assurance, institutionTrust, counts };
}

export function extendProvisionalPeriod(
  humanId: string,
  institutionId: string,
  days: number,
  reason: string,
  approverId: string
) {
  const periods = loadProvisionalPeriods();
  const idx = periods.findIndex((p) => p.human_id === humanId && p.institution_id === institutionId && p.status === "active");
  if (idx < 0) throw new Error("No active provisional period found.");

  const newDeadline = new Date(Date.now() + days * 86400000).toISOString();
  periods[idx] = {
    ...periods[idx],
    status: "extended",
    extended_until: newDeadline,
    extension_reason: reason,
  };
  persistProvisionalPeriods(periods);

  appendLedgerEvent({
    human_id: humanId,
    institution_id: institutionId,
    event_type: "trust.provisional_started",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: approverId,
    service_identity_id: null,
    source_system: "ITL-TRU-001",
    source_record_type: "provisional_extension",
    source_record_id: periods[idx].id,
    previous_state: periods[idx].expires_at,
    new_state: newDeadline,
    reason_code: reason,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  return periods[idx];
}

export function restrictIdentity(humanId: string, institutionId: string, reason: string, actorId: string) {
  const identities = loadHumanIdentities();
  const idx = identities.findIndex((h) => h.user_id === humanId);
  if (idx < 0) throw new Error("Human not found.");

  identities[idx] = { ...identities[idx], identity_status: "restricted", updated_at: nowIso() };
  persistHumanIdentities(identities);

  appendLedgerEvent({
    human_id: humanId,
    institution_id: institutionId,
    event_type: "identity.restricted",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: actorId,
    service_identity_id: null,
    source_system: "ITL-TRU-001",
    source_record_type: "restriction",
    source_record_id: null,
    previous_state: "active",
    new_state: "restricted",
    reason_code: reason,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  return evaluateAssuranceAndTrust(humanId, institutionId);
}

export function recoverIdentity(humanId: string, institutionId: string, reason: string, actorId: string) {
  const identities = loadHumanIdentities();
  const idx = identities.findIndex((h) => h.user_id === humanId);
  if (idx < 0) throw new Error("Human not found.");

  identities[idx] = { ...identities[idx], identity_status: "active", updated_at: nowIso() };
  persistHumanIdentities(identities);

  appendLedgerEvent({
    human_id: humanId,
    institution_id: institutionId,
    event_type: "identity.recovered",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: actorId,
    service_identity_id: null,
    source_system: "ITL-TRU-001",
    source_record_type: "recovery",
    source_record_id: null,
    previous_state: "restricted",
    new_state: "active",
    reason_code: reason,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  return evaluateAssuranceAndTrust(humanId, institutionId);
}

export function getVerificationStatusView(humanId: string): VerificationStatusView {
  const policy = loadWave2Policy();
  const human = loadHumanIdentities().find((h) => h.user_id === humanId);
  const assurance = loadIdentityAssuranceStates().find((a) => a.human_id === humanId);
  const trust = loadHumanTrustStates().find((t) => t.human_id === humanId && t.status === "active");
  const provisional = loadProvisionalPeriods().find((p) => p.human_id === humanId && ["active", "extended"].includes(p.status));
  const counts = countQualifyingConfirmations(humanId, human?.primary_sponsor_id ?? null);

  let daysRemaining: number | null = null;
  if (provisional) {
    const end = new Date(provisional.extended_until ?? provisional.expires_at).getTime();
    daysRemaining = Math.max(0, Math.ceil((end - Date.now()) / 86400000));
  }

  const state = assurance?.state ?? "sponsored";
  let nextAction = "Ask someone who personally knows you to confirm our identity.";
  if (state === "verified" || state === "strongly_verified") {
    nextAction = "Identity verification complete. Continue accountable participation.";
  } else if (state === "restricted") {
    nextAction = "Contact identity support for review and resolution.";
  } else if (counts.independent < policy.required_independent_confirmations) {
    nextAction = "One independent confirmation is still required.";
  }

  return {
    assurance_state: state,
    institution_trust: trust?.state ?? "provisional_member",
    qualifying_confirmations: counts.total,
    required_confirmations: policy.required_total_confirmations,
    independent_confirmations: counts.independent,
    required_independent: policy.required_independent_confirmations,
    provisional_days_remaining: daysRemaining,
    next_action: nextAction,
    public_badge: human?.public_badge ?? "Sponsored Member",
    capabilities: computeCapabilities(state, trust?.state ?? "provisional_member"),
  };
}
