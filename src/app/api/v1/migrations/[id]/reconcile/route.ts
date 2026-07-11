import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { reconcileMigration } from "@/lib/migration/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    try {
      const report = reconcileMigration(migrationId, ctx.actor_id ?? "system");
      return apiSuccess({ reconciliation: report }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Reconciliation failed", 400);
    }
  },
  { permission: "migration.manage", endpoint: "/api/v1/migrations/{migrationId}/reconcile" }
);
