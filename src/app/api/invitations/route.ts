import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, listInvitations, resolveMemberships } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";
import { AdminError, assertAdminPermission, resolveAdminContext } from "@/lib/admin/engine";
import { createWave1Invitation } from "@/lib/identity-trust/wave1/engine";
import { loadWave1Flags } from "@/lib/identity-trust/wave1/data";

export async function GET(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const orgId = request.nextUrl.searchParams.get("organization_id") ?? undefined;
    const adminCtx = resolveAdminContext(session);
    const memberships = resolveMemberships(session.user_id);
    const allowedOrgIds = new Set(memberships.map((m) => m.organization_id));

    if (orgId) {
      const platformScope = adminCtx.scopes.some((s) => s.type === "platform");
      if (!platformScope && !allowedOrgIds.has(orgId) && !adminCtx.effective_permissions.includes("users.view")) {
        throw new AdminError("You do not have permission to view invitations for this organization", 403);
      }
      return NextResponse.json({ invitations: listInvitations(orgId) });
    }

    assertAdminPermission(adminCtx, "users.view");
    return NextResponse.json({ invitations: listInvitations() });
  } catch (e) {
    if (e instanceof AdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return authErrorResponse(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const body = await request.json();
    const flags = loadWave1Flags();

    if (flags.INVITATION_ONLY_ENTRY_REQUIRED) {
      const { email, organization_id, institution_id, intended_recipient_name, invitation_purpose, relationship_basis, primary_attestation, secondary_attestation, workspace_id, proposed_role_id } = body as Record<string, unknown>;
      if (!primary_attestation || !secondary_attestation) {
        return NextResponse.json({ error: "Sponsor attestation is required before sending invitations." }, { status: 400 });
      }
      const result = createWave1Invitation({
        sponsor_human_id: session.user_id,
        institution_id: (institution_id as string) ?? (organization_id as string),
        organization_unit_id: organization_id as string,
        workspace_id: workspace_id as string | undefined,
        intended_recipient_name: (intended_recipient_name as string) ?? (email as string).split("@")[0],
        recipient_email: email as string,
        proposed_role_id: proposed_role_id as string | undefined,
        invitation_purpose: (invitation_purpose as string) ?? "Institution membership",
        relationship_basis: (relationship_basis as Parameters<typeof createWave1Invitation>[0]["relationship_basis"]) ?? "other_directly_known",
        primary_attestation: Boolean(primary_attestation),
        secondary_attestation: Boolean(secondary_attestation),
      });
      return NextResponse.json({
        invitation: { ...result.invitation, token_hash: undefined },
        accept_url: `/invitations/accept?token=${result.token}`,
        dev_token: process.env.NODE_ENV !== "production" ? result.token : undefined,
      });
    }

    return NextResponse.json({ error: "Legacy invitation creation is disabled. Use Wave 1 sponsor flow." }, { status: 403 });
  } catch (e) {
    return authErrorResponse(e);
  }
}
