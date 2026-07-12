import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getExecutiveCommunityDashboard, listCommunityHealthProfiles } from "@/lib/community-health/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const countyId = request.nextUrl.searchParams.get("county_id") ?? "pulaski";
    return apiSuccess(
      {
        profiles: listCommunityHealthProfiles(countyId),
        executive: getExecutiveCommunityDashboard(countyId),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "community_health.view", endpoint: "/api/v1/community-health/analytics" }
);
