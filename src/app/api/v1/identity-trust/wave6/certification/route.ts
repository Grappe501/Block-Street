import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { runWave6Certification } from "@/lib/identity-trust/wave6/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(runWave6Certification(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/wave6/certification" }
);
