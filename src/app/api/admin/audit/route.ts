import { NextResponse } from "next/server";
import { readAdminAudit } from "@/lib/admin/data";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "audit.view");
  return NextResponse.json({ events: readAdminAudit(100) });
});
