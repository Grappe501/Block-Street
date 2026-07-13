import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        role_context: string;
        goals: string[];
        competency_gaps?: string[];
        language?: string;
        available_time?: string;
      };
      return livingIntelligenceApplicationService.createLearningPlan({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        role_context: body.role_context,
        goals: body.goals,
        competency_gaps: body.competency_gaps,
        language: body.language as "en" | "es" | undefined,
        available_time: body.available_time,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/learning/plan" }
);
