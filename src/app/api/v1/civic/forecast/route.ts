import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { forecastParticipation } from "@/lib/civic/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    const communityId = request.nextUrl.searchParams.get("community_id");
    if (!institutionId || !communityId) {
      throw new ApiError("INVALID_REQUEST", "institution_id and community_id required", 400);
    }
    const actorId = ctx.actor_id ?? "system";
    return apiSuccess(
      { forecast: forecastParticipation(institutionId, communityId, actorId) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "civic.view", endpoint: "/api/v1/civic/forecast" }
);
