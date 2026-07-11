import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { approveMigration, submitApproval } from "@/lib/migration/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as { action?: string; approval_type: string; conditions?: string[] };
    try {
      if (body.action === "submit") {
        return apiSuccess(
          { approval: submitApproval(migrationId, body.approval_type, ctx.actor_id ?? "system") },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      const approval = approveMigration(migrationId, body.approval_type, ctx.actor_id ?? "system", body.conditions);
      return apiSuccess({ approval }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Approval failed", 400);
    }
  },
  { permission: "migration.approve", endpoint: "/api/v1/migrations/{migrationId}/approve" }
);
