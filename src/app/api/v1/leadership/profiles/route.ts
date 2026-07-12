import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import {
  computeLeadershipScore,
  getLeadershipProfile,
  getTeamLeaderOpportunities,
  identifyEmergingLeaders,
  listLeadershipProfiles,
} from "@/lib/leadership/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const userId = request.nextUrl.searchParams.get("user_id");
    if (userId && institutionId) {
      return apiSuccess({ profile: getLeadershipProfile(userId, institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess({ profiles: listLeadershipProfiles(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "leadership.view", endpoint: "/api/v1/leadership/profiles" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      user_id: string;
      action?: string;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "identify_emerging") {
        return apiSuccess({ emerging_leaders: identifyEmergingLeaders(body.institution_id, actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "compute_score") {
        const profile = computeLeadershipScore(body.user_id, body.institution_id, actorId);
        const opportunities = getTeamLeaderOpportunities(body.user_id, body.institution_id);
        return apiSuccess({ profile, opportunities }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      return apiSuccess({ profile: getLeadershipProfile(body.user_id, body.institution_id) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Profile action failed", 400);
    }
  },
  { permission: "leadership.manage", endpoint: "/api/v1/leadership/profiles" }
);
