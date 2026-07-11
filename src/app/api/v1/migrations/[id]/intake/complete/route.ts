import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { completeIntake } from "@/lib/migration/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as {
      migration_source_id: string;
      original_filename: string;
      content: string;
      mime_type?: string;
    };
    try {
      const result = completeIntake(
        {
          migration_project_id: migrationId,
          migration_source_id: body.migration_source_id,
          uploaded_by: ctx.actor_id ?? "system",
          original_filename: body.original_filename,
          content: body.content,
          mime_type: body.mime_type,
        },
        ctx.actor_id ?? "system"
      );
      return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Intake failed", 400);
    }
  },
  { permission: "migration.manage", endpoint: "/api/v1/migrations/{migrationId}/intake/complete" }
);
