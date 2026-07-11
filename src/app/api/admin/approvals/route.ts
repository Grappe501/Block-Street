import { NextResponse } from "next/server";
import { loadApprovals } from "@/lib/admin/data";
import { withAdmin } from "@/lib/admin/http";
import { approveRequest, assertAdminPermission } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "audit.view");
  return NextResponse.json({ approvals: loadApprovals() });
});
