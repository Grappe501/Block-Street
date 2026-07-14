import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { package_id: string };
      return livingIntelligenceApplicationService.bootstrapInstitution({
        institution_id: apiCtx.institution_id,
        human_id: apiCtx.human_id,
        package_id: body.package_id,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/genesis/institution/bootstrap" }
);
