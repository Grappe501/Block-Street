import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listTrustDemotions, listTrustPromotions } from "@/lib/identity-trust/governance";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id") ?? undefined;
    return apiSuccess(
      {
        promotions: listTrustPromotions(userId),
        demotions: listTrustDemotions(userId),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/trust" }
);
