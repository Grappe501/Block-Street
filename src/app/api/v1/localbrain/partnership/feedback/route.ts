import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) =>
      livingIntelligenceApplicationService.listPartnershipFeedback(apiCtx.human_id)
    ),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/partnership/feedback" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        recommendation_id: string;
        accuracy: number;
        helpfulness: number;
        completeness: number;
        clarity: number;
        bias_concerns?: string | null;
        missing_evidence?: string | null;
        incorrect_assumptions?: string | null;
        suggested_improvements?: string | null;
      };
      return livingIntelligenceApplicationService.submitPartnershipFeedback({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        ...body,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/partnership/feedback" }
);
