import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { loadEnvironments, loadConfigDrift } from "@/lib/deployment/data";

export const GET = withApiGateway(
  async (ctx) => {
    return apiSuccess(
      { environments: loadEnvironments() },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "deployments.view", endpoint: "/api/v1/deployments/environments" }
);
