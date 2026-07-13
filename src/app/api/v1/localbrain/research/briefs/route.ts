import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) =>
      livingIntelligenceApplicationService.listResearchBriefs(apiCtx.human_id)
    ),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/research/briefs" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        brief_type: string;
        title: string;
        evidence?: string[];
        contradictions?: string[];
      };
      return livingIntelligenceApplicationService.generateResearchBrief({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        brief_type: body.brief_type as Parameters<
          typeof livingIntelligenceApplicationService.generateResearchBrief
        >[0]["brief_type"],
        title: body.title,
        evidence: body.evidence,
        contradictions: body.contradictions,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/research/briefs" }
);
