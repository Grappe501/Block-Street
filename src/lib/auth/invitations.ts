import { randomBytes } from "crypto";
import {
  appendAudit,
  loadInvitations,
  loadOrgMemberships,
  loadUsers,
  loadWorkspaceMemberships,
  persistInvitations,
  persistOrgMemberships,
  persistWorkspaceMemberships,
} from "./data";
import { hashSecret } from "./crypto";
import type { IdentityInvitation } from "./types";

export function createInvitation(input: {
  email: string;
  organization_id: string;
  workspace_id?: string | null;
  role_id?: string | null;
  invited_by: string;
  message?: string;
  expires_hours?: number;
}): { invitation: IdentityInvitation; token: string } {
  const token = randomBytes(24).toString("hex");
  const now = new Date();
  const expires = new Date(now.getTime() + (input.expires_hours ?? 168) * 3600000);
  const invitation: IdentityInvitation = {
    id: `inv-${randomBytes(8).toString("hex")}`,
    email: input.email.toLowerCase(),
    organization_id: input.organization_id,
    workspace_id: input.workspace_id ?? null,
    role_id: input.role_id ?? null,
    invited_by: input.invited_by,
    invitation_token_hash: hashSecret(token),
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
    accepted_at: null,
    revoked_at: null,
    status: "sent",
    message_optional: input.message ?? null,
  };
  const invitations = loadInvitations();
  invitations.push(invitation);
  persistInvitations(invitations);
  appendAudit({
    event_type: "invitation_sent",
    actor_type: "user",
    actor_id: input.invited_by,
    action: "invitation_sent",
    target_type: "invitation",
    target_id: invitation.id,
    result: "success",
    organization_id_optional: input.organization_id,
  });
  return { invitation, token };
}

export function getInvitationByToken(token: string): IdentityInvitation | null {
  const hash = hashSecret(token);
  const inv = loadInvitations().find((i) => i.invitation_token_hash === hash);
  if (!inv) return null;
  if (inv.status === "revoked" || inv.status === "accepted") return null;
  if (new Date(inv.expires_at).getTime() < Date.now()) return null;
  return inv;
}

export function listInvitations(organizationId?: string): IdentityInvitation[] {
  const all = loadInvitations();
  if (!organizationId) return all;
  return all.filter((i) => i.organization_id === organizationId);
}

export function acceptInvitation(
  token: string,
  userId: string
): { ok: true; invitation: IdentityInvitation } | { ok: false; error: string } {
  const inv = getInvitationByToken(token);
  if (!inv) return { ok: false, error: "This invitation is invalid, expired, or has already been used." };

  const user = loadUsers().find((u) => u.user_id === userId);
  if (!user) return { ok: false, error: "User not found" };
  if (user.primary_email.toLowerCase() !== inv.email.toLowerCase()) {
    return { ok: false, error: "This invitation was sent to a different email address." };
  }

  const now = new Date().toISOString();
  const orgMemberships = loadOrgMemberships();
  let orgMem = orgMemberships.find(
    (m) => m.user_id === userId && m.organization_id === inv.organization_id
  );
  if (!orgMem) {
    orgMem = {
      id: `orgmem-${randomBytes(6).toString("hex")}`,
      organization_id: inv.organization_id,
      user_id: userId,
      membership_status: "active",
      membership_type: "invited",
      joined_at: now,
      invited_at: inv.created_at,
      invited_by: inv.invited_by,
      approved_at: now,
      approved_by: inv.invited_by,
      primary_role_id: inv.role_id,
      title_optional: null,
      department_optional: null,
    };
    orgMemberships.push(orgMem);
    persistOrgMemberships(orgMemberships);
  }

  if (inv.workspace_id) {
    const wsMemberships = loadWorkspaceMemberships();
    const exists = wsMemberships.find(
      (m) => m.user_id === userId && m.workspace_id === inv.workspace_id
    );
    if (!exists) {
      wsMemberships.push({
        id: `wsmem-${randomBytes(6).toString("hex")}`,
        workspace_id: inv.workspace_id,
        user_id: userId,
        organization_membership_id: orgMem.id,
        status: "active",
        role_id: inv.role_id ?? "member",
        roles: inv.role_id ? [inv.role_id] : ["member"],
        permissions: ["read:basic"],
        joined_at: now,
        ended_at: null,
        access_expiration: null,
      });
      persistWorkspaceMemberships(wsMemberships);
    }
  }

  const invitations = loadInvitations();
  const idx = invitations.findIndex((i) => i.id === inv.id);
  invitations[idx] = { ...invitations[idx], status: "accepted", accepted_at: now };
  persistInvitations(invitations);

  appendAudit({
    event_type: "invitation_accepted",
    actor_type: "user",
    actor_id: userId,
    action: "invitation_accepted",
    target_type: "invitation",
    target_id: inv.id,
    result: "success",
    organization_id_optional: inv.organization_id,
    workspace_id_optional: inv.workspace_id ?? undefined,
  });

  return { ok: true, invitation: invitations[idx] };
}

export function revokeInvitation(invitationId: string, actorId: string): boolean {
  const invitations = loadInvitations();
  const idx = invitations.findIndex((i) => i.id === invitationId);
  if (idx < 0) return false;
  invitations[idx] = {
    ...invitations[idx],
    status: "revoked",
    revoked_at: new Date().toISOString(),
  };
  persistInvitations(invitations);
  appendAudit({
    event_type: "invitation_revoked",
    actor_type: "user",
    actor_id: actorId,
    action: "invitation_revoked",
    target_type: "invitation",
    target_id: invitationId,
    result: "success",
  });
  return true;
}
