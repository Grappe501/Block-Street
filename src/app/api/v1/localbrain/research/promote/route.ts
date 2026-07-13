import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        research_id: string;
        from_stage: string;
        to_stage: string;
      };
      return livingIntelligenceApplicationService.requestResearchPromotion({
        research_id: body.research_id,
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        from_stage: body.from_stage as Parameters<
          typeof livingIntelligenceApplicationService.requestResearchPromotion
        >[0]["from_stage"],
        to_stage: body.to_stage as Parameters<
          typeof livingIntelligenceApplicationService.requestResearchPromotion
        >[0]["to_stage"],
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/research/promote" }
);
