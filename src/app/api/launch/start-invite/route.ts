import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import {
  hydrateAuthStore,
  loadUsers,
  loadWorkspaceMemberships,
  clearAuthCache,
  DATA_DIR,
  loadInvitations,
} from "@/lib/auth/data";
import { hydrateIdentityTrustStore, clearIdentityTrustCache } from "@/lib/identity-trust/data";
import { createWave1Invitation } from "@/lib/identity-trust/wave1/engine";
import { clearWave1Cache, flushWave1StoreToBlobs } from "@/lib/identity-trust/wave1/data";
import { getSessionFromRequest } from "@/lib/auth/session";
import { invalidateDurableNamespace, writeDurableTextAsync } from "@/lib/persist/durable-json";

async function refreshInviteStores() {
  invalidateDurableNamespace("auth");
  invalidateDurableNamespace("identity-trust");
  clearAuthCache();
  clearIdentityTrustCache();
  clearWave1Cache();
  await hydrateAuthStore();
  await hydrateIdentityTrustStore();
}

export async function POST(request: NextRequest) {
  await refreshInviteStores();

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

  const rawName = body.name?.trim();
  let intendedName = rawName || "";
  if (!intendedName) {
    const local = body.email.trim().split("@")[0] || "Friend";
    const parts = local.replace(/[._+-]+/g, " ").trim().split(/\s+/);
    intendedName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
    if (!/\s/.test(intendedName)) intendedName = `${intendedName} Guest`;
  }

  try {
    const result = createWave1Invitation({
      sponsor_human_id: session.user_id,
      institution_id: "inst-block-street",
      organization_unit_id: "org-block-street",
      intended_recipient_name: intendedName,
      recipient_email: body.email.trim(),
      proposed_role_id: "member",
      invitation_purpose: body.reason?.trim() || "Launch chain — personally known to Steve Grappe",
      relationship_basis: "other_directly_known",
      primary_attestation: true,
      secondary_attestation: true,
    });

    await flushWave1StoreToBlobs();
    await writeDurableTextAsync(
      "auth",
      "invitations.json",
      JSON.stringify({ invitations: loadInvitations() }, null, 2),
      join(DATA_DIR, "invitations.json")
    );

    const acceptPath = `/invite/${result.token}`;
    return NextResponse.json({
      ok: true,
      token: result.token,
      accept_url: acceptPath,
      invitation_id: result.invitation.id,
      message:
        "Copy this link and send it. When they join, they choose their school or county — then the map goes away.",
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invite failed" }, { status: 400 });
  }
}
