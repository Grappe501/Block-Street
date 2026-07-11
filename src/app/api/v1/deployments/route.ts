import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listDeployments } from "@/lib/deployment/engine";

export const GET = withApiGateway(
  async (ctx) => {
    const data = listDeployments();
    return apiSuccess(
      {
        candidates: data.candidates,
        manifests: data.manifests,
        environments: data.environments,
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "deployments.view", endpoint: "/api/v1/deployments" }
);
