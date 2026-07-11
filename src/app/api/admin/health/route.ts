import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission, getAdminOverview } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "audit.view");
  const overview = getAdminOverview(ctx);
  return NextResponse.json({
    health: {
      authentication: "operational",
      database: "operational",
      search: overview.failed_jobs > 0 ? "degraded" : "operational",
      notifications: "operational",
      api_gateway: "operational",
      background_jobs: overview.failed_jobs > 0 ? "degraded" : "operational",
      platform: overview.platform_health,
    },
  });
});
