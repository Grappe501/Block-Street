import { loadHumanIdentities, loadFederationMemberships } from "../data";
import { itlId, nowIso } from "../utils";
import {
  loadFederationMembershipsV4,
  persistFederationMembershipsV4,
  loadMembershipTransfers,
  persistMembershipTransfers,
} from "./data";
import type { FederationInstitutionMembership, MembershipTransfer } from "./types";
import { assertWave4OperationsEnabled } from "./wave-prerequisite";
import { recordAssuranceReceipt } from "./assurance";

export function createFederationMembership(input: {
  human_id: string;
  institution_id: string;
  organization_id: string;
  role: string;
  permissions?: string[];
  membership_path?: FederationInstitutionMembership["membership_path"];
  membership_type?: string;
  created_by_human_id: string;
  originating_invitation_id?: string;
}): FederationInstitutionMembership {
  assertWave4OperationsEnabled("Create federation membership");
  const identity = loadHumanIdentities().find((h) => h.user_id === input.human_id);
  if (!identity) throw new Error("Human not found");

  const existing = loadFederationMembershipsV4().find(
    (m) =>
      m.human_id === input.human_id &&
      m.institution_id === input.institution_id &&
      !["ended", "archived"].includes(m.membership_status)
  );
  if (existing) return existing;

  const membership: FederationInstitutionMembership = {
    id: itlId("fmem"),
    human_id: input.human_id,
    global_human_id: identity.global_human_id,
    institution_id: input.institution_id,
    organization_id: input.organization_id,
    originating_invitation_id: input.originating_invitation_id ?? null,
    membership_path: input.membership_path ?? "direct_invitation",
    membership_type: input.membership_type ?? "primary",
    membership_status: "active",
    institution_trust_state: "member",
    primary_unit_id: null,
    role: input.role,
    permissions: input.permissions ?? ["read:basic"],
    joined_at: nowIso(),
    provisional_until: null,
    ended_at: null,
    created_by_human_id: input.created_by_human_id,
  };

  const all = loadFederationMembershipsV4();
  all.push(membership);
  persistFederationMembershipsV4(all);
  recordAssuranceReceipt({
    institution_id: input.institution_id,
    human_id: input.human_id,
    membership_id: membership.id,
  });
  return membership;
}

export function endFederationMembership(membershipId: string, reason?: string): FederationInstitutionMembership {
  const memberships = loadFederationMembershipsV4();
  const idx = memberships.findIndex((m) => m.id === membershipId);
  if (idx < 0) throw new Error("Membership not found");

  memberships[idx] = {
    ...memberships[idx],
    membership_status: "ended",
    ended_at: nowIso(),
  };
  persistFederationMembershipsV4(memberships);
  return memberships[idx];
}

export function listMyInstitutions(humanId: string) {
  const v4 = loadFederationMembershipsV4().filter((m) => m.human_id === humanId);
  if (v4.length > 0) {
    return v4.map((m) => ({
      institution_id: m.institution_id,
      membership_id: m.id,
      membership_status: m.membership_status,
      institution_trust_state: m.institution_trust_state,
      role: m.role,
      joined_at: m.joined_at,
    }));
  }
  return loadFederationMemberships()
    .filter((m) => m.user_id === humanId && m.status === "active")
    .map((m) => ({
      institution_id: m.institution_id,
      membership_id: m.id,
      membership_status: "active" as const,
      institution_trust_state: "member",
      role: m.role,
      joined_at: m.joined_at,
    }));
}

export function requestMembershipTransfer(input: {
  human_id: string;
  source_membership_id: string;
  destination_institution_id: string;
  transfer_type: string;
  requested_by: string;
}): MembershipTransfer {
  assertWave4OperationsEnabled("Membership transfer");
  const transfer: MembershipTransfer = {
    id: itlId("mtrans"),
    human_id: input.human_id,
    source_membership_id: input.source_membership_id,
    destination_institution_id: input.destination_institution_id,
    transfer_type: input.transfer_type,
    requested_by: input.requested_by,
    status: "requested",
    requested_at: nowIso(),
    completed_at: null,
  };
  const all = loadMembershipTransfers();
  all.push(transfer);
  persistMembershipTransfers(all);
  return transfer;
}

export function completeMembershipTransfer(transferId: string, actorId: string): FederationInstitutionMembership {
  const transfers = loadMembershipTransfers();
  const idx = transfers.findIndex((t) => t.id === transferId);
  if (idx < 0) throw new Error("Transfer not found");
  const transfer = transfers[idx];
  if (transfer.status !== "approved" && transfer.status !== "requested") {
    throw new Error("Transfer not approved");
  }

  const source = loadFederationMembershipsV4().find((m) => m.id === transfer.source_membership_id);
  if (!source) throw new Error("Source membership not found");

  endFederationMembership(source.id);
  const dest = createFederationMembership({
    human_id: transfer.human_id,
    institution_id: transfer.destination_institution_id,
    organization_id: transfer.destination_institution_id,
    role: "member",
    membership_path: "approved_transfer",
    created_by_human_id: actorId,
  });

  transfers[idx] = { ...transfer, status: "completed", completed_at: nowIso() };
  persistMembershipTransfers(transfers);
  return dest;
}

export function migrateLegacyMemberships() {
  const legacy = loadFederationMemberships().filter((m) => m.status === "active");
  const v4 = loadFederationMembershipsV4();
  let migrated = 0;
  for (const m of legacy) {
    const exists = v4.some(
      (x) => x.human_id === m.user_id && x.institution_id === m.institution_id && x.membership_status !== "ended"
    );
    if (!exists) {
      createFederationMembership({
        human_id: m.user_id,
        institution_id: m.institution_id,
        organization_id: m.organization_id,
        role: m.role,
        permissions: m.permissions,
        membership_path: "legacy_reconciliation",
        created_by_human_id: m.user_id,
      });
      migrated++;
    }
  }
  return { migrated };
}
