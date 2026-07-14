import { NextRequest, NextResponse } from "next/server";
import { hydrateAuthStore, loadUsers, loadWorkspaceMemberships } from "@/lib/auth/data";
import { hydrateIdentityTrustStore } from "@/lib/identity-trust/data";
import { createTrustInvitation } from "@/lib/identity-trust/engine";
import { getSessionFromRequest } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  await hydrateAuthStore();
  await hydrateIdentityTrustStore();

  const session = getSessionFromRequest(request.headers.get("cookie"));
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const user = loadUsers().find((u) => u.user_id === session.user_id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const memberships = loadWorkspaceMemberships().filter(
    (m) => m.user_id === session.user_id && m.status === "active"
  );
  const isAdmin = memberships.some(
    (m) => m.roles?.includes("platform_administrator") || m.permissions?.includes("admin:*")
  );
  if (!isAdmin && user.primary_email !== "grappe4arkansas@gmail.com") {
    return NextResponse.json(
      { error: "Only the system administrator can start the invite chain from here" },
      { status: 403 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    name?: string;
    reason?: string;
  };

  if (!body.email?.trim()) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  try {
    const result = createTrustInvitation({
      email: body.email.trim(),
      organization_id: "org-block-street",
      institution_id: "inst-block-street",
      intended_role: "member",
      invite_reason: body.reason?.trim() || "Launch chain — personally known to Steve Grappe",
      sponsor_id: session.user_id,
      sponsor_agreement_accepted: true,
      message: body.name ? `Welcome to Block Street, ${body.name}` : "Welcome to Block Street",
    });

    return NextResponse.json({
      ok: true,
      token: result.token,
      accept_url: result.accept_url || `/invite/${result.token}`,
      invitation_id: result.invitation.id,
      message: "Copy this link and send it. When they join, they choose their school or county — then the map goes away.",
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invite failed" }, { status: 400 });
  }
}
