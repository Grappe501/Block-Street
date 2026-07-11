import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, createInvitation, listInvitations } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function GET(request: NextRequest) {
  try {
    assertAuthenticated(request.headers.get("cookie"));
    const orgId = request.nextUrl.searchParams.get("organization_id") ?? undefined;
    return NextResponse.json({ invitations: listInvitations(orgId) });
  } catch (e) {
    return authErrorResponse(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const body = await request.json();
    const { email, organization_id, workspace_id, role_id, message } = body as {
      email: string;
      organization_id: string;
      workspace_id?: string;
      role_id?: string;
      message?: string;
    };
    if (!email || !organization_id) {
      return NextResponse.json({ error: "email and organization_id required" }, { status: 400 });
    }
    const { invitation, token } = createInvitation({
      email,
      organization_id,
      workspace_id,
      role_id,
      invited_by: session.user_id,
      message,
    });
    return NextResponse.json({
      invitation: { ...invitation, invitation_token_hash: undefined },
      accept_url: `/invitations/accept?token=${token}`,
      dev_token: process.env.NODE_ENV !== "production" ? token : undefined,
    });
  } catch (e) {
    return authErrorResponse(e);
  }
}
