import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        purpose: string;
        duration_minutes?: number;
        linked_mission_id?: string;
        linked_task_id?: string;
      };
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      return livingIntelligenceApplicationService.startFocusSession({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        purpose: body.purpose,
        duration_minutes: body.duration_minutes,
        linked_mission_id: body.linked_mission_id,
        linked_task_id: body.linked_task_id,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/focus-sessions" }
);
