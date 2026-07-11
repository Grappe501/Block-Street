import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getJourney, pauseJourney, resumeJourney } from "@/lib/onboarding/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const journeyId = request.nextUrl.pathname.split("/")[4] ?? "";
    try {
      return apiSuccess(getJourney(journeyId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("NOT_FOUND", e instanceof Error ? e.message : "Journey not found", 404);
    }
  },
  { permission: "onboarding.view", endpoint: "/api/v1/onboarding/journeys/{journeyId}" }
);

export const PATCH = withApiGateway(
  async (ctx, request) => {
    const journeyId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { action?: string };
    try {
      if (body.action === "pause") {
        return apiSuccess({ journey: pauseJourney(journeyId, ctx.actor_id ?? "system") }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      throw new Error("Unknown action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Update failed", 400);
    }
  },
  { permission: "onboarding.manage", endpoint: "/api/v1/onboarding/journeys/{journeyId}" }
);
