import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { runWave5Certification } from "@/lib/identity-trust/wave5/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(runWave5Certification(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/wave5/certification" }
);
