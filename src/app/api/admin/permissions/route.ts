import { NextResponse } from "next/server";
import { loadPermissions } from "@/lib/admin/data";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "roles.view");
  return NextResponse.json({ permissions: loadPermissions() });
});
