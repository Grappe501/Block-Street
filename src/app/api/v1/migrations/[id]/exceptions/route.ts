import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { loadExceptions } from "@/lib/migration/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    const exceptions = loadExceptions().filter((e) => e.migration_project_id === migrationId);
    return apiSuccess({ exceptions, open: exceptions.filter((e) => e.status !== "resolved").length }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "migration.view", endpoint: "/api/v1/migrations/{migrationId}/exceptions" }
);
