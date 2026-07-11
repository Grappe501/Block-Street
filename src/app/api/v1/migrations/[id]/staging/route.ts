import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { loadStagingRecords } from "@/lib/migration/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const migrationId = request.nextUrl.pathname.split("/")[3] ?? "";
    const records = loadStagingRecords().filter((r) => r.migration_project_id === migrationId);
    return apiSuccess({ records, total: records.length }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "migration.view", endpoint: "/api/v1/migrations/{migrationId}/staging" }
);
