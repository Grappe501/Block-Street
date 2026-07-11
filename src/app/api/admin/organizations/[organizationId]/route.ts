import { NextRequest, NextResponse } from "next/server";
import { loadOrganizations } from "@/lib/auth/data";
import { assertAuthenticated } from "@/lib/auth/engine";
import { adminAudit, assertAdminPermission, assertScopeAccess, AdminError, resolveAdminContext } from "@/lib/admin/engine";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ organizationId: string }> }) {
  try {
    const session = assertAuthenticated(_request.headers.get("cookie"));
    const ctx = resolveAdminContext(session);
    const { organizationId } = await params;
    assertAdminPermission(ctx, "organizations.view");
    assertScopeAccess(ctx, "organization", organizationId);
    const org = loadOrganizations().find((o) => o.organization_id === organizationId);
    if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    return NextResponse.json({ organization: org });
  } catch (e) {
    if (e instanceof AdminError) return NextResponse.json({ error: e.message }, { status: e.status });
    const err = e as { message?: string; status?: number };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ organizationId: string }> }) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const ctx = resolveAdminContext(session);
    const { organizationId } = await params;
    assertAdminPermission(ctx, "organizations.update");
    assertScopeAccess(ctx, "organization", organizationId);
    const body = await request.json();
    adminAudit(ctx, "organization_updated", "organization", organizationId, "success", { reason: body.reason });
    return NextResponse.json({ ok: true, organization_id: organizationId, patch: body });
  } catch (e) {
    if (e instanceof AdminError) return NextResponse.json({ error: e.message }, { status: e.status });
    const err = e as { message?: string; status?: number };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}
