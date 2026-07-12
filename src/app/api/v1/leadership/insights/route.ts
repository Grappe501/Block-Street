import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getLeadershipInsights, updateLeadershipPrivacy } from "@/lib/leadership/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id");
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!userId || !institutionId) throw new ApiError("INVALID_REQUEST", "user_id and institution_id required", 400);
    return apiSuccess({ insights: getLeadershipInsights(userId, institutionId), advisory_only: true }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "leadership.view", endpoint: "/api/v1/leadership/insights" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      user_id: string;
      institution_id: string;
      public_leadership_profile?: boolean;
      achievement_sharing?: boolean;
      evaluations_private?: boolean;
    };
    const actorId = ctx.actor_id ?? "system";
    const privacy = updateLeadershipPrivacy({ ...body, actor_id: actorId });
    return apiSuccess({ privacy }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "leadership.manage", endpoint: "/api/v1/leadership/insights" }
);
