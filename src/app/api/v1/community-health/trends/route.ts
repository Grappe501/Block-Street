import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getLongitudinalTrends } from "@/lib/community-health/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const communityId = request.nextUrl.searchParams.get("community_id");
    if (!communityId) throw new Error("community_id is required");
    return apiSuccess(getLongitudinalTrends(communityId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_health.view", endpoint: "/api/v1/community-health/trends" }
);
