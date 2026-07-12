import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getDecisionSupport } from "@/lib/strategic-intelligence/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const recommendationId = request.nextUrl.searchParams.get("recommendation_id");
    if (!recommendationId) throw new Error("recommendation_id is required");
    return apiSuccess(getDecisionSupport(recommendationId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "strategic_intelligence.view", endpoint: "/api/v1/strategic-intelligence/decision-support" }
);
