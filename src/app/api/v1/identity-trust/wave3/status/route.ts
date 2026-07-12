import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getWave3DependencyStatus } from "@/lib/identity-trust/wave3/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getWave3DependencyStatus(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/wave3/status" }
);
