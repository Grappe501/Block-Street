import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) =>
      livingIntelligenceApplicationService.getDailyPlan(apiCtx.human_id)
    ),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/organizer/daily-plan" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { plan_type?: string; sections?: { title: string; items: string[] }[] };
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      return livingIntelligenceApplicationService.createDailyPlan({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        institution_id: apiCtx.institution_id,
        plan_type: body.plan_type as "morning" | undefined,
        sections: body.sections,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/organizer/daily-plan" }
);
