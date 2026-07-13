import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        mission_id?: string;
        institution_id?: string;
        task_id?: string;
      };
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      return livingIntelligenceApplicationService.selectActiveContext({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        mission_id: body.mission_id,
        institution_id: body.institution_id ?? apiCtx.institution_id,
        task_id: body.task_id,
        authority_level: "human_declared",
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/context/select" }
);
