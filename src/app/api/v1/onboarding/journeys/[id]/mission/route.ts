import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { completeFirstMission } from "@/lib/onboarding/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const journeyId = request.nextUrl.pathname.split("/")[4] ?? "";
    try {
      const journey = completeFirstMission(journeyId, ctx.actor_id ?? "system");
      return apiSuccess({ journey }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Mission completion failed", 400);
    }
  },
  { permission: "onboarding.manage", endpoint: "/api/v1/onboarding/journeys/{journeyId}/mission" }
);
