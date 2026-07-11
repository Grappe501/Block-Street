import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { validateMigrationProject } from "@/lib/migration/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    const validation = validateMigrationProject(migrationId);
    return apiSuccess({ validation }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "migration.manage", endpoint: "/api/v1/migrations/{migrationId}/validate" }
);
