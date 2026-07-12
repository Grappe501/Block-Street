import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listCommunityHealthProfiles, refreshCommunityHealthProfile } from "@/lib/community-health/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const countyId = request.nextUrl.searchParams.get("county_id") ?? undefined;
    return apiSuccess(listCommunityHealthProfiles(countyId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_health.view", endpoint: "/api/v1/community-health/profiles" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const profile = refreshCommunityHealthProfile({
      community_id: body.community_id,
      county_id: body.county_id,
      region_id: body.region_id,
      institution_id: body.institution_id,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(profile, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "community_health.manage", endpoint: "/api/v1/community-health/profiles" }
);
