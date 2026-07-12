import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getWave5Overview } from "@/lib/identity-trust/wave5/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getWave5Overview(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/wave5/status" }
);
