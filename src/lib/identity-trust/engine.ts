import { randomBytes } from "crypto";
import { acceptInvitation, createInvitation, getInvitationByToken, listInvitations } from "@/lib/auth/invitations";
import { hashPassword } from "@/lib/auth/crypto";
import { loadUsers, persistUsers } from "@/lib/auth/data";
import type { PlatformUser } from "@/lib/auth/types";
import { issueSession } from "@/lib/auth/session";
import type { Session } from "@/lib/auth/types";
import { listIdentityTrustAudit, recordIdentityTrustAudit } from "./audit";
import { appendIdentityHistory, generateGlobalHumanId } from "./history";
import {
  loadAppeals,
  loadFeatureFlags,
  loadFederationMemberships,
  loadHumanIdentities,
  loadIdentityReviews,
  loadIntelligenceAlerts,
  loadSponsorFlags,
  loadSponsorRelationships,
  loadTrustInvitations,
  loadTrustPolicy,
  loadVerifications,
  persistHumanIdentities,
  persistIdentityReviews,
  persistSponsorFlags,
  persistSponsorRelationships,
  persistTrustInvitations,
  persistVerifications,
} from "./data";
import { recordTrustPromotion } from "./governance";
import { addInstitutionMembership } from "./federation";
import { assertWave1Foundation } from "./wave1/wave-prerequisite";
import type {
  HumanIdentityRecord,
  IdentityReview,
  IdentityTrustOverview,
  IdentityTrustPolicy,
  InviteTreeNode,
  PublicTrustBadge,
  SponsorAccountabilitySummary,
  TrustInvitationRecord,
  TrustLevel,
  TrustLevelLabel,
  VerificationRecord,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

const LEVEL_MAP: Record<TrustLevel, { label: TrustLevelLabel; badge: PublicTrustBadge }> = {
  0: { label: "pending_invitation", badge: "Pending" },
  1: { label: "sponsored", badge: "Sponsored Member" },
  2: { label: "verified", badge: "Verified Human" },
  3: { label: "trusted", badge: "Trusted" },
  4: { label: "institution_leader", badge: "Leader" },
  5: { label: "federation_trusted", badge: "Federation Trusted" },
};

export function assertIdentityTrustEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.ITL_IDENTITY_TRUST_ENABLED) throw new Error("Identity Trust Layer is not enabled.");
  return flags;
}

function isRealPublicName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  if (/^\d+$/.test(trimmed)) return false;
  if (/^(patriot|freedom|eagle|volunteer|user|anon)/i.test(trimmed.replace(/\s/g, ""))) return false;
  return /\s/.test(trimmed) || /^[A-Z][a-z]+/.test(trimmed);
}

function inviteQuotaForLevel(level: TrustLevelLabel): number {
  return loadTrustPolicy().invite_limits[level] ?? 0;
}

function countIndependentVerifications(userId: string): number {
  const verifications = loadVerifications().filter((v) => v.subject_user_id === userId && v.independent);
  const verifiers = new Set(verifications.map((v) => v.verifier_user_id));
  return verifiers.size;
}

export function computeTrustLevel(record: HumanIdentityRecord): TrustLevel {
  if (record.federation_trusted) return 5;
  if (record.institution_leader) return 4;
  const independent = countIndependentVerifications(record.user_id);
  const policy = loadTrustPolicy();
  if (independent >= policy.verification_for_trusted) {
    const daysSinceJoin =
      (Date.now() - new Date(record.trust_established_at ?? record.created_at).getTime()) / 86400000;
    if (daysSinceJoin >= 30) return 3;
    return 2;
  }
  if (independent >= 1) return 2;
  if (record.primary_sponsor_id) return 1;
  return 0;
}

function applyTrustLevel(record: HumanIdentityRecord): HumanIdentityRecord {
  const level = computeTrustLevel(record);
  const meta = LEVEL_MAP[level];
  const independent = countIndependentVerifications(record.user_id);
  return {
    ...record,
    trust_level: level,
    trust_label: meta.label,
    public_badge: meta.badge,
    independent_verification_count: independent,
    invite_quota: inviteQuotaForLevel(meta.label),
    updated_at: now(),
  };
}

function applyAndPersistTrustLevel(identities: HumanIdentityRecord[], idx: number) {
  const prev = identities[idx].trust_label;
  const updated = applyTrustLevel(identities[idx]);
  identities[idx] = updated;
  if (prev !== updated.trust_label) {
    recordTrustPromotion({
      user_id: updated.user_id,
      global_human_id: updated.global_human_id,
      from_level: prev,
      to_level: updated.trust_label,
      reason: "Trust lifecycle evaluation",
      automatic: true,
      promoted_by: null,
    });
  }
  persistHumanIdentities(identities);
}

export function getIdentityTrustPolicy(): IdentityTrustPolicy {
  const policy = loadTrustPolicy();
  return {
    core_principle: policy.core_principle,
    sponsor_responsibility: policy.sponsor_responsibility,
    sponsor_agreement_text: policy.sponsor_agreement_text,
    real_name_policy: policy.real_name_policy,
    verification_for_trusted: policy.verification_for_trusted,
    review_period_days: policy.review_period_days,
    dormancy_days: policy.dormancy_days,
    invite_limits: policy.invite_limits as IdentityTrustPolicy["invite_limits"],
    constitutional_principles: policy.constitutional_principles,
  };
}

const SUBSYSTEMS = [
  { id: "ITL-HIR-001", name: "Human Identity Registry", status: "operational" },
  { id: "ITL-INV-001", name: "Invitation Network", status: "operational" },
  { id: "ITL-SPN-001", name: "Sponsor Accountability", status: "operational" },
  { id: "ITL-VER-001", name: "Verification Engine", status: "operational" },
  { id: "ITL-TRU-001", name: "Trust Lifecycle", status: "operational" },
  { id: "ITL-LED-001", name: "Immutable Identity Ledger", status: "operational" },
  { id: "ITL-GOV-001", name: "Identity Governance", status: "operational" },
  { id: "ITL-FED-001", name: "Federation Identity", status: "operational" },
  { id: "ITL-INT-001", name: "Identity Intelligence", status: "operational" },
  { id: "ITL-OPS-001", name: "Identity Operations", status: "operational" },
  { id: "ITL-CERT-001", name: "Certification", status: "operational" },
];

export function getIdentityTrustOverview(): IdentityTrustOverview {
  const flags = loadFeatureFlags();
  const identities = loadHumanIdentities();
  const byLevel: Record<string, number> = {};
  const byStatus: Record<string, number> = { active: 0, dormant: 0, restricted: 0, archived: 0 };
  for (const i of identities) {
    byLevel[i.trust_label] = (byLevel[i.trust_label] ?? 0) + 1;
    byStatus[i.identity_status] = (byStatus[i.identity_status] ?? 0) + 1;
  }
  return {
    enabled: flags.ITL_IDENTITY_TRUST_ENABLED,
    invitation_only: flags.ITL_INVITATION_ONLY_MODE,
    total_identities: identities.length,
    by_trust_level: byLevel,
    by_identity_status: byStatus as IdentityTrustOverview["by_identity_status"],
    pending_reviews: loadIdentityReviews().filter((r) => r.status !== "resolved").length,
    pending_appeals: loadAppeals().filter((a) => a.status === "submitted" || a.status === "under_review").length,
    open_invitations: loadTrustInvitations().filter((i) => i.status === "pending").length,
    federation_memberships: loadFederationMemberships().filter((m) => m.status === "active").length,
    intelligence_alerts: loadIntelligenceAlerts().filter((a) => a.status === "open").length,
    constitutional_principle: loadTrustPolicy().core_principle,
    subsystems: SUBSYSTEMS,
  };
}

export function listHumanIdentities(organizationId?: string): HumanIdentityRecord[] {
  assertIdentityTrustEnabled();
  const all = loadHumanIdentities();
  if (!organizationId) return all;
  return all.filter((i) => i.organization_id === organizationId);
}

export function getHumanIdentity(userId: string): HumanIdentityRecord | null {
  return loadHumanIdentities().find((i) => i.user_id === userId) ?? null;
}

export function getPublicIdentityBadge(userId: string): { badge: PublicTrustBadge; public_name: string } | null {
  const record = getHumanIdentity(userId);
  if (!record) return null;
  return { badge: record.public_badge, public_name: record.public_name };
}

export function ensureHumanIdentityForUser(user: PlatformUser, sponsorId?: string | null): HumanIdentityRecord {
  const existing = getHumanIdentity(user.user_id);
  if (existing) return applyTrustLevel(existing);

  const ghid = generateGlobalHumanId();
  const record: HumanIdentityRecord = applyTrustLevel({
    id: id("hid"),
    global_human_id: ghid,
    user_id: user.user_id,
    legal_name: user.legal_name_optional,
    public_name: user.display_name,
    preferred_name: user.preferred_name,
    display_name: user.preferred_name !== user.display_name ? user.preferred_name : null,
    known_alias_approved: false,
    aliases: [],
    identity_status: "active",
    trust_level: sponsorId ? 1 : 4,
    trust_label: sponsorId ? "sponsored" : "institution_leader",
    public_badge: sponsorId ? "Sponsored Member" : "Leader",
    primary_sponsor_id: sponsorId ?? null,
    invitation_id: null,
    institution_id: null,
    organization_id: null,
    intended_role: null,
    invite_quota: sponsorId ? 0 : -1,
    invites_sent: 0,
    independent_verification_count: 0,
    institution_leader: !sponsorId,
    federation_trusted: false,
    review_required: false,
    last_active_at: now(),
    created_at: now(),
    updated_at: now(),
    trust_established_at: now(),
    archived_at: null,
  });

  const identities = loadHumanIdentities();
  identities.push(record);
  persistHumanIdentities(identities);
  appendIdentityHistory({
    global_human_id: ghid,
    user_id: user.user_id,
    event_type: "identity_created",
    actor_id: sponsorId ?? user.user_id,
    summary: sponsorId ? "Identity established via sponsorship" : "Bootstrap identity created",
  });
  return record;
}

export function createTrustInvitation(input: {
  email: string;
  organization_id: string;
  institution_id: string;
  workspace_id?: string | null;
  intended_role: string;
  invite_reason: string;
  sponsor_id: string;
  sponsor_agreement_accepted: boolean;
  message?: string;
}): { invitation: TrustInvitationRecord; token: string; accept_url: string } {
  const flags = assertIdentityTrustEnabled();
  if (flags.ITL_REQUIRE_SPONSOR_AGREEMENT && !input.sponsor_agreement_accepted) {
    throw new Error("Sponsor agreement must be accepted before sending an invitation.");
  }

  const sponsor = getHumanIdentity(input.sponsor_id);
  if (!sponsor) throw new Error("Sponsor must have an established human identity record.");
  if (sponsor.invite_quota >= 0 && sponsor.invites_sent >= sponsor.invite_quota) {
    throw new Error("Invite quota exceeded for current trust level.");
  }

  const sponsorFlag = loadSponsorFlags().find((f) => f.sponsor_id === input.sponsor_id);
  if (sponsorFlag?.invite_privileges_paused) {
    throw new Error("Invite privileges are paused pending identity review.");
  }

  const { invitation: authInv, token } = createInvitation({
    email: input.email,
    organization_id: input.organization_id,
    workspace_id: input.workspace_id,
    role_id: input.intended_role,
    invited_by: input.sponsor_id,
    message: input.message,
  });

  const trustInv: TrustInvitationRecord = {
    id: id("tinv"),
    auth_invitation_id: authInv.id,
    email: input.email.toLowerCase(),
    sponsor_id: input.sponsor_id,
    sponsor_agreement_accepted_at: now(),
    invite_reason: input.invite_reason,
    institution_id: input.institution_id,
    organization_id: input.organization_id,
    intended_role: input.intended_role,
    expires_at: authInv.expires_at,
    accepted_at: null,
    created_at: now(),
    status: "pending",
  };

  const trustInvitations = loadTrustInvitations();
  trustInvitations.push(trustInv);
  persistTrustInvitations(trustInvitations);

  const identities = loadHumanIdentities();
  const sIdx = identities.findIndex((i) => i.user_id === input.sponsor_id);
  if (sIdx >= 0) {
    identities[sIdx] = { ...identities[sIdx], invites_sent: identities[sIdx].invites_sent + 1, updated_at: now() };
    persistHumanIdentities(identities);
  }

  recordIdentityTrustAudit({
    actor_id: input.sponsor_id,
    action: "trust_invitation_created",
    target_user_id: null,
    target_invitation_id: trustInv.id,
    organization_id: input.organization_id,
    institution_id: input.institution_id,
    result: "success",
    metadata: { email: input.email, intended_role: input.intended_role },
  });

  return { invitation: trustInv, token, accept_url: `/invitations/accept?token=${token}` };
}

export function registerWithInvitation(
  input: {
    token: string;
    email: string;
    password: string;
    public_name: string;
    display_name?: string;
    legal_name?: string;
    known_alias_approved?: boolean;
  },
  meta?: { ip?: string; userAgent?: string }
): { user: PlatformUser; session: Session; identity: HumanIdentityRecord } | { error: string } {
  const flags = assertIdentityTrustEnabled();
  if (!flags.ITL_INVITATION_ONLY_MODE) {
    return { error: "Invitation-only registration is not enabled" };
  }

  const inv = getInvitationByToken(input.token);
  if (!inv) return { error: "This invitation is invalid, expired, or has already been used." };
  if (inv.email.toLowerCase() !== input.email.toLowerCase()) {
    return { error: "This invitation was sent to a different email address." };
  }

  if (flags.ITL_PUBLIC_NAME_POLICY_ENFORCED && !input.known_alias_approved && !isRealPublicName(input.public_name)) {
    return {
      error: "Public name must be the name you are publicly known by. Known aliases require approval.",
    };
  }

  const existing = loadUsers().find((u) => u.primary_email.toLowerCase() === input.email.toLowerCase());
  if (existing) return { error: "An account with this email already exists. Sign in to accept the invitation." };

  const userId = `usr-${randomBytes(8).toString("hex")}`;
  const ts = now();
  const user: PlatformUser = {
    user_id: userId,
    public_id: `pub-${userId}`,
    primary_email: input.email.toLowerCase(),
    verified_emails: [input.email.toLowerCase()],
    display_name: input.public_name,
    preferred_name: input.display_name ?? input.public_name.split(" ")[0] ?? input.public_name,
    legal_name_optional: input.legal_name ?? null,
    avatar: null,
    avatar_url: null,
    phone_optional: null,
    locale: "en-US",
    timezone: "America/Chicago",
    authentication_methods: ["email_password"],
    account_status: "active",
    password_hash: hashPassword(input.password),
    mfa_enabled: false,
    mfa_secret: null,
    identity_assurance_level: "ial1",
    security_state: "normal",
    onboarding_status: "in_progress",
    terms_accepted_at: null,
    privacy_policy_accepted_at: null,
    created_at: ts,
    updated_at: ts,
    last_login_at: null,
    last_active_at: null,
    deleted_at: null,
  };

  const users = loadUsers();
  users.push(user);
  persistUsers(users);

  const acceptResult = acceptInvitation(input.token, userId);
  if (!acceptResult.ok) return { error: acceptResult.error };

  const trustInv = loadTrustInvitations().find((t) => t.auth_invitation_id === inv.id);
  if (trustInv) {
    const trustInvitations = loadTrustInvitations();
    const idx = trustInvitations.findIndex((t) => t.id === trustInv.id);
    trustInvitations[idx] = { ...trustInvitations[idx], status: "accepted" };
    persistTrustInvitations(trustInvitations);
  }

  const ghid = generateGlobalHumanId();
  const identity: HumanIdentityRecord = applyTrustLevel({
    id: id("hid"),
    global_human_id: ghid,
    user_id: userId,
    legal_name: input.legal_name ?? null,
    public_name: input.public_name,
    preferred_name: input.display_name ?? input.public_name.split(" ")[0] ?? input.public_name,
    display_name: input.display_name ?? null,
    known_alias_approved: input.known_alias_approved ?? false,
    aliases: [],
    identity_status: "active",
    trust_level: 1,
    trust_label: "sponsored",
    public_badge: "Sponsored Member",
    primary_sponsor_id: inv.invited_by,
    invitation_id: trustInv?.id ?? inv.id,
    institution_id: trustInv?.institution_id ?? null,
    organization_id: inv.organization_id,
    intended_role: trustInv?.intended_role ?? inv.role_id,
    invite_quota: 0,
    invites_sent: 0,
    independent_verification_count: 0,
    institution_leader: false,
    federation_trusted: false,
    review_required: false,
    last_active_at: ts,
    created_at: ts,
    updated_at: ts,
    trust_established_at: ts,
    archived_at: null,
  });

  const identities = loadHumanIdentities();
  identities.push(identity);
  persistHumanIdentities(identities);

  const sponsorRels = loadSponsorRelationships();
  sponsorRels.push({
    id: id("srel"),
    sponsor_id: inv.invited_by,
    sponsored_user_id: userId,
    invitation_id: trustInv?.id ?? inv.id,
    institution_id: trustInv?.institution_id ?? "unknown",
    organization_id: inv.organization_id,
    created_at: ts,
    permanent: true,
  });
  persistSponsorRelationships(sponsorRels);

  if (trustInv?.institution_id) {
    addInstitutionMembership({
      global_human_id: ghid,
      user_id: userId,
      institution_id: trustInv.institution_id,
      organization_id: inv.organization_id,
      role: trustInv.intended_role,
    });
  }

  appendIdentityHistory({
    global_human_id: ghid,
    user_id: userId,
    event_type: "invitation_accepted",
    actor_id: inv.invited_by,
    summary: `Sponsored entry via invitation`,
    details: { sponsor_id: inv.invited_by, invitation_id: trustInv?.id ?? inv.id },
  });

  recordIdentityTrustAudit({
    actor_id: userId,
    action: "identity_established_via_invitation",
    target_user_id: userId,
    target_invitation_id: trustInv?.id ?? inv.id,
    organization_id: inv.organization_id,
    institution_id: trustInv?.institution_id ?? null,
    result: "success",
    metadata: { sponsor_id: inv.invited_by },
  });

  return { user, session: issueSession(user, { ...meta, authStrength: "ial1" }), identity };
}

export function addVerification(input: {
  subject_user_id: string;
  verifier_user_id: string;
  relationship: string;
  verification_method: VerificationRecord["verification_method"];
  confidence: VerificationRecord["confidence"];
  notes_private?: string;
  independent?: boolean;
}): VerificationRecord {
  const { addVerificationLegacy } = require("./wave2/verification") as typeof import("./wave2/verification");
  const stmt = addVerificationLegacy({
    subject_user_id: input.subject_user_id,
    verifier_user_id: input.verifier_user_id,
    relationship: input.relationship,
    verification_method: input.verification_method,
    confidence: input.confidence,
    notes_private: input.notes_private,
  });

  return {
    id: stmt.id,
    subject_user_id: stmt.subject_human_id,
    verifier_user_id: stmt.verifier_human_id,
    relationship: stmt.relationship_basis,
    verification_method: input.verification_method,
    confidence: input.confidence,
    notes_private: stmt.evidence_reference,
    independent: stmt.independent,
    verified_at: stmt.submitted_at,
  };
}

export function listVerificationsForUser(userId: string, requesterId: string): VerificationRecord[] {
  assertIdentityTrustEnabled();
  const { listStatementsForSubject } = require("./wave2/verification") as typeof import("./wave2/verification");
  const statements = listStatementsForSubject(userId, requesterId);
  return statements.map((s) => ({
    id: s.id,
    subject_user_id: s.subject_human_id,
    verifier_user_id: s.verifier_human_id,
    relationship: s.relationship_basis,
    verification_method: "known_personally" as VerificationRecord["verification_method"],
    confidence: s.confidence === "certain" ? "high" : s.confidence === "strong" ? "medium" : "low",
    notes_private: s.evidence_reference,
    independent: s.independent,
    verified_at: s.submitted_at,
  }));
}

export function openIdentityReview(input: {
  subject_user_id: string;
  opened_by: string;
  reason: string;
}): IdentityReview {
  assertIdentityTrustEnabled();
  const { openIdentityCase } = require("./wave3/cases") as typeof import("./wave3/cases");
  const governed = openIdentityCase({
    case_type: "other_identity_matter",
    subject_human_id: input.subject_user_id,
    reporting_human_id: input.opened_by,
    scope: "global_identity_assurance",
    summary: input.reason,
    severity: "IG-2",
  });

  const review: IdentityReview = {
    id: governed.id,
    subject_user_id: input.subject_user_id,
    opened_by: input.opened_by,
    reason: input.reason,
    status: "open",
    outcome: null,
    ai_recommendation: null,
    created_at: governed.opened_at,
    resolved_at: null,
    resolution_notes: null,
  };
  const reviews = loadIdentityReviews();
  reviews.push(review);
  persistIdentityReviews(reviews);

  const identities = loadHumanIdentities();
  const idx = identities.findIndex((i) => i.user_id === input.subject_user_id);
  if (idx >= 0) {
    identities[idx] = { ...identities[idx], review_required: true, updated_at: now() };
    persistHumanIdentities(identities);
  }

  recordIdentityTrustAudit({
    actor_id: input.opened_by,
    action: "identity_review_opened",
    target_user_id: input.subject_user_id,
    target_invitation_id: null,
    organization_id: null,
    institution_id: null,
    result: "success",
  });

  return review;
}

export function resolveIdentityReview(input: {
  review_id: string;
  resolver_id: string;
  outcome: IdentityReview["outcome"];
  resolution_notes?: string;
}): IdentityReview {
  assertIdentityTrustEnabled();
  const reviews = loadIdentityReviews();
  const idx = reviews.findIndex((r) => r.id === input.review_id);
  if (idx < 0) throw new Error("Review not found.");

  reviews[idx] = {
    ...reviews[idx],
    status: "resolved",
    outcome: input.outcome,
    resolved_at: now(),
    resolution_notes: input.resolution_notes ?? null,
  };
  persistIdentityReviews(reviews);

  const subjectId = reviews[idx].subject_user_id;
  const identities = loadHumanIdentities();
  const iIdx = identities.findIndex((i) => i.user_id === subjectId);
  if (iIdx >= 0) {
    identities[iIdx] = {
      ...identities[iIdx],
      review_required: input.outcome === "needs_more_evidence",
      updated_at: now(),
    };
    if (input.outcome === "restricted") {
      identities[iIdx] = applyTrustLevel({ ...identities[iIdx], trust_level: 1 });
    }
    persistHumanIdentities(identities);
  }

  recordIdentityTrustAudit({
    actor_id: input.resolver_id,
    action: "identity_review_resolved",
    target_user_id: subjectId,
    target_invitation_id: null,
    organization_id: null,
    institution_id: null,
    result: "success",
    metadata: { outcome: input.outcome },
  });

  return reviews[idx];
}

export function getInviteTree(userId: string, depth = 3): InviteTreeNode {
  assertIdentityTrustEnabled();
  const identities = loadHumanIdentities();

  function buildNode(uid: string, remaining: number): InviteTreeNode {
    const identity = identities.find((i) => i.user_id === uid);
    const sponsored = identities.filter((i) => i.primary_sponsor_id === uid);

    const children =
      remaining > 0
        ? sponsored
            .filter((v, i, arr) => arr.findIndex((x) => x.user_id === v.user_id) === i)
            .map((s) => buildNode(s.user_id, remaining - 1))
        : [];

    return {
      user_id: uid,
      global_human_id: identity?.global_human_id ?? "",
      public_name: identity?.public_name ?? uid,
      trust_label: identity?.trust_label ?? "pending_invitation",
      sponsored_by: identity?.primary_sponsor_id ?? null,
      invited: children,
    };
  }

  return buildNode(userId, depth);
}

export function getInviteAncestry(userId: string): HumanIdentityRecord[] {
  assertIdentityTrustEnabled();
  const chain: HumanIdentityRecord[] = [];
  let current = getHumanIdentity(userId);
  while (current?.primary_sponsor_id) {
    const sponsor = getHumanIdentity(current.primary_sponsor_id);
    if (!sponsor) break;
    chain.unshift(sponsor);
    current = sponsor;
  }
  return chain;
}

export function detectBadActorSponsor(sponsorId: string): SponsorAccountabilitySummary {
  assertIdentityTrustEnabled();
  const sponsor = getHumanIdentity(sponsorId);
  const trustInvitations = loadTrustInvitations().filter((t) => t.sponsor_id === sponsorId);
  const reviews = loadIdentityReviews().filter(
    (r) => getHumanIdentity(r.subject_user_id)?.primary_sponsor_id === sponsorId
  );
  const flagged = reviews.filter((r) => r.outcome === "restricted" || r.outcome === "removed").length;
  const flag = loadSponsorFlags().find((f) => f.sponsor_id === sponsorId);

  if (flagged >= 2 && loadFeatureFlags().ITL_BAD_ACTOR_SPONSOR_DETECTION) {
    const flags = loadSponsorFlags().filter((f) => f.sponsor_id !== sponsorId);
    flags.push({
      sponsor_id: sponsorId,
      reason: `${flagged} invited accounts flagged in identity review`,
      invite_privileges_paused: true,
    });
    persistSponsorFlags(flags);
  }

  return {
    sponsor_id: sponsorId,
    global_human_id: sponsor?.global_human_id ?? null,
    public_name: sponsor?.public_name ?? sponsorId,
    invites_sent: trustInvitations.length,
    invites_accepted: trustInvitations.filter((t) => t.status === "accepted").length,
    flagged_accounts: flagged,
    invite_privileges_paused: flag?.invite_privileges_paused ?? flagged >= 2,
    sponsor_reputation_score: Math.max(0, 100 - flagged * 25),
  };
}

export function updatePublicIdentity(
  userId: string,
  input: {
    public_name?: string;
    display_name?: string;
    legal_name?: string;
    known_alias_approved?: boolean;
  }
): HumanIdentityRecord {
  assertIdentityTrustEnabled();
  const identities = loadHumanIdentities();
  const idx = identities.findIndex((i) => i.user_id === userId);
  if (idx < 0) throw new Error("Identity not found.");

  if (
    input.public_name &&
    loadFeatureFlags().ITL_PUBLIC_NAME_POLICY_ENFORCED &&
    !input.known_alias_approved &&
    !identities[idx].known_alias_approved &&
    !isRealPublicName(input.public_name)
  ) {
    throw new Error("Public name must be a real publicly known identity.");
  }

  identities[idx] = {
    ...identities[idx],
    public_name: input.public_name ?? identities[idx].public_name,
    display_name: input.display_name ?? identities[idx].display_name,
    legal_name: input.legal_name ?? identities[idx].legal_name,
    known_alias_approved: input.known_alias_approved ?? identities[idx].known_alias_approved,
    updated_at: now(),
  };
  persistHumanIdentities(identities);

  const users = loadUsers();
  const uIdx = users.findIndex((u) => u.user_id === userId);
  if (uIdx >= 0 && input.public_name) {
    users[uIdx] = { ...users[uIdx], display_name: input.public_name, updated_at: now() };
    persistUsers(users);
  }

  recordIdentityTrustAudit({
    actor_id: userId,
    action: "public_identity_updated",
    target_user_id: userId,
    target_invitation_id: null,
    organization_id: identities[idx].organization_id,
    institution_id: identities[idx].institution_id,
    result: "success",
  });

  return identities[idx];
}

export function listTrustInvitations(sponsorId?: string): TrustInvitationRecord[] {
  const all = loadTrustInvitations();
  if (!sponsorId) return all;
  return all.filter((t) => t.sponsor_id === sponsorId);
}

export function listIdentityReviews(status?: IdentityReview["status"]): IdentityReview[] {
  const all = loadIdentityReviews();
  if (!status) return all;
  return all.filter((r) => r.status === status);
}

export { listIdentityTrustAudit };

export { getIdentityTimeline } from "./history";
export { submitAppeal, resolveAppeal, listAppeals, listTrustPromotions, listTrustDemotions, detectDormantIdentities, archiveIdentity, setAiReviewRecommendation } from "./governance";
export { addInstitutionMembership, transferInstitutionMembership, grantFederationTrust, getFederationIdentityView, listFederationMemberships } from "./federation";
export { generateIdentityIntelligence, listIntelligenceAlerts, searchIdentities, getAiIdentityRecommendation } from "./intelligence";
export { runIdentityCertification } from "./certification";
export { getInvitationAnalytics } from "./invitations";
