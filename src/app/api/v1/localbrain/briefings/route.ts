import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) =>
      livingIntelligenceApplicationService.listExecutiveBriefings(apiCtx.human_id)
    ),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/briefings" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { briefing_type?: string; language?: string };
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      return livingIntelligenceApplicationService.generateExecutiveBriefing({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        institution_id: apiCtx.institution_id,
        briefing_type: (body.briefing_type as "morning" | undefined) ?? "morning",
        language: body.language,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/briefings/generate" }
);
