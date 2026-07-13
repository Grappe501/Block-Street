import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) => {
      const eventId = request.nextUrl.pathname.split("/")[5] ?? "";
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      const existing = livingIntelligenceApplicationService.prepareMeeting({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        institution_id: apiCtx.institution_id,
        event_id: eventId,
      });
      return existing;
    }),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/meetings/{eventId}/preparation" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const eventId = request.nextUrl.pathname.split("/")[5] ?? "";
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      return livingIntelligenceApplicationService.prepareMeeting({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        institution_id: apiCtx.institution_id,
        event_id: eventId,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/meetings/{eventId}/prepare" }
);
