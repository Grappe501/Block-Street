import { NextResponse } from "next/server";
import { loadRoles } from "@/lib/admin/data";
import { permissionsForRoles } from "@/lib/admin/permissions";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "roles.view");
  const roles = loadRoles().map((role) => ({
    ...role,
    permissions: permissionsForRoles([role.id]),
  }));
  return NextResponse.json({ roles });
});
