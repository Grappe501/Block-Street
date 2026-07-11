import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { loadMigrations } from "@/lib/deployment/data";

export const GET = withApiGateway(
  async (ctx) => {
    return apiSuccess(
      { migrations: loadMigrations() },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "deployments.view", endpoint: "/api/v1/deployments/migrations" }
);
