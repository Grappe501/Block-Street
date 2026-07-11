import { NextResponse } from "next/server";
import { simulateRole } from "@/lib/admin/permissions";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission } from "@/lib/admin/engine";

export const POST = withAdmin(async (ctx, request) => {
  assertAdminPermission(ctx, "roles.view");
  const body = await request.json();
  const { role_id } = body as { role_id: string };
  const simulation = simulateRole(role_id);
  if (!simulation) return NextResponse.json({ error: "Role not found" }, { status: 404 });
  return NextResponse.json({ simulation });
});
