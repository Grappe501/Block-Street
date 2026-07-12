import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getIdentityTrustPolicy } from "@/lib/identity-trust/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getIdentityTrustPolicy(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { public: true, endpoint: "/api/v1/identity-trust/policy" }
);
