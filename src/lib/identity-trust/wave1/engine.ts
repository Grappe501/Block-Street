import { randomBytes } from "crypto";
import { hashSecret } from "@/lib/auth/crypto";
import { createInvitation } from "@/lib/auth/invitations";
import { loadUsers } from "@/lib/auth/data";
import { loadHumanIdentities, persistHumanIdentities } from "../data";
import { generateGlobalHumanId, itlId, nowIso } from "../utils";
import {
  loadAcceptanceAttempts,
  loadAliasRequests,
  loadDuplicateCandidates,
  loadFoundingRecord,
  loadHumanPublicIdentities,
  loadSponsorAttestations,
  loadSponsorPrivileges,
  loadWave1Flags,
  loadWave1Invitations,
  loadWave1Memberships,
  loadWave1Policy,
  persistAcceptanceAttempts,
  persistAliasRequests,
  persistDuplicateCandidates,
  persistFoundingRecord,
  persistHumanPublicIdentities,
  persistSponsorAttestations,
  persistSponsorPrivileges,
  persistWave1Invitations,
  persistWave1Memberships,
} from "./data";
import { recordWave1Audit } from "./lineage";
import { checkWave1Invariants } from "./invariants";
import { persistWave1Certification } from "./wave-prerequisite";
import type {
  AliasRequest,
  EntryGateDecision,
  FoundingIdentityRecord,
  HumanPublicIdentity,
  IdentityDuplicateCandidate,
  InvitationEntryGateResult,
  SponsorPrivilege,
  Wave1Certification,
  Wave1CertificationGate,
  Wave1Invitation,
  Wave1InstitutionMembership,
} from "./types";

const DISPOSABLE_NAME = /^(patriot|freedom|eagle|volunteer|truth|admin|campaign|anonymous|user)\d*/i;

export function generateHumGlobalId() {
  return `hum_${randomBytes(10).toString("base64url").replace(/[^a-zA-Z0-9]/g, "").slice(0, 16)}`;
}

export function validatePublicHumanName(name: string): { valid: boolean; reason?: string } {
  const trimmed = name.trim();
  if (trimmed.length < 2) return { valid: false, reason: "Public name is required." };
  if (!/\s/.test(trimmed) && !/^[A-Z][a-z]{2,}/.test(trimmed)) {
    return { valid: false, reason: "Use the name you are genuinely known by." };
  }
  if (DISPOSABLE_NAME.test(trimmed.replace(/\s/g, ""))) {
    return { valid: false, reason: "Disposable or anonymous screen names are not permitted." };
  }
  return { valid: true };
}

export function createFoundingIdentity(input: {
  user_id: string;
  public_name: string;
  installation_authority: string;
}): FoundingIdentityRecord {
  const flags = loadWave1Flags();
  if (!flags.FOUNDING_IDENTITY_INITIALIZATION_ENABLED) {
    throw new Error("Founding identity initialization is not enabled or has already closed.");
  }
  if (loadFoundingRecord()) throw new Error("Founding identity already exists.");

  const ghid = generateHumGlobalId();
  const ts = nowIso();
  const record: FoundingIdentityRecord = {
    id: itlId("founding"),
    human_id: input.user_id,
    global_human_id: ghid,
    public_name: input.public_name,
    installation_authority: input.installation_authority,
    certified_at: ts,
    founding_path_closed_at: ts,
    immutable: true,
  };
  persistFoundingRecord(record);

  const humans = loadHumanIdentities();
  const idx = humans.findIndex((h) => h.user_id === input.user_id);
  if (idx >= 0) {
    humans[idx] = {
      ...humans[idx],
      global_human_id: ghid,
      public_name: input.public_name,
      primary_sponsor_id: null,
      invitation_id: "founding-seed",
      updated_at: ts,
    };
    persistHumanIdentities(humans);
  }

  recordWave1Audit({
    event_type: "identity.founding_seed_created",
    actor_human_id: input.user_id,
    subject_human_id: input.user_id,
    institution_id: null,
    invitation_id: null,
    sponsor_relationship_id: null,
    action: "founding_seed_created",
    previous_state: null,
    new_state: "active",
    reason: input.installation_authority,
    request_id: null,
    correlation_id: itlId("corr"),
    result: "success",
  });

  return record;
}

export function getSponsorPrivilege(humanId: string): SponsorPrivilege {
  const existing = loadSponsorPrivileges().find((p) => p.human_id === humanId);
  if (existing) return existing;
  const human = loadHumanIdentities().find((h) => h.user_id === humanId);
  const policy = loadWave1Policy();
  const limit = policy.invite_limits[human?.trust_label ?? "sponsored"] ?? 0;
  const privilege: SponsorPrivilege = {
    human_id: humanId,
    global_human_id: human?.global_human_id ?? "",
    status: limit > 0 || limit < 0 ? "eligible" : "limited",
    active_invitation_limit: limit < 0 ? 999 : limit,
    active_invitations: 0,
    invitations_created_today: 0,
    sponsor_education_version: null,
    sponsor_education_completed_at: null,
    updated_at: nowIso(),
  };
  persistSponsorPrivileges([...loadSponsorPrivileges(), privilege]);
  return privilege;
}

export function completeSponsorEducation(humanId: string) {
  const privileges = loadSponsorPrivileges();
  const idx = privileges.findIndex((p) => p.human_id === humanId);
  const policy = loadWave1Policy();
  const updated: SponsorPrivilege = {
    ...(idx >= 0 ? privileges[idx] : getSponsorPrivilege(humanId)),
    sponsor_education_version: policy.sponsor_attestation_version,
    sponsor_education_completed_at: nowIso(),
    status: "eligible",
    updated_at: nowIso(),
  };
  if (idx >= 0) privileges[idx] = updated;
  else privileges.push(updated);
  persistSponsorPrivileges(privileges);
  recordWave1Audit({
    event_type: "sponsor.privilege_granted",
    actor_human_id: humanId,
    subject_human_id: humanId,
    institution_id: null,
    invitation_id: null,
    sponsor_relationship_id: null,
    action: "sponsor_education_completed",
    previous_state: null,
    new_state: "eligible",
    reason: null,
    request_id: null,
    correlation_id: null,
    result: "success",
  });
  return updated;
}

export function createWave1Invitation(input: {
  sponsor_human_id: string;
  institution_id: string;
  organization_unit_id?: string;
  workspace_id?: string;
  intended_recipient_name: string;
  recipient_email: string;
  proposed_membership_type?: string;
  proposed_role_id?: string;
  invitation_purpose: string;
  relationship_basis: Wave1Invitation["relationship_basis"];
  primary_attestation: boolean;
  secondary_attestation: boolean;
}): { invitation: Wave1Invitation; token: string } {
  const flags = loadWave1Flags();
  if (flags.SPONSOR_ATTESTATION_REQUIRED && (!input.primary_attestation || !input.secondary_attestation)) {
    throw new Error("Sponsor attestation is required before sending an invitation.");
  }

  const privilege = getSponsorPrivilege(input.sponsor_human_id);
  if (privilege.status === "paused" || privilege.status === "suspended" || privilege.status === "revoked") {
    throw new Error("Sponsor invitation privileges are not active.");
  }
  const activePending = loadWave1Invitations().filter(
    (i) => i.originating_sponsor_human_id === input.sponsor_human_id && ["sent", "delivered", "viewed", "acceptance_started"].includes(i.status)
  ).length;
  if (privilege.active_invitation_limit >= 0 && activePending >= privilege.active_invitation_limit) {
    throw new Error("Active invitation limit reached for current sponsor privilege level.");
  }

  const nameCheck = validatePublicHumanName(input.intended_recipient_name);
  if (!nameCheck.valid) throw new Error(nameCheck.reason);

  const policy = loadWave1Policy();
  const { invitation: authInv, token } = createInvitation({
    email: input.recipient_email,
    organization_id: input.organization_unit_id ?? input.institution_id,
    workspace_id: input.workspace_id,
    role_id: input.proposed_role_id ?? "member",
    invited_by: input.sponsor_human_id,
    message: input.invitation_purpose,
    expires_hours: policy.default_invitation_expiry_hours,
  });

  const expires = new Date(Date.now() + policy.default_invitation_expiry_hours * 3600000).toISOString();
  const correlationId = itlId("corr");

  const inv: Wave1Invitation = {
    id: itlId("winv"),
    public_invitation_id: `pinv_${randomBytes(4).toString("hex")}`,
    institution_id: input.institution_id,
    organization_unit_id: input.organization_unit_id ?? null,
    workspace_id: input.workspace_id ?? null,
    created_by_human_id: input.sponsor_human_id,
    originating_sponsor_human_id: input.sponsor_human_id,
    intended_recipient_name: input.intended_recipient_name,
    recipient_contact_reference: input.recipient_email.toLowerCase(),
    recipient_contact_type: "email",
    proposed_membership_type: input.proposed_membership_type ?? "basic_member",
    proposed_role_id: input.proposed_role_id ?? "member",
    invitation_purpose: input.invitation_purpose,
    relationship_basis: input.relationship_basis,
    sponsor_attestation_version: policy.sponsor_attestation_version,
    sponsor_attestation_accepted_at: nowIso(),
    status: "sent",
    auth_invitation_id: authInv.id,
    token_hash: hashSecret(token),
    created_at: nowIso(),
    sent_at: nowIso(),
    viewed_at: null,
    accepted_at: null,
    expires_at: expires,
    revoked_at: null,
    revoked_by: null,
    revocation_reason: null,
    accepted_human_id: null,
    replacement_invitation_id: null,
    resend_count: 0,
    correlation_id: correlationId,
  };

  const invitations = loadWave1Invitations();
  invitations.push(inv);
  persistWave1Invitations(invitations);

  const attestations = loadSponsorAttestations();
  attestations.push({
    id: itlId("attest"),
    sponsor_human_id: input.sponsor_human_id,
    invitation_id: inv.id,
    attestation_version: policy.sponsor_attestation_version,
    primary_accepted: input.primary_attestation,
    secondary_accepted: input.secondary_attestation,
    relationship_basis: input.relationship_basis ?? "other_directly_known",
    attested_at: nowIso(),
  });
  persistSponsorAttestations(attestations);

  recordWave1Audit({
    event_type: "invitation.attestation_accepted",
    actor_human_id: input.sponsor_human_id,
    subject_human_id: null,
    institution_id: input.institution_id,
    invitation_id: inv.id,
    sponsor_relationship_id: null,
    action: "invitation_created",
    previous_state: null,
    new_state: "sent",
    reason: input.invitation_purpose,
    request_id: null,
    correlation_id: correlationId,
    result: "success",
  });

  return { invitation: inv, token };
}

export function evaluateEntryGate(token: string, email?: string): InvitationEntryGateResult {
  const invitations = loadWave1Invitations();
  const hash = hashSecret(token);
  const inv = invitations.find((i) => i.token_hash === hash);

  if (!inv) {
    return gateResult("blocked", null, "Invitation is invalid or not found.");
  }
  if (inv.status === "revoked") {
    recordAttempt(inv.id, "blocked", "Revoked invitation replay");
    return gateResult("blocked", inv, "This invitation has been revoked.");
  }
  if (inv.status === "accepted") {
    return gateResult("already_accepted", inv, "This invitation has already been accepted. Sign in to your account.");
  }
  if (new Date(inv.expires_at).getTime() < Date.now()) {
    const updated = invitations.map((i) => (i.id === inv.id ? { ...i, status: "expired" as const } : i));
    persistWave1Invitations(updated);
    recordAttempt(inv.id, "blocked", "Expired");
    return gateResult("blocked", inv, "This invitation has expired. Request a replacement.");
  }
  if (email && email.toLowerCase() !== inv.recipient_contact_reference.toLowerCase()) {
    recordAttempt(inv.id, "identity_review_required", "Recipient mismatch");
    return gateResult("identity_review_required", inv, "Recipient contact does not match invitation.");
  }

  const dup = screenDuplicate(inv);
  if (dup.review_status === "possible_match" || dup.review_status === "manual_review_required") {
    return gateResult("identity_review_required", inv, "Potential existing human found. Confirmation required.");
  }

  const sponsor = getSponsorPrivilege(inv.originating_sponsor_human_id);
  if (sponsor.status === "suspended" || sponsor.status === "revoked") {
    return gateResult("blocked", inv, "Sponsor privileges are not active.");
  }

  return gateResult("proceed", inv, "Invitation valid. Activation may continue.");
}

function gateResult(decision: EntryGateDecision, inv: Wave1Invitation | null, message: string): InvitationEntryGateResult {
  return {
    invitation_token: inv ? "present" : null,
    invitation_status: inv?.status ?? null,
    recipient_match: decision !== "identity_review_required",
    institution_status: inv?.institution_id ?? "unknown",
    sponsor_status: inv ? getSponsorPrivilege(inv.originating_sponsor_human_id).status : null,
    scope_status: inv ? "within_scope" : "unknown",
    expiration_status: inv && new Date(inv.expires_at) > new Date() ? "valid" : "expired",
    duplicate_human_status: "no_match",
    authentication_status: null,
    activation_decision: decision,
    message,
  };
}

function recordAttempt(invitationId: string, result: EntryGateDecision, reason: string) {
  const attempts = loadAcceptanceAttempts();
  attempts.push({
    id: itlId("attempt"),
    invitation_id: invitationId,
    attempted_at: nowIso(),
    result,
    reason,
    actor_reference: null,
  });
  persistAcceptanceAttempts(attempts);
  recordWave1Audit({
    event_type: "invitation.acceptance_started",
    actor_human_id: null,
    subject_human_id: null,
    institution_id: null,
    invitation_id: invitationId,
    sponsor_relationship_id: null,
    action: "acceptance_attempt",
    previous_state: null,
    new_state: result,
    reason,
    request_id: null,
    correlation_id: null,
    result: result === "proceed" ? "success" : "failure",
  });
}

export function screenDuplicate(inv: Wave1Invitation): IdentityDuplicateCandidate {
  const flags = loadWave1Flags();
  if (!flags.IDENTITY_DUPLICATE_SCREENING_ENABLED) {
    return {
      id: itlId("dup"),
      invitation_id: inv.id,
      candidate_human_id: null,
      matched_human_id: null,
      match_signals: [],
      review_status: "no_match",
      created_at: nowIso(),
    };
  }

  const signals: string[] = [];
  let matchedId: string | null = null;

  const emailMatch = loadUsers().find((u) => u.primary_email.toLowerCase() === inv.recipient_contact_reference.toLowerCase());
  if (emailMatch) {
    signals.push("exact_verified_email");
    matchedId = emailMatch.user_id;
  }

  const nameMatch = loadHumanIdentities().find(
    (h) => h.public_name.toLowerCase() === inv.intended_recipient_name.toLowerCase()
  );
  if (nameMatch && nameMatch.user_id !== matchedId) {
    signals.push("strong_name_similarity");
    matchedId = matchedId ?? nameMatch.user_id;
  }

  const review_status =
    signals.includes("exact_verified_email") ? "existing_human_confirmed" : signals.length > 0 ? "possible_match" : "no_match";

  const candidate: IdentityDuplicateCandidate = {
    id: itlId("dup"),
    invitation_id: inv.id,
    candidate_human_id: null,
    matched_human_id: matchedId,
    match_signals: signals,
    review_status,
    created_at: nowIso(),
  };

  if (signals.length > 0) {
    const candidates = loadDuplicateCandidates();
    candidates.push(candidate);
    persistDuplicateCandidates(candidates);
    recordWave1Audit({
      event_type: "identity.duplicate_candidate_detected",
      actor_human_id: null,
      subject_human_id: matchedId,
      institution_id: inv.institution_id,
      invitation_id: inv.id,
      sponsor_relationship_id: null,
      action: "duplicate_screen",
      previous_state: null,
      new_state: review_status,
      reason: signals.join(", "),
      request_id: null,
      correlation_id: inv.correlation_id,
      result: "success",
    });
  }

  return candidate;
}

export function createProvisionalMembership(input: {
  human_id: string;
  global_human_id: string;
  institution_id: string;
  invitation_id: string;
  sponsor_human_id: string;
  proposed_role_id: string | null;
  organization_unit_id: string | null;
}): Wave1InstitutionMembership {
  const flags = loadWave1Flags();
  const policy = loadWave1Policy();
  const elevated = input.proposed_role_id && policy.elevated_roles_require_approval.includes(input.proposed_role_id);

  const membership: Wave1InstitutionMembership = {
    id: itlId("wmem"),
    human_id: input.human_id,
    global_human_id: input.global_human_id,
    institution_id: input.institution_id,
    originating_invitation_id: input.invitation_id,
    membership_type: "institution_member",
    status: flags.PROVISIONAL_MEMBERSHIP_DEFAULT ? "provisional" : "active",
    primary_unit_id: input.organization_unit_id,
    proposed_role_id: input.proposed_role_id,
    activated_role_id: elevated ? "member" : input.proposed_role_id ?? "member",
    joined_at: nowIso(),
    provisional_until: elevated ? new Date(Date.now() + 90 * 86400000).toISOString() : null,
    ended_at: null,
    created_by_sponsor_human_id: input.sponsor_human_id,
  };

  const memberships = loadWave1Memberships();
  memberships.push(membership);
  persistWave1Memberships(memberships);

  recordWave1Audit({
    event_type: "membership.provisional_created",
    actor_human_id: input.sponsor_human_id,
    subject_human_id: input.human_id,
    institution_id: input.institution_id,
    invitation_id: input.invitation_id,
    sponsor_relationship_id: null,
    action: "membership_created",
    previous_state: null,
    new_state: membership.status,
    reason: elevated ? "Elevated role requires separate approval" : null,
    request_id: null,
    correlation_id: null,
    result: "success",
  });

  return membership;
}

export function declarePublicIdentity(input: {
  human_id: string;
  global_human_id: string;
  public_name: string;
  preferred_short_name?: string;
  identity_basis?: HumanPublicIdentity["identity_basis"];
}): HumanPublicIdentity {
  const check = validatePublicHumanName(input.public_name);
  if (!check.valid) throw new Error(check.reason);

  const versions = loadHumanPublicIdentities();
  for (const v of versions.filter((v) => v.human_id === input.human_id && v.status === "active")) {
    v.status = "superseded";
    v.superseded_at = nowIso();
  }

  const version: HumanPublicIdentity = {
    id: itlId("hpi"),
    human_id: input.human_id,
    global_human_id: input.global_human_id,
    public_name: input.public_name,
    preferred_short_name: input.preferred_short_name ?? null,
    identity_basis: input.identity_basis ?? "everyday_public_name",
    effective_at: nowIso(),
    superseded_at: null,
    approved_by: null,
    status: "active",
  };
  versions.push(version);
  persistHumanPublicIdentities(versions);

  const humans = loadHumanIdentities();
  const idx = humans.findIndex((h) => h.user_id === input.human_id);
  if (idx >= 0) {
    humans[idx] = { ...humans[idx], public_name: input.public_name, updated_at: nowIso() };
    persistHumanIdentities(humans);
  }

  recordWave1Audit({
    event_type: "identity.public_name_declared",
    actor_human_id: input.human_id,
    subject_human_id: input.human_id,
    institution_id: null,
    invitation_id: null,
    sponsor_relationship_id: null,
    action: "public_identity_declared",
    previous_state: null,
    new_state: input.public_name,
    reason: null,
    request_id: null,
    correlation_id: null,
    result: "success",
  });

  return version;
}

export function submitAliasRequest(input: {
  human_id: string;
  requested_alias: string;
  alias_type: AliasRequest["alias_type"];
  reason: string;
}): AliasRequest {
  const flags = loadWave1Flags();
  if (!flags.KNOWN_ALIAS_REVIEW_ENABLED) throw new Error("Alias review is not enabled.");

  const req: AliasRequest = {
    id: itlId("alias"),
    human_id: input.human_id,
    requested_alias: input.requested_alias,
    alias_type: input.alias_type,
    reason: input.reason,
    evidence_reference: null,
    submitted_at: nowIso(),
    review_status: "pending",
    reviewed_by: null,
    reviewed_at: null,
  };
  const requests = loadAliasRequests();
  requests.push(req);
  persistAliasRequests(requests);

  recordWave1Audit({
    event_type: "identity.alias_requested",
    actor_human_id: input.human_id,
    subject_human_id: input.human_id,
    institution_id: null,
    invitation_id: null,
    sponsor_relationship_id: null,
    action: "alias_requested",
    previous_state: null,
    new_state: "pending",
    reason: input.reason,
    request_id: null,
    correlation_id: null,
    result: "success",
  });

  return req;
}

export function listWave1Invitations(sponsorId?: string) {
  const all = loadWave1Invitations();
  return sponsorId ? all.filter((i) => i.originating_sponsor_human_id === sponsorId) : all;
}

export function getWave1Invitation(id: string) {
  return loadWave1Invitations().find((i) => i.id === id || i.public_invitation_id === id) ?? null;
}

export function revokeWave1Invitation(id: string, revokedBy: string, reason: string) {
  const invitations = loadWave1Invitations();
  const idx = invitations.findIndex((i) => i.id === id);
  if (idx < 0) throw new Error("Invitation not found");
  invitations[idx] = {
    ...invitations[idx],
    status: "revoked",
    revoked_at: nowIso(),
    revoked_by: revokedBy,
    revocation_reason: reason,
  };
  persistWave1Invitations(invitations);
  recordWave1Audit({
    event_type: "invitation.revoked",
    actor_human_id: revokedBy,
    subject_human_id: null,
    institution_id: invitations[idx].institution_id,
    invitation_id: id,
    sponsor_relationship_id: null,
    action: "invitation_revoked",
    previous_state: invitations[idx].status,
    new_state: "revoked",
    reason,
    request_id: null,
    correlation_id: invitations[idx].correlation_id,
    result: "success",
  });
  return invitations[idx];
}

function gate(id: string, label: string, passed: boolean, evidence: string): Wave1CertificationGate {
  return { id, label, passed, evidence };
}

export function runWave1Certification(): Wave1Certification {
  const flags = loadWave1Flags();
  const humans = loadHumanIdentities();
  const invitations = loadWave1Invitations();

  const gates: Wave1CertificationGate[] = [
    gate("w1-g1", "No public registration", Boolean(flags.PUBLIC_REGISTRATION_DISABLED && flags.INVITATION_ONLY_ENTRY_REQUIRED), "Wave1 flags enforce invitation-only"),
    gate("w1-g2", "Human registry integrity", humans.every((h) => h.global_human_id && h.public_name), `${humans.length} humans with GHID and public name`),
    gate("w1-g3", "Sponsor lineage", invitations.every((i) => i.originating_sponsor_human_id), "All invitations have sponsors"),
    gate("w1-g4", "Invitation security", invitations.every((i) => !i.token_hash || i.token_hash.length > 20), "Tokens stored as hashes"),
    gate("w1-g5", "Scope safety", Boolean(flags.PROVISIONAL_MEMBERSHIP_DEFAULT && flags.INVITATION_SCOPE_ENFORCEMENT_ENABLED), "Provisional default enabled"),
    gate("w1-g6", "Naming integrity", Boolean(flags.PUBLIC_HUMAN_NAME_REQUIRED), "Public name policy enforced"),
    gate("w1-g7", "Audit integrity", Boolean(flags.IDENTITY_LINEAGE_AUDIT_ENABLED), "Lineage audit enabled"),
  ];

  const invariantResults = checkWave1Invariants();
  for (const inv of invariantResults) {
    gates.push(gate(`w1-inv-${inv.id}`, inv.id, inv.passed, inv.detail));
  }

  const allPassed = gates.every((g) => g.passed);
  const cert: Wave1Certification = {
    wave_id: "ITL-W1-001",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    gates,
  };
  if (allPassed) {
    persistWave1Certification(cert);
  }
  return cert;
}

export function getWave1Overview() {
  return {
    wave_id: "ITL-W1-001",
    status: loadWave1Flags().WAVE1_IMPLEMENTATION_STATUS,
    founding: loadFoundingRecord(),
    humans: loadHumanIdentities().length,
    invitations: loadWave1Invitations().length,
    memberships: loadWave1Memberships().length,
    duplicate_candidates: loadDuplicateCandidates().length,
    invariants: checkWave1Invariants(),
    policy: loadWave1Policy(),
    flags: loadWave1Flags(),
  };
}
