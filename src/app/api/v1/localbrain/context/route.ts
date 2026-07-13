import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) =>
      livingIntelligenceApplicationService.assembleContextIntelligence({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
      })
    ),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/context" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        institution_id?: string;
        mission_id?: string;
        device?: string;
      };
      return livingIntelligenceApplicationService.updateLocalBrainContext({
        human_id: apiCtx.human_id,
        institution_id: body.institution_id ?? apiCtx.institution_id,
        mission_id: body.mission_id,
        device: body.device,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/context" }
);
