import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { runWave2Certification, getWave2Overview } from "@/lib/identity-trust/wave2/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(
      { overview: getWave2Overview(), certification: runWave2Certification() },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    ),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/wave2/certification" }
);
