import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { addSource, assignSourceOwner } from "@/lib/migration/engine";
import { loadSources } from "@/lib/migration/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    return apiSuccess(
      { sources: loadSources().filter((s) => s.migration_project_id === migrationId) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "migration.view", endpoint: "/api/v1/migrations/{migrationId}/sources" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as {
      action?: string;
      source_id?: string;
      owner_user_id?: string;
      name?: string;
      source_type?: string;
      source_system?: string;
      source_owner_user_id?: string;
      source_location_reference?: string;
      source_format?: string;
      estimated_record_count?: number;
      contains_personal_data?: boolean;
      contains_restricted_data?: boolean;
    };
    try {
      if (body.action === "assign_owner" && body.source_id && body.owner_user_id) {
        return apiSuccess(
          { source: assignSourceOwner(body.source_id, body.owner_user_id, ctx.actor_id ?? "system") },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      const source = addSource(
        {
          migration_project_id: migrationId,
          name: body.name ?? "Unnamed Source",
          source_type: body.source_type ?? "csv",
          source_system: body.source_system ?? "legacy",
          source_owner_user_id: body.source_owner_user_id,
          source_location_reference: body.source_location_reference ?? "",
          source_format: body.source_format ?? "csv",
          estimated_record_count: body.estimated_record_count,
          contains_personal_data: body.contains_personal_data,
          contains_restricted_data: body.contains_restricted_data,
        },
        ctx.actor_id ?? "system"
      );
      return apiSuccess({ source }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Source action failed", 400);
    }
  },
  { permission: "migration.manage", endpoint: "/api/v1/migrations/{migrationId}/sources" }
);
