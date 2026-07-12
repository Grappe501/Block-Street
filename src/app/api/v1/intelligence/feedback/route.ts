import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { recordRecommendationFeedback } from "@/lib/civic-action/builds/11.1/intelligence";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          recommendation_id?: string;
          action?: string;
          notes_optional?: string;
        };
        if (!body.recommendation_id || !body.action) {
          throw new ApiError("VALIDATION_ERROR", "recommendation_id and action are required", 400);
        }
        return recordRecommendationFeedback({
          recommendation_id: body.recommendation_id,
          action: body.action as "dismiss",
          actor_human_id: apiCtx.actor_human_id,
          institution_id: apiCtx.institution_id,
          notes_optional: body.notes_optional,
        });
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/feedback" }
);
