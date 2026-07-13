import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { question: string; language?: string };
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      return livingIntelligenceApplicationService.answerExecutiveInquiry({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        institution_id: apiCtx.institution_id,
        question: body.question,
        language: body.language,
      });
    }),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/executive-inquiry" }
);
