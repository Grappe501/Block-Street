import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getWave6Overview, getWave6DependencyStatus } from "@/lib/identity-trust/wave6/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mode = request.nextUrl.searchParams.get("mode");
    if (mode === "dependencies") {
      return apiSuccess(getWave6DependencyStatus(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(getWave6Overview(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/wave6/status" }
);
