import { NextResponse } from "next/server";
import { loadWorkspaces } from "@/lib/auth/data";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "workspaces.view");
  let workspaces = loadWorkspaces();
  if (!ctx.scopes.some((s) => s.type === "platform")) {
    const orgIds = ctx.scopes.filter((s) => s.type === "organization").map((s) => s.id);
    workspaces = workspaces.filter((w) => orgIds.includes(w.organization_id));
  }
  return NextResponse.json({ workspaces });
});
