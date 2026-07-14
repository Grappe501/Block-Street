import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { twin_id: string };
      return livingIntelligenceApplicationService.resetTwinSandbox({
        twin_id: body.twin_id,
        institution_id: apiCtx.institution_id,
        human_id: apiCtx.human_id,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/digital-twin/sandbox/reset" }
);
