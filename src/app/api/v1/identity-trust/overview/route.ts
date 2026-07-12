import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getIdentityTrustOverview } from "@/lib/identity-trust/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getIdentityTrustOverview(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/overview" }
);
