import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withStrategyApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withStrategyApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        review_cycle: "weekly" | "monthly" | "quarterly" | "semiannual" | "annual";
        what_changed: string;
        lessons_learned: string[];
        recommendations: string[];
      };
      const review = operationsApplicationService.completeReview({
        institution_id: apiCtx.institution_id,
        review_cycle: body.review_cycle,
        what_changed: body.what_changed,
        lessons_learned: body.lessons_learned ?? [],
        recommendations: body.recommendations ?? [],
      });
      return { review, event: "strategic_review.completed" };
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/strategy/review" }
);
