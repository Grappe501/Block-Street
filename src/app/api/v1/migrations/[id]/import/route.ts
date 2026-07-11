import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { runImport } from "@/lib/migration/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as { resume_from_checkpoint?: string };
    try {
      const result = runImport(migrationId, ctx.actor_id ?? "system", body.resume_from_checkpoint);
      return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Import failed", 400);
    }
  },
  { permission: "migration.manage", endpoint: "/api/v1/migrations/{migrationId}/import" }
);
