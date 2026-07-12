import { createHash, randomBytes } from "crypto";
import { loadHumanIdentities } from "../data";
import { appendIdentityHistory } from "../history";
import { itlId, nowIso } from "../utils";
import { recordAssuranceReceipt } from "./assurance";
import {
  loadCrossInstitutionInvitations,
  loadFederationMembershipsV4,
  persistCrossInstitutionInvitations,
  persistFederationMembershipsV4,
  loadFederationAuditEvents,
  persistFederationAuditEvents,
} from "./data";
import type { CrossInstitutionInvitation, FederationInstitutionMembership } from "./types";
import { assertWave4OperationsEnabled } from "./wave-prerequisite";
import { switchInstitutionContext } from "./context";

function audit(event: Record<string, unknown>) {
  const events = loadFederationAuditEvents();
  events.push({ id: itlId("fed-audit"), ...event, timestamp: nowIso() });
  persistFederationAuditEvents(events);
}

export function createCrossInstitutionInvitation(input: {
  inviting_institution_id: string;
  sponsor_human_id: string;
  intended_recipient_name: string;
  recipient_contact: string;
  proposed_membership_type: string;
  proposed_role?: string;
  existing_human_candidate_id?: string;
  portable_assurance_requested?: boolean;
  local_verification_required?: boolean;
}): CrossInstitutionInvitation {
  assertWave4OperationsEnabled("Cross-institution invitation");
  const token = randomBytes(24).toString("hex");
  const invitation: CrossInstitutionInvitation = {
    id: itlId("xinv"),
    public_invitation_id: itlId("pub-inv"),
    inviting_institution_id: input.inviting_institution_id,
    sponsor_human_id: input.sponsor_human_id,
    intended_recipient_name: input.intended_recipient_name,
    recipient_contact: input.recipient_contact,
    existing_human_candidate_id: input.existing_human_candidate_id ?? null,
    proposed_membership_type: input.proposed_membership_type,
    proposed_role: input.proposed_role ?? null,
    portable_assurance_requested: input.portable_assurance_requested ?? true,
    local_verification_required: input.local_verification_required ?? false,
    federation_agreement_id: null,
    status: "sent",
    token_hash: createHash("sha256").update(token).digest("hex"),
    created_at: nowIso(),
    expires_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    accepted_at: null,
    linked_human_id: null,
  };

  const all = loadCrossInstitutionInvitations();
  all.push(invitation);
  persistCrossInstitutionInvitations(all);

  audit({
    event_type: "federation.membership_invited",
    invitation_id: invitation.id,
    institution_id: input.inviting_institution_id,
    sponsor_human_id: input.sponsor_human_id,
  });

  return { ...invitation, token_hash: token } as CrossInstitutionInvitation & { token?: string };
}

export function acceptCrossInstitutionInvitation(input: {
  invitation_id: string;
  human_id: string;
  session_id: string;
}): FederationInstitutionMembership {
  assertWave4OperationsEnabled("Accept cross-institution invitation");
  const invitations = loadCrossInstitutionInvitations();
  const idx = invitations.findIndex((i) => i.id === input.invitation_id);
  if (idx < 0) throw new Error("Invitation not found");

  const inv = invitations[idx];
  if (inv.status !== "sent" && inv.status !== "viewed") throw new Error("Invitation not available");
  if (new Date(inv.expires_at) < new Date()) {
    invitations[idx] = { ...inv, status: "expired" };
    persistCrossInstitutionInvitations(invitations);
    throw new Error("Invitation expired");
  }

  const identity = loadHumanIdentities().find((h) => h.user_id === input.human_id);
  if (!identity) throw new Error("Human not found — secure linking required");

  if (inv.existing_human_candidate_id && inv.existing_human_candidate_id !== input.human_id) {
    audit({ event_type: "federation.identity_conflict_opened", invitation_id: inv.id });
    throw new Error("Existing-human resolution conflict — governance review required");
  }

  const existing = loadFederationMembershipsV4().find(
    (m) => m.human_id === input.human_id && m.institution_id === inv.inviting_institution_id && m.membership_status !== "ended"
  );
  if (existing) return existing;

  audit({ event_type: "federation.identity_existing_human_detected", human_id: input.human_id, invitation_id: inv.id });

  const membership: FederationInstitutionMembership = {
    id: itlId("fmem"),
    human_id: input.human_id,
    global_human_id: identity.global_human_id,
    institution_id: inv.inviting_institution_id,
    organization_id: inv.inviting_institution_id,
    originating_invitation_id: inv.id,
    membership_path: "cross_institution_invitation",
    membership_type: inv.proposed_membership_type,
    membership_status: inv.local_verification_required ? "provisional" : "active",
    institution_trust_state: "provisional_member",
    primary_unit_id: null,
    role: inv.proposed_role ?? "member",
    permissions: ["read:basic"],
    joined_at: nowIso(),
    provisional_until: inv.local_verification_required
      ? new Date(Date.now() + 30 * 86400000).toISOString()
      : null,
    ended_at: null,
    created_by_human_id: inv.sponsor_human_id,
  };

  const memberships = loadFederationMembershipsV4();
  memberships.push(membership);
  persistFederationMembershipsV4(memberships);

  invitations[idx] = {
    ...inv,
    status: "accepted",
    accepted_at: nowIso(),
    linked_human_id: input.human_id,
  };
  persistCrossInstitutionInvitations(invitations);

  recordAssuranceReceipt({
    institution_id: inv.inviting_institution_id,
    human_id: input.human_id,
    membership_id: membership.id,
  });

  appendIdentityHistory({
    global_human_id: identity.global_human_id,
    user_id: input.human_id,
    event_type: "institution_joined",
    actor_id: input.human_id,
    summary: `Cross-institution membership at ${inv.inviting_institution_id}`,
    details: { invitation_id: inv.id, membership_path: "cross_institution_invitation" },
  });

  audit({
    event_type: "federation.membership_accepted",
    human_id: input.human_id,
    institution_id: inv.inviting_institution_id,
    membership_id: membership.id,
  });
  audit({ event_type: "federation.membership_created", membership_id: membership.id });

  switchInstitutionContext({
    human_id: input.human_id,
    institution_id: inv.inviting_institution_id,
    session_id: input.session_id,
  });

  return membership;
}

export function declineCrossInstitutionInvitation(invitationId: string) {
  const invitations = loadCrossInstitutionInvitations();
  const idx = invitations.findIndex((i) => i.id === invitationId);
  if (idx < 0) throw new Error("Invitation not found");
  invitations[idx] = { ...invitations[idx], status: "declined" };
  persistCrossInstitutionInvitations(invitations);
}

export function listCrossInstitutionInvitationsForHuman(humanId: string) {
  const identity = loadHumanIdentities().find((h) => h.user_id === humanId);
  return loadCrossInstitutionInvitations().filter(
    (i) =>
      i.linked_human_id === humanId ||
      i.existing_human_candidate_id === humanId ||
      (identity && i.recipient_contact && identity.public_name.toLowerCase().includes(i.intended_recipient_name.toLowerCase()))
  );
}

export function getCrossInstitutionInvitation(id: string) {
  return loadCrossInstitutionInvitations().find((i) => i.id === id) ?? null;
}
