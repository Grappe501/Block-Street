import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getCommunityHealthProfile } from "@/lib/community-health/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const communityId = request.nextUrl.searchParams.get("community_id");
    if (!communityId) throw new Error("community_id is required");
    const profile = getCommunityHealthProfile(communityId);
    return apiSuccess(
      profile
        ? {
            resilience_score: profile.resilience_score,
            resilience_state: profile.resilience_state,
            health_breakdown: profile.health_breakdown,
          }
        : null,
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "community_health.view", endpoint: "/api/v1/community-health/resilience" }
);
