import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        course_id: string;
        score: number;
        evaluator: string;
      };
      return livingIntelligenceApplicationService.submitLearningAssessment({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        course_id: body.course_id,
        score: body.score,
        evaluator: body.evaluator,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/learning/assessment" }
);
