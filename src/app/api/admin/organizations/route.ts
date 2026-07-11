import { NextResponse } from "next/server";
import { loadOrganizations } from "@/lib/auth/data";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission, assertScopeAccess } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "organizations.view");
  let orgs = loadOrganizations();
  if (!ctx.scopes.some((s) => s.type === "platform")) {
    const allowed = ctx.scopes.filter((s) => s.type === "organization").map((s) => s.id);
    orgs = orgs.filter((o) => allowed.includes(o.organization_id));
  }
  return NextResponse.json({ organizations: orgs });
});
