import { recordIdentityTrustAudit } from "./audit";
import {
  loadFederationMemberships,
  loadHumanIdentities,
  persistFederationMemberships,
  persistHumanIdentities,
} from "./data";
import { appendIdentityHistory } from "./history";
import type { FederationIdentityView, InstitutionMembership } from "./types";
import { itlId, nowIso } from "./utils";
import { assertWave1Foundation } from "./wave1/wave-prerequisite";
import { assertWave2Foundation } from "./wave2/engine";
import { assertWave3Foundation } from "./wave3/engine";
import {
  createFederationMembership,
  endFederationMembership,
  listMyInstitutions,
  completeMembershipTransfer,
  requestMembershipTransfer,
} from "./wave4/memberships";
import { getActiveContext, switchInstitutionContext, validateInstitutionContext } from "./wave4/context";
import { getPortableAssuranceForHuman, getPublicAssuranceClaims } from "./wave4/assurance";
import { assertWave4Foundation, isWave4FoundationComplete } from "./wave4/engine";

export function addInstitutionMembership(input: {
  global_human_id: string;
  user_id: string;
  institution_id: string;
  organization_id: string;
  role: string;
  permissions?: string[];
}): InstitutionMembership {
  if (isWave4FoundationComplete()) {
    const m = createFederationMembership({
      human_id: input.user_id,
      institution_id: input.institution_id,
      organization_id: input.organization_id,
      role: input.role,
      permissions: input.permissions,
      created_by_human_id: input.user_id,
      membership_path: "direct_invitation",
    });
    return {
      id: m.id,
      global_human_id: m.global_human_id,
      user_id: m.human_id,
      institution_id: m.institution_id,
      organization_id: m.organization_id,
      role: m.role,
      permissions: m.permissions,
      joined_at: m.joined_at,
      status: m.membership_status === "ended" ? "ended" : "active",
    };
  }

  const existing = loadFederationMemberships().find(
    (m) => m.user_id === input.user_id && m.institution_id === input.institution_id && m.status === "active"
  );
  if (existing) return existing;

  const membership: InstitutionMembership = {
    id: itlId("imem"),
    global_human_id: input.global_human_id,
    user_id: input.user_id,
    institution_id: input.institution_id,
    organization_id: input.organization_id,
    role: input.role,
    permissions: input.permissions ?? ["read:basic"],
    joined_at: nowIso(),
    status: "active",
  };

  const memberships = loadFederationMemberships();
  memberships.push(membership);
  persistFederationMemberships(memberships);

  appendIdentityHistory({
    global_human_id: input.global_human_id,
    user_id: input.user_id,
    event_type: "institution_joined",
    actor_id: input.user_id,
    summary: `Joined institution ${input.institution_id}`,
    details: { organization_id: input.organization_id, role: input.role },
  });

  recordIdentityTrustAudit({
    actor_id: input.user_id,
    global_human_id: input.global_human_id,
    action: "federation_membership_added",
    target_user_id: input.user_id,
    target_invitation_id: null,
    organization_id: input.organization_id,
    institution_id: input.institution_id,
    result: "success",
  });

  return membership;
}

export function transferInstitutionMembership(input: {
  membership_id: string;
  new_institution_id: string;
  new_organization_id: string;
  actor_id: string;
}): InstitutionMembership {
  if (isWave4FoundationComplete()) {
    const transfer = requestMembershipTransfer({
      human_id: input.actor_id,
      source_membership_id: input.membership_id,
      destination_institution_id: input.new_institution_id,
      transfer_type: "institutional_transfer",
      requested_by: input.actor_id,
    });
    const m = completeMembershipTransfer(transfer.id, input.actor_id);
    return {
      id: m.id,
      global_human_id: m.global_human_id,
      user_id: m.human_id,
      institution_id: m.institution_id,
      organization_id: m.organization_id,
      role: m.role,
      permissions: m.permissions,
      joined_at: m.joined_at,
      status: "active",
    };
  }

  const memberships = loadFederationMemberships();
  const idx = memberships.findIndex((m) => m.id === input.membership_id);
  if (idx < 0) throw new Error("Membership not found");

  memberships[idx] = { ...memberships[idx], status: "transferred" };
  const newMembership = addInstitutionMembership({
    global_human_id: memberships[idx].global_human_id,
    user_id: memberships[idx].user_id,
    institution_id: input.new_institution_id,
    organization_id: input.new_organization_id,
    role: memberships[idx].role,
    permissions: memberships[idx].permissions,
  });

  appendIdentityHistory({
    global_human_id: memberships[idx].global_human_id,
    user_id: memberships[idx].user_id,
    event_type: "institution_transferred",
    actor_id: input.actor_id,
    summary: `Transferred to ${input.new_institution_id}`,
  });

  persistFederationMemberships(memberships);
  return newMembership;
}

export function grantFederationTrust(userId: string, actorId: string) {
  assertWave1Foundation("Federation Identity (Wave 4)");
  assertWave2Foundation("Federation Identity (Wave 4)");
  assertWave3Foundation("Federation Identity (Wave 4)");
  assertWave4Foundation("Federation trust grant");
  const identities = loadHumanIdentities();
  const idx = identities.findIndex((i) => i.user_id === userId);
  if (idx < 0) throw new Error("Identity not found");

  identities[idx] = {
    ...identities[idx],
    federation_trusted: true,
    trust_level: 5,
    trust_label: "federation_trusted",
    public_badge: "Federation Trusted",
    updated_at: nowIso(),
  };
  persistHumanIdentities(identities);

  getPortableAssuranceForHuman(userId);

  appendIdentityHistory({
    global_human_id: identities[idx].global_human_id,
    user_id: userId,
    event_type: "federation_trusted",
    actor_id: actorId,
    summary: "Granted federation trusted status",
  });
}

export function getFederationIdentityView(userId: string): FederationIdentityView | null {
  const identity = loadHumanIdentities().find((i) => i.user_id === userId);
  if (!identity) return null;

  if (isWave4FoundationComplete()) {
    const institutions = listMyInstitutions(userId);
    const memberships: InstitutionMembership[] = institutions.map((i) => ({
      id: i.membership_id,
      global_human_id: identity.global_human_id,
      user_id: userId,
      institution_id: i.institution_id,
      organization_id: i.institution_id,
      role: i.role,
      permissions: ["read:basic"],
      joined_at: i.joined_at,
      status: i.membership_status === "ended" ? "ended" : "active",
    }));
    return {
      global_human_id: identity.global_human_id,
      user_id: userId,
      public_name: identity.public_name,
      memberships,
      federation_trusted: identity.federation_trusted,
      active_context: getActiveContext(userId),
      portable_assurance: getPublicAssuranceClaims(userId),
    } as FederationIdentityView & { active_context?: unknown; portable_assurance?: unknown };
  }

  const memberships = loadFederationMemberships().filter((m) => m.user_id === userId && m.status === "active");
  return {
    global_human_id: identity.global_human_id,
    user_id: userId,
    public_name: identity.public_name,
    memberships,
    federation_trusted: identity.federation_trusted,
  };
}

export function listFederationMemberships(institutionId?: string) {
  if (isWave4FoundationComplete()) {
    const { loadFederationMembershipsV4 } = require("./wave4/data") as typeof import("./wave4/data");
    const all = loadFederationMembershipsV4().filter((m) => !["ended", "archived"].includes(m.membership_status));
    return institutionId ? all.filter((m) => m.institution_id === institutionId) : all;
  }
  const all = loadFederationMemberships().filter((m) => m.status === "active");
  return institutionId ? all.filter((m) => m.institution_id === institutionId) : all;
}

export function enterInstitutionContext(userId: string, institutionId: string, sessionId: string) {
  return switchInstitutionContext({
    human_id: userId,
    institution_id: institutionId,
    session_id: sessionId,
  });
}

export function leaveInstitutionMembership(membershipId: string) {
  return endFederationMembership(membershipId);
}

export { validateInstitutionContext, getActiveContext };
