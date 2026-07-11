import { NextResponse } from "next/server";
import { loadAdminFeatureFlags, persistAdminFeatureFlags } from "@/lib/admin/data";
import { withAdmin } from "@/lib/admin/http";
import { adminAudit, assertAdminPermission } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "feature_flags.manage");
  return NextResponse.json({ feature_flags: loadAdminFeatureFlags() });
});

export const PATCH = withAdmin(async (ctx, request) => {
  assertAdminPermission(ctx, "feature_flags.manage");
  const body = await request.json();
  const flags = { ...loadAdminFeatureFlags(), ...body };
  persistAdminFeatureFlags(flags);
  adminAudit(ctx, "feature_flags_updated", "feature_flags", "platform", "success", { risk_level: "high" });
  return NextResponse.json({ feature_flags: flags });
});
