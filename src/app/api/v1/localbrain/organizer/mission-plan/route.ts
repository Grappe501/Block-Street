import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) => {
      const missionId = request.nextUrl.searchParams.get("mission_id") ?? "msn-block-street-001";
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      return livingIntelligenceApplicationService.getMissionPlan({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        institution_id: apiCtx.institution_id,
        mission_id: missionId,
      });
    }),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/organizer/mission-plan" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { mission_id: string };
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      return livingIntelligenceApplicationService.getMissionPlan({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        institution_id: apiCtx.institution_id,
        mission_id: body.mission_id,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/organizer/mission-plan" }
);
