import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getCommunityDashboard } from "@/lib/community-health/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const communityId = request.nextUrl.searchParams.get("community_id");
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!communityId || !institutionId) throw new Error("community_id and institution_id are required");
    return apiSuccess(getCommunityDashboard(communityId, institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_health.view", endpoint: "/api/v1/community-health/dashboard" }
);
