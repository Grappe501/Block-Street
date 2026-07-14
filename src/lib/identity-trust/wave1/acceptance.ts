import { randomBytes } from "crypto";
import { acceptInvitation } from "@/lib/auth/invitations";
import { getHomePlaceForUser, loadUsers, persistUsers } from "@/lib/auth/data";
import { hashPassword } from "@/lib/auth/crypto";
import { issueSession } from "@/lib/auth/session";
import { loadHumanIdentities, loadSponsorRelationships, persistHumanIdentities, persistSponsorRelationships } from "../data";
import { itlId, nowIso } from "../utils";
import { loadWave1Invitations, persistWave1Invitations } from "./data";
import {
  createProvisionalMembership,
  declarePublicIdentity,
  evaluateEntryGate,
  generateHumGlobalId,
  resolveWave1InvitationByToken,
  screenDuplicate,
  validatePublicHumanName,
} from "./engine";
import { recordWave1Audit } from "./lineage";
import { startProvisionalPeriod } from "../wave2/trust-lifecycle";
import { evaluateAssuranceAndTrust } from "../wave2/trust-lifecycle";
import { createPersonalNetwork } from "@/lib/network";
import type { Wave1Invitation } from "./types";

export function findWave1InvitationByToken(token: string): Wave1Invitation | null {
  return resolveWave1InvitationByToken(token);
}

export function startWave1Acceptance(token: string, email?: string) {
  const gate = evaluateEntryGate(token, email);
  const inv = findWave1InvitationByToken(token);
  if (inv && gate.activation_decision === "proceed") {
    const invitations = loadWave1Invitations();
    const idx = invitations.findIndex((i) => i.id === inv.id);
    if (idx >= 0 && invitations[idx].status === "sent") {
      invitations[idx] = { ...invitations[idx], status: "acceptance_started", viewed_at: nowIso() };
      persistWave1Invitations(invitations);
    }
  }
  return { gate, invitation: inv ? { ...inv, token_hash: undefined } : null };
}

export function completeWave1Activation(
  input: {
    token: string;
    email: string;
    password: string;
    public_name: string;
    preferred_short_name?: string;
    link_existing_user_id?: string;
    referred_by?: string | null;
  },
  meta?: { ip?: string; userAgent?: string }
) {
  const gate = evaluateEntryGate(input.token, input.email);
  if (gate.activation_decision === "blocked") throw new Error(gate.message);
  if (gate.activation_decision === "already_accepted") throw new Error(gate.message);

  const inv = findWave1InvitationByToken(input.token);
  if (!inv) throw new Error("Invitation not found.");

  const dup = screenDuplicate(inv);
  if (dup.review_status === "existing_human_confirmed" && dup.matched_human_id && !input.link_existing_user_id) {
    return {
      requires_existing_human_confirmation: true,
      matched_human_id: dup.matched_human_id,
      message: "An existing human record was found. Confirm to link this invitation to our existing identity.",
    };
  }

  let userId: string;
  let globalHumanId: string;
  let sessionId: string | null = null;

  const existingUser = loadUsers().find((u) => u.primary_email.toLowerCase() === input.email.toLowerCase());
  const linkId = input.link_existing_user_id ?? existingUser?.user_id;

  if (linkId) {
    const acceptResult = acceptInvitation(input.token, linkId);
    if (!acceptResult.ok) throw new Error(acceptResult.error);
    userId = linkId;
    const humans = loadHumanIdentities();
    const h = humans.find((x) => x.user_id === userId);
    globalHumanId = h?.global_human_id ?? generateHumGlobalId();
    if (!h) throw new Error("Existing user has no human record — run legacy reconciliation.");
    declarePublicIdentity({
      human_id: userId,
      global_human_id: globalHumanId,
      public_name: input.public_name,
      preferred_short_name: input.preferred_short_name,
    });
  } else {
    if (gate.activation_decision === "identity_review_required") {
      throw new Error(gate.message);
    }
    const nameCheck = validatePublicHumanName(input.public_name);
    if (!nameCheck.valid) throw new Error(nameCheck.reason);

    const existing = loadUsers().find((u) => u.primary_email.toLowerCase() === input.email.toLowerCase());
    if (existing) throw new Error("An account with this email already exists. Sign in to accept the invitation.");

    userId = `usr-${randomBytes(8).toString("hex")}`;
    const ts = nowIso();
    const user = {
      user_id: userId,
      public_id: `pub-${userId}`,
      primary_email: input.email.toLowerCase(),
      verified_emails: [input.email.toLowerCase()],
      display_name: input.public_name,
      preferred_name: input.preferred_short_name ?? input.public_name.split(" ")[0] ?? input.public_name,
      legal_name_optional: null,
      avatar: null,
      avatar_url: null,
      phone_optional: null,
      locale: "en-US",
      timezone: "America/Chicago",
      authentication_methods: ["email_password"],
      account_status: "active" as const,
      password_hash: hashPassword(input.password),
      mfa_enabled: false,
      mfa_secret: null,
      identity_assurance_level: "ial1" as const,
      security_state: "normal" as const,
      onboarding_status: "in_progress" as const,
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

    const legacyAccept = acceptInvitation(input.token, userId);
    if (!legacyAccept.ok) throw new Error(legacyAccept.error);

    globalHumanId = generateHumGlobalId();
    const humans = loadHumanIdentities();
    humans.push({
      id: itlId("hid"),
      global_human_id: globalHumanId,
      user_id: userId,
      legal_name: null,
      public_name: input.public_name,
      preferred_name: input.preferred_short_name ?? input.public_name.split(" ")[0] ?? input.public_name,
      display_name: input.preferred_short_name ?? null,
      known_alias_approved: false,
      aliases: [],
      identity_status: "active",
      trust_level: 1,
      trust_label: "sponsored",
      public_badge: "Sponsored Member",
      primary_sponsor_id: inv.originating_sponsor_human_id,
      invitation_id: inv.id,
      institution_id: inv.institution_id,
      organization_id: inv.organization_unit_id ?? inv.institution_id,
      intended_role: inv.proposed_role_id ?? null,
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
    persistHumanIdentities(humans);

    const session = issueSession(user, { ...meta, authStrength: "ial1" });
    sessionId = session.session_id;

    declarePublicIdentity({
      human_id: userId,
      global_human_id: globalHumanId,
      public_name: input.public_name,
      preferred_short_name: input.preferred_short_name,
    });

    recordWave1Audit({
      event_type: "identity.human_created",
      actor_human_id: userId,
      subject_human_id: userId,
      institution_id: inv.institution_id,
      invitation_id: inv.id,
      sponsor_relationship_id: null,
      action: "human_created_via_invitation",
      previous_state: null,
      new_state: "active",
      reason: null,
      request_id: null,
      correlation_id: inv.correlation_id,
      result: "success",
    });
  }

  const membership = createProvisionalMembership({
    human_id: userId,
    global_human_id: globalHumanId,
    institution_id: inv.institution_id,
    invitation_id: inv.id,
    sponsor_human_id: inv.originating_sponsor_human_id,
    proposed_role_id: inv.proposed_role_id,
    organization_unit_id: inv.organization_unit_id,
  });

  startProvisionalPeriod(userId, inv.institution_id);
  evaluateAssuranceAndTrust(userId, inv.institution_id, inv.id);

  const sponsorRels = loadSponsorRelationships();
  if (!sponsorRels.find((r) => r.sponsored_user_id === userId && r.invitation_id === inv.id)) {
    sponsorRels.push({
      id: itlId("srel"),
      sponsor_id: inv.originating_sponsor_human_id,
      sponsored_user_id: userId,
      invitation_id: inv.id,
      institution_id: inv.institution_id,
      organization_id: inv.organization_unit_id ?? inv.institution_id,
      created_at: nowIso(),
      permanent: true,
    });
    persistSponsorRelationships(sponsorRels);
  }

  const invitations = loadWave1Invitations();
  const idx = invitations.findIndex((i) => i.id === inv.id);
  invitations[idx] = {
    ...invitations[idx],
    status: "accepted",
    accepted_at: nowIso(),
    accepted_human_id: userId,
  };
  persistWave1Invitations(invitations);

  recordWave1Audit({
    event_type: "invitation.accepted",
    actor_human_id: userId,
    subject_human_id: userId,
    institution_id: inv.institution_id,
    invitation_id: inv.id,
    sponsor_relationship_id: null,
    action: "invitation_accepted",
    previous_state: "acceptance_started",
    new_state: "accepted",
    reason: null,
    request_id: null,
    correlation_id: inv.correlation_id,
    result: "success",
  });

  recordWave1Audit({
    event_type: "sponsor.relationship_created",
    actor_human_id: inv.originating_sponsor_human_id,
    subject_human_id: userId,
    institution_id: inv.institution_id,
    invitation_id: inv.id,
    sponsor_relationship_id: null,
    action: "sponsor_lineage_attached",
    previous_state: null,
    new_state: "permanent",
    reason: null,
    request_id: null,
    correlation_id: inv.correlation_id,
    result: "success",
  });

  const rawRef = (input.referred_by ?? "").trim().toLowerCase();
  let referredBy: string | null = null;
  if (rawRef) {
    if (rawRef.startsWith("usr-")) referredBy = rawRef;
    else if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawRef)) referredBy = rawRef;
  }

  const network = createPersonalNetwork({
    user_id: userId,
    display_name: input.public_name,
    preferred_name: input.preferred_short_name ?? input.public_name.split(" ")[0] ?? input.public_name,
    referred_by: referredBy,
  });

  const hasPlace = Boolean(getHomePlaceForUser(userId));
  const next = hasPlace ? "/network" : "/choose-place";

  return {
    user_id: userId,
    global_human_id: globalHumanId,
    membership,
    session_id: sessionId,
    provisional: membership.status === "provisional",
    activated_role: membership.activated_role_id,
    proposed_role: membership.proposed_role_id,
    share_slug: network.share_slug,
    next,
  };
}
