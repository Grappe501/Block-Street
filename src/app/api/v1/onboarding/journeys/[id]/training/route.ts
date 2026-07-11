import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { completeTraining } from "@/lib/onboarding/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const journeyId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { training_key: string };
    try {
      const training = completeTraining(journeyId, body.training_key, ctx.actor_id ?? "system");
      return apiSuccess({ training }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Training update failed", 400);
    }
  },
  { permission: "onboarding.manage", endpoint: "/api/v1/onboarding/journeys/{journeyId}/training" }
);
