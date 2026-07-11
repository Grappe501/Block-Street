import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getEnvironmentIdentity } from "@/lib/deployment/engine";

export const GET = withApiGateway(
  async (ctx) => {
    const identity = getEnvironmentIdentity();
    return apiSuccess(
      {
        status: "healthy",
        service: "deployment",
        ...identity,
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { public: true, endpoint: "/api/v1/deployments/health" }
);
