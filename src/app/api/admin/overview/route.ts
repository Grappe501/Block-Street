import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission, getAdminOverview } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "audit.view");
  return NextResponse.json({ overview: getAdminOverview(ctx), context: ctx });
});
