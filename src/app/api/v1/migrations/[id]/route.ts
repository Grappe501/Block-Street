import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getProjectDetail, updateProjectStatus } from "@/lib/migration/engine";
import type { MigrationProjectStatus } from "@/lib/migration/types";

export const GET = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    try {
      return apiSuccess(getProjectDetail(migrationId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("NOT_FOUND", e instanceof Error ? e.message : "Migration not found", 404);
    }
  },
  { permission: "migration.view", endpoint: "/api/v1/migrations/{migrationId}" }
);

export const PATCH = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as { status?: MigrationProjectStatus; action?: string };
    try {
      if (body.action === "pause") {
        return apiSuccess({ project: updateProjectStatus(migrationId, "paused", ctx.actor_id ?? "system") }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "resume") {
        return apiSuccess({ project: updateProjectStatus(migrationId, "staging", ctx.actor_id ?? "system") }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "cancel") {
        return apiSuccess({ project: updateProjectStatus(migrationId, "cancelled", ctx.actor_id ?? "system") }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.status) {
        return apiSuccess({ project: updateProjectStatus(migrationId, body.status, ctx.actor_id ?? "system") }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      throw new Error("Unknown patch action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Update failed", 400);
    }
  },
  { permission: "migration.manage", endpoint: "/api/v1/migrations/{migrationId}" }
);
