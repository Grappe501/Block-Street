import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission, loadAttentionQueue } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "audit.view");
  return NextResponse.json({ items: loadAttentionQueue() });
});
