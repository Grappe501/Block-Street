import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        field_corrected: string;
        previous_value: string;
        corrected_value: string;
      };
      const brain = livingIntelligenceApplicationService.getLocalBrain(apiCtx.human_id);
      if (!brain) throw new Error("LocalBrain not found");
      return livingIntelligenceApplicationService.correctActiveContext({
        human_id: apiCtx.human_id,
        localbrain_id: brain.localbrain_id,
        field_corrected: body.field_corrected,
        previous_value: body.previous_value,
        corrected_value: body.corrected_value,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/context/correct" }
);
