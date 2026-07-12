import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getWaveDependencyStatus } from "@/lib/identity-trust/wave1/wave-prerequisite";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getWaveDependencyStatus(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/wave1/status" }
);
