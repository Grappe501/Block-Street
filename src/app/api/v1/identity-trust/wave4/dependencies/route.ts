import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getWave4DependencyStatus } from "@/lib/identity-trust/wave4/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getWave4DependencyStatus(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/wave4/dependencies" }
);
