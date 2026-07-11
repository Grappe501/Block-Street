import { NextRequest, NextResponse } from "next/server";
import { getInvitationByToken } from "@/lib/auth/invitations";
import { loadOrganizations, loadWorkspaces } from "@/lib/auth/data";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = getInvitationByToken(token);
  if (!invitation) {
    return NextResponse.json(
      { error: "This invitation is invalid, expired, or has already been used." },
      { status: 404 }
    );
  }
  const org = loadOrganizations().find((o) => o.organization_id === invitation.organization_id);
  const ws = invitation.workspace_id
    ? loadWorkspaces().find((w) => w.workspace_id === invitation.workspace_id)
    : null;
  return NextResponse.json({
    invitation: {
      id: invitation.id,
      email: invitation.email,
      organization_name: org?.name,
      workspace_name: ws?.name,
      role_id: invitation.role_id,
      expires_at: invitation.expires_at,
      message: invitation.message_optional,
    },
  });
}
