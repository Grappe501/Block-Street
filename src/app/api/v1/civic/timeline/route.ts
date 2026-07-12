import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getUserMilestones, getUserTimeline } from "@/lib/civic/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id");
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!userId || !institutionId) throw new ApiError("INVALID_REQUEST", "user_id and institution_id required", 400);
    return apiSuccess(
      { timeline: getUserTimeline(userId, institutionId), milestones: getUserMilestones(userId, institutionId) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "civic.view", endpoint: "/api/v1/civic/timeline" }
);
