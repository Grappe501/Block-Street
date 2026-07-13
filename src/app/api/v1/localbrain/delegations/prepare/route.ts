import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { work_item: string; recommended_recipient: string };
      return livingIntelligenceApplicationService.prepareDelegation({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        ...body,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/delegations/prepare" }
);
